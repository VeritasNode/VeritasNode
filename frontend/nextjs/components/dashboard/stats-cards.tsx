"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileCheck, Activity, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  className?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-green-400" : "text-red-400"
              )}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  const stats = [
    {
      title: "Total Verifications",
      value: "12,847",
      description: "lifetime verifications",
      icon: ShieldCheck,
      trend: { value: 12.5, positive: true },
    },
    {
      title: "Verified Today",
      value: "243",
      description: "success rate 98.5%",
      icon: FileCheck,
      trend: { value: 8.2, positive: true },
    },
    {
      title: "Active Monitors",
      value: "156",
      description: "real-time watchers",
      icon: Activity,
      trend: { value: 3.1, positive: true },
    },
    {
      title: "On-Chain Records",
      value: "9,432",
      description: "anchored to Stellar",
      icon: Database,
      trend: { value: 15.8, positive: true },
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
