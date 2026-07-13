"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GitBranch,
  Search,
  Plus,
  Star,
  GitFork,
  CheckCircle2,
  Clock,
} from "lucide-react";

const repos = [
  {
    name: "veritas-node/core",
    description: "Core verification engine and smart contracts",
    stars: 128,
    forks: 34,
    status: "verified",
    lastVerified: "2 hours ago",
    confidence: 0.987,
  },
  {
    name: "veritas-node/frontend",
    description: "Next.js dashboard and visualization components",
    stars: 89,
    forks: 21,
    status: "verified",
    lastVerified: "5 hours ago",
    confidence: 0.953,
  },
  {
    name: "veritas-node/ai-models",
    description: "TensorFlow models for data integrity verification",
    stars: 67,
    forks: 15,
    status: "pending",
    lastVerified: "N/A",
    confidence: 0,
  },
];

export default function RepositoriesPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and verify GitHub repository development patterns
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Repository
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search repositories..." className="pl-10" />
          </div>
        </div>

        <div className="grid gap-4">
          {repos.map((repo) => (
            <Card key={repo.name} className="hover:border-primary/20 transition-all group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{repo.name}</span>
                        <Badge
                          variant={repo.status === "verified" ? "success" : "warning"}
                          className="gap-1"
                        >
                          {repo.status === "verified" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {repo.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {repo.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" /> {repo.forks}
                        </span>
                        <span>Last verified: {repo.lastVerified}</span>
                      </div>
                    </div>
                  </div>
                  {repo.confidence > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold">
                        {(repo.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        confidence
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
