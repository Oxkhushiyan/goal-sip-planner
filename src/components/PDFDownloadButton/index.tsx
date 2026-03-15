"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { CalculatorInputs, CalculatorResult, BreakdownRow } from "@/types";

interface PDFDownloadButtonProps {
  inputs: CalculatorInputs;
  result: CalculatorResult;
  breakdown: BreakdownRow[];
}

export function PDFDownloadButton({ inputs, result, breakdown }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { SIPReport } = await import("@/lib/pdfGenerator");

      const blob = await pdf(
        <SIPReport inputs={inputs} result={result} breakdown={breakdown} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SIP-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="outline"
      className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
      aria-label="Download SIP calculation report as PDF"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Generating PDF…" : "Export PDF"}
    </Button>
  );
}
