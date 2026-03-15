"use client";

import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { GoalForm } from "@/components/GoalForm";
import { ResultCard } from "@/components/ResultCard";
import { Charts } from "@/components/Charts";
import { BreakdownTable } from "@/components/BreakdownTable";
import { Disclaimer } from "@/components/Disclaimer";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { useCalculator } from "@/hooks/useCalculator";
import { ChevronLeft, InfoIcon } from "lucide-react";

export default function CalculatorPage() {
  const {
    inputs,
    result,
    breakdown,
    validationErrors,
    hasCalculated,
    setInput,
    calculate,
    reset,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm font-semibold text-foreground">SIP Calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#919090]/50 text-[#919090] text-xs hidden sm:flex gap-1"
            >
              <InfoIcon className="h-3 w-3" />
              Educational only
            </Badge>
            {result && (
              <PDFDownloadButton
                inputs={inputs}
                result={result}
                breakdown={breakdown}
              />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Page title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Goal-Based{" "}
            <span className="text-[#224c87]">
              SIP Calculator
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-xl mx-auto">
            Enter your financial goal details below. All assumptions are editable.
            Results update automatically.
          </p>
        </div>

        {/* Main layout: left form, right results */}
        <div className="grid gap-6 lg:grid-cols-[420px_1fr] w-full">
          {/* Left: Form */}
          <div className="space-y-4 min-w-0 w-full">
            <GoalForm
              inputs={inputs}
              validationErrors={validationErrors}
              hasCalculated={hasCalculated}
              onInputChange={setInput}
              onCalculate={calculate}
              onReset={reset}
            />
            <Disclaimer />
          </div>

          {/* Right: Results */}
          {result ? (
            <div className="space-y-6 min-w-0 w-full">
              <ResultCard result={result} inputs={inputs} />

              {breakdown.length > 0 && (
                <>
                  <Charts breakdown={breakdown} result={result} />
                  <BreakdownTable breakdown={breakdown} />
                </>
              )}

              <div className="flex items-center justify-end">
                <PDFDownloadButton
                  inputs={inputs}
                  result={result}
                  breakdown={breakdown}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 min-h-64">
              <div className="text-center px-8">
                <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted text-[#919090]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Results will appear here
                </h2>
                <p className="text-sm text-muted-foreground">
                  Adjust the sliders and click{" "}
                  <strong className="text-foreground">Calculate SIP</strong> to see your
                  required monthly investment.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Disclaimer compact />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} SIP Goal Planner · For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
