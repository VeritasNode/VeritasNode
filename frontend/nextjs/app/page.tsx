"use client";

import AppLayout from "@/components/layout/app-layout";
import StatsCards from "@/components/dashboard/stats-cards";
import VerificationChart from "@/components/dashboard/verification-chart";
import RecentVerifications from "@/components/dashboard/recent-verifications";
import ConfidenceDistribution from "@/components/dashboard/confidence-distribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">
              VeritasNode
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered data integrity verification with transparent audit
              trails
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20 text-sm text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
              Stellar Testnet
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-400/10 border border-blue-400/20 text-sm text-blue-400">
              <Activity className="w-4 h-4" />
              Live
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <VerificationChart />
          <ConfidenceDistribution />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentVerifications />
          </div>

          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Verification Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "Image Analysis", count: 4582, pct: 35 },
                { type: "Document Verification", count: 3241, pct: 25 },
                { type: "Repository Audit", count: 2893, pct: 22 },
                { type: "Data Integrity Check", count: 2131, pct: 18 },
              ].map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.type}</span>
                    <span className="font-medium">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
