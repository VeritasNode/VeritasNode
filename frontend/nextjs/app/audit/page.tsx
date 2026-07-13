"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useAuditTrail } from "@/lib/api";
import {
  FileSearch,
  ShieldCheck,
  Database,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  FileText,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  verification_submitted: FileSearch,
  ai_verification_complete: ShieldCheck,
  proof_stored_ipfs: Database,
  anchored_to_blockchain: CheckCircle2,
};

export default function AuditPage() {
  const [recordId, setRecordId] = useState("");

  const { data, loading, error, refetch } = useAuditTrail(
    recordId || null,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (recordId.trim()) {
      refetch();
    }
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">
            Immutable verification history anchored to the Stellar blockchain
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter verification record ID..."
                  className="pl-10 font-mono"
                  value={recordId}
                  onChange={(e) => setRecordId(e.target.value)}
                />
              </div>
              <Button type="submit" variant="gradient" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Look Up
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Initial state - no search yet */}
            {!recordId && !loading && !error && !data && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
                  <FileSearch className="w-12 h-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground text-center max-w-sm">
                    Enter a verification record ID above to view its
                    complete audit trail on the Stellar blockchain.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Loading state */}
            {loading && recordId && (
              <Card>
                <CardContent className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            )}

            {/* Error state */}
            {error && !loading && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
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
                </CardContent>
              </Card>
            )}

            {/* Data state */}
            {!loading && !error && data && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-primary" />
                      Audit Trail: {data.record_id}
                    </CardTitle>
                    <Badge
                      variant={data.on_chain_verified ? "success" : "warning"}
                      className="gap-1"
                    >
                      {data.on_chain_verified ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {data.on_chain_verified
                        ? "Verified on Stellar"
                        : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {data.entries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No audit trail entries found for this record.
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

                      <div className="space-y-6">
                        {data.entries.map((entry, idx) => {
                          const Icon =
                            typeIcons[entry.event_type] || FileText;
                          return (
                            <div
                              key={idx}
                              className="flex gap-4 relative"
                            >
                              <div className="relative z-10 flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-primary" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm">
                                    {entry.event_type
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (c) =>
                                        c.toUpperCase()
                                      )}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {entry.description}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(entry.timestamp)}
                                  </span>
                                  {entry.ipfs_cid && (
                                    <span className="flex items-center gap-1">
                                      <Database className="w-3 h-3" />
                                      IPFS: {entry.ipfs_cid.slice(0, 12)}...
                                    </span>
                                  )}
                                  {entry.tx_hash && (
                                    <a
                                      href={`https://stellar.expert/explorer/testnet/tx/${entry.tx_hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-primary hover:underline ml-auto"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      View on Stellar
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blockchain Anchor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">Stellar Testnet</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Contract</span>
                  <span className="font-mono text-xs">CDLZFC...AQWX</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ledger</span>
                  <span className="font-medium">#12,345</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Records</span>
                  <span className="font-medium">9,432</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why Immutable?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Every verification record is permanently stored on the
                  Stellar blockchain via a Soroban smart contract, creating an
                  unalterable &ldquo;History of Truth.&rdquo;
                </p>
                <p>
                  Once written, records cannot be modified or deleted,
                  ensuring complete transparency and auditability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
