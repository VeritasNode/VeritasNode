import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VeritasNode - The Oracle/Auditor",
  description:
    "AI-powered data integrity verification with transparent blockchain audit trails on Stellar",
  keywords: ["blockchain", "verification", "AI", "Stellar", "oracle", "audit"],
  authors: [{ name: "VeritasNode Contributors" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          inter.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
