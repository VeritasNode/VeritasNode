"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { date: "Jan", verifications: 400, passed: 380, failed: 20 },
  { date: "Feb", verifications: 600, passed: 570, failed: 30 },
  { date: "Mar", verifications: 800, passed: 780, failed: 20 },
  { date: "Apr", verifications: 1200, passed: 1150, failed: 50 },
  { date: "May", verifications: 1400, passed: 1370, failed: 30 },
  { date: "Jun", verifications: 1600, passed: 1580, failed: 20 },
  { date: "Jul", verifications: 2000, passed: 1970, failed: 30 },
];

export default function VerificationChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Verification Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="passed"
                stroke="#3B82F6"
                fill="url(#colorPassed)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="failed"
                stroke="#EF4444"
                fill="url(#colorFailed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
