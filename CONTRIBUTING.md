# Contributing to VERITAS NODE

Thank you for your interest in contributing to VERITAS NODE! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Contributing Areas](#contributing-areas)
- [Submission Guidelines](#submission-guidelines)
- [Review Process](#review-process)
- [Testing Requirements](#testing-requirements)

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## Development Setup

### Prerequisites
- Rust 1.70+ with Soroban CLI
- Python 3.11+ with pip
- Node.js 18+ with npm
- Docker and Docker Compose
- Git

### Initial Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/veritas-node.git
   cd veritas-node
   ```

2. **Install dependencies**
   ```bash
   # Install all project dependencies
   make install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development environment**
   ```bash
   make dev-setup
   ```

## Contributing Areas

### 1. Smart Contracts (Rust/Soroban)
- **Location**: `contracts/soroban/`
- **Skills**: Rust, blockchain development, Soroban SDK
- **Tasks**: 
  - Contract logic implementation
  - Gas optimization
  - Security audits
  - Test coverage

### 2. Backend Services (Python/FastAPI)
- **Location**: `backend/fastapi/`
- **Skills**: Python, FastAPI, AI/ML, data processing
- **Tasks**:
  - API endpoint development
  - AI verification algorithms
  - Data analysis pipelines
  - IPFS integration

### 3. Frontend Application (Next.js/React)
- **Location**: `frontend/nextjs/`
- **Skills**: React, TypeScript, data visualization
- **Tasks**:
  - UI component development
  - Real-time data visualization
  - User experience improvements
  - Responsive design

### 4. Infrastructure & DevOps
- **Location**: `scripts/`, `docker-compose.yml`
- **Skills**: Docker, CI/CD, cloud deployment
- **Tasks**:
  - Deployment automation
  - Monitoring and logging
  - Security hardening
  - Performance optimization

## Submission Guidelines

### Branch Naming
- `feature/your-feature-name`
- `bugfix/issue-description`
- `hotfix/critical-fix`
- `docs/documentation-update`

### Commit Messages
Follow [Conventional Commits](https://conventionalcommits.org/) format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(contracts): add verification milestone function`
- `fix(backend): resolve IPFS pinning timeout`
- `docs(frontend): update API documentation`

### Pull Request Process

1. **Create issue** (if not already exists)
2. **Create branch** from `main`
3. **Make changes** with proper testing
4. **Submit PR** with detailed description
5. **Code review** and address feedback
6. **Merge** after approval

## Review Process

### Requirements for Merge
- [ ] All tests pass
- [ ] Code coverage > 80%
- [ ] Documentation updated
- [ ] Security review passed
- [ ] Performance impact assessed
- [ ] At least 2 approvals for core changes

### Review Checklist
- Code follows project style guidelines
- Tests are comprehensive and passing
- Documentation is accurate and complete
- No breaking changes without proper versioning
- Security best practices are followed

## Testing Requirements

### Unit Tests
- **Contracts**: Use Soroban test framework
- **Backend**: Use pytest with coverage
- **Frontend**: Use Jest and React Testing Library

### Integration Tests
- End-to-end workflow testing
- Cross-component integration
- External service mocking

### Performance Tests
- Load testing for API endpoints
- Gas optimization for contracts
- Frontend rendering performance

## Development Guidelines

### Code Style
- **Rust**: Use `rustfmt` and `clippy`
- **Python**: Follow PEP 8, use `black` and `flake8`
- **TypeScript**: Use ESLint and Prettier
- **React**: Follow React best practices

### Security
- Never commit secrets or API keys
- Use environment variables for configuration
- Follow OWASP security guidelines
- Regular security audits

### Documentation
- Update README for new features
- Add inline code comments
- Update API documentation
- Create user guides for complex features

## Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time discussion and help
- **GitHub Discussions**: General questions and ideas

### Resources
- [Soroban Documentation](https://soroban.stellar.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [IPFS Documentation](https://docs.ipfs.io/)

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Annual contributor highlights
- Special contributor badges

Thank you for contributing to VERITAS NODE!
