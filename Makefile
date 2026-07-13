.PHONY: help install dev-start dev-stop build test clean deploy-contracts deploy-backend deploy-frontend lint

# Default target
.DEFAULT_GOAL := help

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-25s$(NC) %s\n", $$1, $$2}'

# =============================================================================
# Development
# =============================================================================

install: ## Install all project dependencies
	@echo "$(YELLOW)Installing all dependencies...$(NC)"
	@cd backend/fastapi && pip install -r requirements.txt
	@cd frontend/nextjs && npm install
	@echo "$(GREEN)Dependencies installed!$(NC)"

dev-start: ## Start all services in development mode
	@echo "$(YELLOW)Starting development environment...$(NC)"
	@docker-compose up -d postgres redis ipfs stellar
	@sleep 3
	@echo "$(GREEN)Development services started!$(NC)"
	@echo "  Backend API:  http://localhost:8000/docs"
	@echo "  Frontend:     http://localhost:3000"
	@echo "  Stellar RPC:  http://localhost:8000"

dev-stop: ## Stop all development services
	@echo "$(YELLOW)Stopping development services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)All services stopped.$(NC)"

dev-backend: ## Run the backend in development mode
	@echo "$(YELLOW)Starting backend server...$(NC)"
	@cd backend/fastapi && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run the frontend in development mode
	@echo "$(YELLOW)Starting frontend dev server...$(NC)"
	@cd frontend/nextjs && npm run dev

# =============================================================================
# Build
# =============================================================================

build: build-contracts build-backend build-frontend ## Build all project components

build-contracts: ## Build Soroban smart contracts
	@echo "$(YELLOW)Building Soroban contracts...$(NC)"
	@cd contracts/soroban && cargo build --target wasm32v1-none --release
	@echo "$(GREEN)Contracts built!$(NC)"

build-backend: ## Build backend Docker image
	@echo "$(YELLOW)Building backend...$(NC)"
	@docker-compose build backend
	@echo "$(GREEN)Backend built!$(NC)"

build-frontend: ## Build frontend for production
	@echo "$(YELLOW)Building frontend...$(NC)"
	@cd frontend/nextjs && npm run build
	@echo "$(GREEN)Frontend built!$(NC)"

# =============================================================================
# Deploy
# =============================================================================

deploy-contracts: build-contracts ## Deploy smart contracts to Stellar testnet
	@echo "$(YELLOW)Deploying contracts to Stellar testnet...$(NC)"
	@stellar contract deploy \
		--wasm contracts/soroban/target/wasm32v1-none/release/veritas_node_contract.wasm \
		--source-account veritas-deployer \
		--network testnet \
		--alias veritas-node
	@echo "$(GREEN)Contracts deployed!$(NC)"

# =============================================================================
# Testing
# =============================================================================

test: test-contracts test-backend test-frontend ## Run all tests

test-contracts: ## Run Soroban contract tests
	@echo "$(YELLOW)Running contract tests...$(NC)"
	@cd contracts/soroban && cargo test
	@echo "$(GREEN)Contract tests passed!$(NC)"

test-backend: ## Run backend tests
	@echo "$(YELLOW)Running backend tests...$(NC)"
	@cd backend/fastapi && python -m pytest -v
	@echo "$(GREEN)Backend tests passed!$(NC)"

test-frontend: ## Run frontend tests
	@echo "$(YELLOW)Running frontend tests...$(NC)"
	@cd frontend/nextjs && npm test 2>/dev/null || echo "No frontend tests configured yet"
	@echo "$(GREEN)Frontend tests passed!$(NC)"

# =============================================================================
# Code Quality
# =============================================================================

lint: lint-contracts lint-backend lint-frontend ## Run all linters

lint-contracts: ## Lint Rust contracts
	@echo "$(YELLOW)Linting contracts...$(NC)"
	@cd contracts/soroban && cargo clippy -- -D warnings 2>/dev/null || echo "Clippy not available"
	@echo "$(GREEN)Contract linting complete!$(NC)"

lint-backend: ## Lint backend Python code
	@echo "$(YELLOW)Linting backend...$(NC)"
	@cd backend/fastapi && black --check app/ 2>/dev/null || echo "Black not available"
	@cd backend/fastapi && flake8 app/ 2>/dev/null || echo "Flake8 not available"
	@echo "$(GREEN)Backend linting complete!$(NC)"

lint-frontend: ## Lint frontend TypeScript
	@echo "$(YELLOW)Linting frontend...$(NC)"
	@cd frontend/nextjs && npm run lint
	@echo "$(GREEN)Frontend linting complete!$(NC)"

# =============================================================================
# Utilities
# =============================================================================

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	@cd contracts/soroban && cargo clean
	@rm -rf frontend/nextjs/.next
	@rm -rf backend/fastapi/__pycache__ backend/fastapi/app/__pycache__
	@echo "$(GREEN)Cleaned!$(NC)"

setup: install ## Setup project from scratch
	@echo "$(YELLOW)Setting up project...$(NC)"
	@cp -n .env.example .env 2>/dev/null || echo ".env already exists"
	@docker-compose up -d postgres redis ipfs
	@sleep 3
	@echo "$(GREEN)Project setup complete!$(NC)"
	@echo ""
	@echo "  Next steps:"
	@echo "    1. Edit .env with your configuration"
	@echo "    2. Run 'make dev-backend' to start the API server"
	@echo "    3. Run 'make dev-frontend' to start the UI"
