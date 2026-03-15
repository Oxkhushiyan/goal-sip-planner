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
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Home
            </Link>
            <Separator orientation="vertical" className="h-5 bg-slate-700" />
            <span className="text-sm font-semibold text-white">SIP Calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-500/40 text-blue-400 text-xs hidden sm:flex gap-1"
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
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Goal-Based{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SIP Calculator
            </span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Enter your financial goal details below. All assumptions are editable.
            Results update automatically.
          </p>
        </div>

        {/* Main layout: left form, right results */}
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* Left: Form */}
          <div className="space-y-4">
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
            <div className="space-y-6">
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
            <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 min-h-64">
              <div className="text-center px-8">
                <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/10 text-blue-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 16l4-4 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Results will appear here
                </h2>
                <p className="text-sm text-slate-500">
                  Adjust the sliders and click{" "}
                  <strong className="text-slate-400">Calculate SIP</strong> to see your
                  required monthly investment.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Disclaimer compact />
          <p className="mt-3 text-xs text-slate-600 text-center">
            © {new Date().getFullYear()} SIP Goal Planner · For educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
