import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Image, FileText, GitBranch, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import type { ElementType } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatConfidence(score: number): string {
  return `${(score * 100).toFixed(2)}%`;
}

export function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "completed":
    case "verified":
      return "text-green-400 bg-green-400/10";
    case "pending":
      return "text-yellow-400 bg-yellow-400/10";
    case "rejected":
    case "failed":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-gray-400 bg-gray-400/10";
  }
}

// --- Shared UI helpers for verification types/statuses ---

/** Maps verification_type to the appropriate Lucide icon component */
export const verificationTypeIcons: Record<string, ElementType> = {
  image: Image,
  document: FileText,
  repository: GitBranch,
};

/** Returns the Badge variant appropriate for a verification status */
export function getStatusBadge(
  status: string
): "success" | "warning" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "verified":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

/** Returns a status icon React element */
export function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "verified":
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "pending":
      return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
    case "rejected":
    case "failed":
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}
