"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  truncateHash,
  verificationTypeIcons,
  getStatusBadge,
} from "@/lib/utils";
import { useVerifications } from "@/lib/api";
import {
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Inbox,
} from "lucide-react";

export default function RecentVerifications() {
  const { data, loading, error, refetch } = useVerifications({
    page_size: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Verifications</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="gap-2"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && (!data?.records || data.records.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Inbox className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No verifications yet
            </p>
          </div>
        )}

        {/* Data state */}
        {!loading && !error && data?.records && data.records.length > 0 && (
          <div className="space-y-3">
            {data.records.map((record) => {                const Icon = verificationTypeIcons[record.verification_type] || FileText;
              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {record.verification_type.charAt(0).toUpperCase() +
                            record.verification_type.slice(1)}{" "}
                          Verification
                        </span>
                        <Badge
                          variant={getStatusBadge(record.status)}
                          className="text-[10px]"
                        >
                          {record.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{truncateHash(record.data_hash, 6)}</span>
                        <span>•</span>
                        <span>{truncateHash(record.submitter_address, 4)}</span>
                        <span>•</span>
                        <span>{formatDate(record.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {(record.confidence_score * 100).toFixed(1)}%
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
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
