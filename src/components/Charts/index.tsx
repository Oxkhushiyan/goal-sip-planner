"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BreakdownRow, CalculatorResult } from "@/types";
import React from "react";


interface ChartsProps {
  breakdown: BreakdownRow[];
  result: CalculatorResult;
}

function formatLakh(val: number): string {
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(1)}Cr`;
  if (val >= 100_000) return `₹${(val / 100_000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toFixed(0)}`;
}

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 8,
  padding: "8px 12px",
  color: "#f1f5f9",
  fontSize: 12,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p className="font-semibold text-slate-200 mb-1">Year {label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatLakh(entry.value)}
        </p>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: entry.payload.fill }}>{entry.name}</p>
      <p className="font-bold">{formatLakh(entry.value)}</p>
    </div>
  );
}

const PIE_COLORS = ["#3b82f6", "#10b981"];


export function Charts({ breakdown, result }: ChartsProps) {

  const step = breakdown.length > 20 ? 2 : 1;
  const barData = breakdown
    .filter((r) => r.year % step === 0 || r.year === breakdown.length)
    .map((r) => ({
      year: r.year,
      "Total Invested": Math.round(r.totalInvested),
      Returns: Math.round(Math.max(0, r.returns)),
    }));

  const pieData = [
    { name: "Invested", value: Math.round(result.totalInvested), fill: PIE_COLORS[0] },
    { name: "Returns", value: Math.round(Math.max(0, result.estimatedReturns)), fill: PIE_COLORS[1] },
  ];


  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Corpus Growth Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Screen-reader accessible summary */}
        <p
          className="sr-only"
          role="img"
          aria-label={`Chart summary: Over ${breakdown.length} years, you invest ${formatLakh(result.totalInvested)} and the corpus grows to ${formatLakh(result.totalCorpus)}.`}
        >
          Over {breakdown.length} years, a total of {formatLakh(result.totalInvested)} is invested and the corpus grows to {formatLakh(result.totalCorpus)}.
        </p>

        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="bar" className="flex-1">Growth Over Time</TabsTrigger>
            <TabsTrigger value="pie" className="flex-1">Composition</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 11, fill: "#94a3b8" }}
                    height={32}
                  />
                  <YAxis
                    tickFormatter={formatLakh}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    width={56}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Total Invested" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Returns" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    aria-label="Pie chart showing corpus composition: invested amount vs returns"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-blue-500 inline-block" />
                Invested ({((result.totalInvested / result.totalCorpus) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" />
                Returns ({(Math.max(0, result.estimatedReturns / result.totalCorpus) * 100).toFixed(1)}%)
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
