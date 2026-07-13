"use client";

import AppLayout from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Key,
  Globe,
  Shield,
  Bell,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your VeritasNode instance
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl">
          {/* Blockchain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Blockchain Configuration
              </CardTitle>
              <CardDescription>
                Stellar network and Soroban contract settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Network</label>
                <Input placeholder="testnet" defaultValue="testnet" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Soroban RPC URL</label>
                <Input
                  placeholder="https://soroban-testnet.stellar.org"
                  defaultValue="https://soroban-testnet.stellar.org"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract ID</label>
                <Input placeholder="Contract address..." />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Connected
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Stellar Testnet
                </span>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                API Keys
              </CardTitle>
              <CardDescription>
                External service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">IPFS / Pinata API Key</label>
                <Input type="password" placeholder="Enter Pinata API key..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub API Token</label>
                <Input type="password" placeholder="Enter GitHub token..." />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Verification completed", enabled: true },
                { label: "Anomaly detected", enabled: true },
                { label: "On-chain anchor confirmed", enabled: true },
                { label: "Weekly summary report", enabled: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-sm">{item.label}</span>
                  <div
                    className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative ${
                      item.enabled ? "bg-primary" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        item.enabled ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save */}
          <div className="flex gap-3">
            <Button variant="gradient" className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline">Reset</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
