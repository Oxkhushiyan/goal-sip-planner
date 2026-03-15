import { AlertCircle } from "lucide-react";
import { DISCLAIMER_TEXT } from "@/lib/disclaimer";

interface DisclaimerProps {
  compact?: boolean;
  className?: string;
}

export function Disclaimer({ compact = false, className = "" }: DisclaimerProps) {
  if (compact) {
    return (
      <p className={`text-xs text-muted-foreground ${className}`}>
        <span className="font-semibold text-foreground">Disclaimer: </span>
        {DISCLAIMER_TEXT}
      </p>
    );
  }

  return (
    <div
      className={`rounded-lg border border-border bg-muted/30 p-4 ${className}`}
      role="note"
      aria-label="Important disclaimer"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground">
            Important Disclaimer
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}
