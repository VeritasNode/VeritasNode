"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  RefreshCw,
  GitCommit,
  Image,
  FileText,
  Globe,
  ArrowUpRight,
} from "lucide-react";

const events = [
  {
    id: 1,
    icon: Image,
    title: "Satellite image verification complete",
    description: "Region: Northeastern Basin - Confidence: 99.2%",
    time: "2 minutes ago",
    type: "verification",
  },
  {
    id: 2,
    icon: GitCommit,
    title: "Repository milestone verified",
    description: "repo: veritas-node/core - Commit #847 matches expected pattern",
    time: "15 minutes ago",
    type: "repository",
  },
  {
    id: 3,
    icon: Globe,
    title: "On-chain anchor confirmed",
    description: "Transaction confirmed on Stellar ledger #12,348",
    time: "28 minutes ago",
    type: "blockchain",
  },
  {
    id: 4,
    icon: FileText,
    title: "Document authenticity verified",
    description: "Certificate hash matches on-chain record",
    time: "1 hour ago",
    type: "verification",
  },
  {
    id: 5,
    icon: Image,
    title: "AI anomaly detection triggered",
    description: "Deviation detected in southwestern region imagery",
    time: "2 hours ago",
    type: "alert",
  },
];

export default function ActivityPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and event stream
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Event Stream
              <span className="ml-auto flex items-center gap-1.5 text-xs font-normal text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
                Live
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {events.map((event) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      event.type === "alert"
                        ? "bg-red-400/10"
                        : "bg-primary/10"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        event.type === "alert" ? "text-red-400" : "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {event.title}
                        </span>
                        {event.type === "alert" && (
                          <span className="text-[10px] font-medium text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                            ALERT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs text-muted-foreground">
                      <span>{event.time}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
