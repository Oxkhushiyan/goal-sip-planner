"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BreakdownRow } from "@/types";

interface BreakdownTableProps {
  breakdown: BreakdownRow[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function BreakdownTable({ breakdown }: BreakdownTableProps) {
  if (breakdown.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg w-full min-w-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Year-by-Year Breakdown</CardTitle>
          <Badge variant="outline" className="text-xs">
            {breakdown.length} years
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-80 rounded-b-lg">
          <Table aria-label="Year-by-year SIP corpus breakdown">
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                <TableHead className="text-center w-16">Year</TableHead>
                <TableHead className="text-right">Monthly SIP</TableHead>
                <TableHead className="text-right">Total Invested</TableHead>
                <TableHead className="text-right">Corpus Value</TableHead>
                <TableHead className="text-right">Returns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdown.map((row, i) => (
                <TableRow
                  key={row.year}
                  className={
                    i % 2 === 0
                      ? "bg-background/40"
                      : "bg-muted/20"
                  }
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {row.year}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {fmt(row.monthlySIP)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[#224c87] dark:text-[#224c87]">
                    {fmt(row.totalInvested)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {fmt(row.corpusValue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-[#919090] dark:text-[#919090]">
                    {fmt(Math.max(0, row.returns))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
