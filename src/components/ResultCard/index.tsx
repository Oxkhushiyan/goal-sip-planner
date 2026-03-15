"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { AlertTriangle, Info, CircleDot, Layers, Hash, AlignLeft } from "lucide-react";
import type { CalculatorResult, CalculatorInputs } from "@/types";

interface ResultCardProps {
  result: CalculatorResult;
  inputs: CalculatorInputs;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatBox({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 transition-all ${
        highlight
          ? "bg-[#224c87] text-white shadow-lg"
          : "bg-muted/50 border border-border/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`rounded-lg p-1.5 ${
            highlight ? "bg-white/20" : "bg-primary/10"
          }`}
        >
          <Icon className={`h-4 w-4 ${highlight ? "text-white" : "text-primary"}`} />
        </div>
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            highlight ? "text-slate-200" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
      </div>
      <p
        className={`text-2xl font-bold tabular-nums ${
          highlight ? "text-white" : "text-foreground"
        }`}
        aria-live="polite"
      >
        {value}
      </p>
      {sub && (
        <p className={`mt-1 text-xs ${highlight ? "text-slate-300" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function ResultCard({ result, inputs }: ResultCardProps) {
  const investedPct = Math.min(
    100,
    (result.totalInvested / result.totalCorpus) * 100
  );
  const returnsPct = Math.max(0, 100 - investedPct);

  const hasInflationWarning = result.warnings.includes("INFLATION_GTE_RETURN");
  const hasYearsWarning = result.warnings.includes("YEARS_ZERO");
  const hasReturnZeroWarning = result.warnings.includes("RETURN_ZERO");

  return (
    <div className="space-y-4" role="region" aria-label="SIP calculation results">
      {/* Warnings */}
      {result.error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Calculation Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}
      {hasInflationWarning && (
        <Alert className="border-[#919090]/50 bg-background text-foreground dark:bg-muted/30">
          <AlertTriangle className="h-4 w-4 text-[#da3832]" />
          <AlertTitle className="text-foreground">
            Inflation ≥ Expected Return
          </AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your assumed inflation rate ({(inputs.inflationRate * 100).toFixed(1)}%) is greater than or equal to the expected return ({(inputs.expectedReturn * 100).toFixed(1)}%). In real terms, gains may be minimal or negative.
          </AlertDescription>
        </Alert>
      )}
      {hasYearsWarning && (
        <Alert className="border-[#919090]/50 bg-background dark:bg-muted/30">
          <Info className="h-4 w-4 text-[#224c87]" />
          <AlertTitle>Years set to 0</AlertTitle>
          <AlertDescription>
            With 0 years to goal, no SIP is required — you need the full amount immediately.
          </AlertDescription>
        </Alert>
      )}
      {hasReturnZeroWarning && (
        <Alert className="border-[#919090]/50 bg-background dark:bg-muted/30">
          <Info className="h-4 w-4 text-[#224c87]" />
          <AlertTitle>Return set to 0%</AlertTitle>
          <AlertDescription>
            Using simple division (FV ÷ months) since expected return is 0%.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <StatBox
            icon={Hash}
            label="Required Monthly SIP"
            value={fmt(result.monthlySIP)}
            sub={`For ${inputs.yearsToGoal} year${inputs.yearsToGoal !== 1 ? "s" : ""} · ${(inputs.expectedReturn * 100).toFixed(1)}% p.a.`}
            highlight
          />
        </div>
        <StatBox
          icon={CircleDot}
          label="Future Goal Value"
          value={fmt(result.futureValue)}
          sub={`After ${(inputs.inflationRate * 100).toFixed(1)}% inflation`}
        />
        <StatBox
          icon={Layers}
          label="Total Invested"
          value={fmt(result.totalInvested)}
          sub="Sum of all SIPs"
        />
        <StatBox
          icon={AlignLeft}
          label="Est. Returns"
          value={fmt(Math.max(0, result.estimatedReturns))}
          sub="Corpus − Invested"
        />
      </div>

      {/* Corpus breakdown bar */}
      {result.totalCorpus > 0 && (
        <Card className="border-border/50 bg-card/80">
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Invested · {investedPct.toFixed(0)}%</span>
              <span>Returns · {returnsPct.toFixed(0)}%</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#224c87] transition-all duration-700"
                style={{ width: `${investedPct}%` }}
                role="img"
                aria-label={`${investedPct.toFixed(0)}% of corpus is invested amount`}
              />
              <div
                className="absolute top-0 h-full rounded-full bg-[#919090] transition-all duration-700"
                style={{ left: `${investedPct}%`, width: `${returnsPct}%` }}
                role="img"
                aria-label={`${returnsPct.toFixed(0)}% of corpus is returns`}
              />
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#224c87] inline-block" />
                Invested
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#919090] inline-block" />
                Returns
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Final Corpus</span>
              <Badge variant="secondary" className="text-base font-bold px-3 py-1">
                {fmt(result.totalCorpus)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
