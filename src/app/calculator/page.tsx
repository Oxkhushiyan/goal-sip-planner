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
import { ChevronLeft, InfoIcon, Shield, Layers } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CalculatorPage() {
  const {
    inputs,
    result,
    breakdown,
    validationErrors,
    setInput,
    reset,
  } = useCalculator();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "r" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        reset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reset]);

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
        <div className="mb-8 text-center flex flex-col items-center">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">
            <Shield className="w-3 h-3 mr-1.5" />
            0 Bytes – 100% Client-side
          </Badge>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Goal-Based Investment Calculator
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
              onInputChange={setInput}
              onReset={reset}
            />
            <Disclaimer className="hidden lg:block" />
          </div>

          {/* Right: Results */}
          {result ? (
            <div className="space-y-6 min-w-0 w-full">
              <div className="flex justify-between items-center sm:hidden mb-2">
                <Button variant="outline" size="sm" className="w-full text-xs" disabled>
                  <Layers className="w-3 h-3 mr-2" />
                  Compare Scenarios (Coming Soon)
                </Button>
              </div>

              <ResultCard result={result} inputs={inputs} />

              {breakdown.length > 0 && (
                <>
                  <Charts breakdown={breakdown} result={result} />
                  <BreakdownTable breakdown={breakdown} inflationRate={inputs.inflationRate} />
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
      <footer className="mt-16 border-t border-border px-4 pt-8 pb-48 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <Disclaimer compact className="hidden lg:block" />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} SIP Goal Planner · For educational purposes only
          </p>
        </div>
      </footer>

      {/* Fixed Mobile Disclaimer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.15)] lg:hidden">
        <Disclaimer />
      </div>
    </div>
  );
}
