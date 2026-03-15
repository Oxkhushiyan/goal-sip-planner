import { AlertCircle } from "lucide-react";
import { DISCLAIMER_TEXT } from "@/lib/disclaimer";

interface DisclaimerProps {
  compact?: boolean;
  className?: string;
}

export function Disclaimer({ compact = false, className = "" }: DisclaimerProps) {
  if (compact) {
    return (
      <p className={`text-xs text-amber-700 dark:text-amber-400 ${className}`}>
        <span className="font-semibold">Disclaimer: </span>
        {DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <div
      className={`rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30 ${className}`}
      role="note"
      aria-label="Important disclaimer"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Important Disclaimer
          </p>
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
