"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDate,
  truncateHash,
  verificationTypeIcons,
  getStatusBadge,
  getStatusIcon,
} from "@/lib/utils";
import { useVerifications } from "@/lib/api";
import {
  Search,
  ShieldCheck,
  FileText,
  Database,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Inbox,
  ChevronLeft,
} from "lucide-react";

export default function VerificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error, refetch } = useVerifications({
    page,
    page_size: pageSize,
    status: activeTab !== "all" ? activeTab : undefined,
    submitter_address: searchQuery.trim() || undefined,
  });

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Verifications</h1>
            <p className="text-muted-foreground mt-1">
              Submit and monitor data integrity verifications
            </p>
          </div>
          <Button variant="gradient" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            New Verification
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by submitter address..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="space-y-4"
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setPage(1);
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {error}
                </p>
                <Button
                  variant="outline"
                  onClick={refetch}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && (!data?.records || data.records.length === 0) && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Inbox className="w-10 h-10 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  No verifications found
                </p>
                {activeTab !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("all")}
                  >
                    Show all
                  </Button>
                )}
              </div>
            )}

            {/* Data state */}
            {!loading && !error && data?.records && data.records.length > 0 && (
              <>
                <div className="text-xs text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, data.total)} of {data.total}{" "}
                  results
                </div>

                <div className="space-y-3">
                  {data.records.map((record) => {
                    const Icon =
                      verificationTypeIcons[record.verification_type] || FileText;
                    return (
                      <Card
                        key={record.id}
                        className="hover:border-primary/20 cursor-pointer transition-all group"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">                  <span className="font-medium">
                    {record.verification_type
                      .charAt(0)
                      .toUpperCase() +
                      record.verification_type.slice(1)}{" "}
                    Verification
                  </span>
                  <Badge
                    variant={getStatusBadge(record.status)}
                    className="gap-1"
                  >
                    {getStatusIcon(record.status)}
                    {record.status}
                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                                  <span className="font-mono">
                                    {truncateHash(record.data_hash, 8)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {truncateHash(
                                      record.submitter_address,
                                      6
                                    )}
                                  </span>
                                  <span>•</span>
                                  <span>{formatDate(record.created_at)}</span>
                                  {record.tx_hash && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1 text-green-400">
                                        <Database className="w-3 h-3" />
                                        On-chain
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-bold">
                                  {(record.confidence_score * 100).toFixed(
                                    1
                                  )}
                                  %
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  confidence
                                </div>
                              </div>
                              {record.tx_hash && (
                                <a
                                  href={`https://stellar.expert/explorer/testnet/tx/${record.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-4">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages}
                    >
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
