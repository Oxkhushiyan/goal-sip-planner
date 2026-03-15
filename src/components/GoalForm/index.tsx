"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Calculator, Info } from "lucide-react";
import type { CalculatorInputs, ValidationError } from "@/types";

interface GoalFormProps {
  inputs: CalculatorInputs;
  validationErrors: ValidationError[];
  hasCalculated: boolean;
  onInputChange: (field: keyof CalculatorInputs, value: number | boolean) => void;
  onCalculate: () => void;
  onReset: () => void;
}

interface FieldConfig {
  id: keyof CalculatorInputs;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  parse: (v: string) => number;
  sliderFormat: (v: number) => string;
  unit?: string;
}

const FIELDS: FieldConfig[] = [
  {
    id: "goalAmount",
    label: "Current Goal Cost",
    description: "Today's cost of your financial goal",
    min: 10000,
    max: 10_000_000,
    step: 10000,
    format: (v) =>
      new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v),
    parse: (v) => {
      const n = parseFloat(v.replace(/[₹,\s]/g, ""));
      return isNaN(n) ? 0 : n;
    },
    sliderFormat: (v) =>
      v >= 100000
        ? `₹${(v / 100000).toFixed(1)}L`
        : `₹${(v / 1000).toFixed(0)}K`,
  },
  {
    id: "yearsToGoal",
    label: "Years to Goal",
    description: "How many years until you need the money",
    min: 1,
    max: 40,
    step: 1,
    format: (v) => `${v}`,
    parse: (v) => parseInt(v, 10) || 0,
    sliderFormat: (v) => `${v} yr`,
    unit: "years",
  },
  {
    id: "inflationRate",
    label: "Inflation Rate",
    description: "Expected annual inflation (reduces purchasing power)",
    min: 0,
    max: 20,
    step: 0.5,
    format: (v) => `${(v * 100).toFixed(1)}`,
    parse: (v) => parseFloat(v) / 100 || 0,
    sliderFormat: (v) => `${v.toFixed(1)}%`,
    unit: "% p.a.",
  },
  {
    id: "expectedReturn",
    label: "Expected Return",
    description: "Assumed annual return on your SIP investment",
    min: 0,
    max: 30,
    step: 0.5,
    format: (v) => `${(v * 100).toFixed(1)}`,
    parse: (v) => parseFloat(v) / 100 || 0,
    sliderFormat: (v) => `${v.toFixed(1)}%`,
    unit: "% p.a.",
  },
];

export function GoalForm({
  inputs,
  validationErrors,
  hasCalculated,
  onInputChange,
  onCalculate,
  onReset,
}: GoalFormProps) {
  function getError(field: keyof CalculatorInputs) {
    return validationErrors.find((e) => e.field === field)?.message;
  }

  function getSliderValue(field: FieldConfig): number {
    const v = inputs[field.id] as number;
    if (field.id === "inflationRate" || field.id === "expectedReturn") {
      return v * 100;
    }
    return v;
  }

  function handleSliderChange(field: FieldConfig, val: number[]) {
    const raw = val[0];
    if (field.id === "inflationRate" || field.id === "expectedReturn") {
      onInputChange(field.id, raw / 100);
    } else {
      onInputChange(field.id, raw);
    }
  }

  function handleInputText(field: FieldConfig, raw: string) {
    onInputChange(field.id, field.parse(raw));
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Your Goal</CardTitle>
            <CardDescription>Adjust the values to match your financial goal</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            <Info className="mr-1 h-3 w-3" />
            Illustrative only
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {FIELDS.map((field) => {
          const sliderVal = getSliderValue(field);
          const displayVal = field.format(inputs[field.id] as number);
          const error = getError(field.id);

          return (
            <div key={field.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor={field.id}
                  className="text-sm font-semibold text-foreground"
                >
                  {field.label}
                  {field.unit && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({field.unit})
                    </span>
                  )}
                </Label>
                <span className="text-sm font-bold text-primary">
                  {field.sliderFormat(sliderVal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{field.description}</p>

              <SliderPrimitive.Root
                id={`${field.id}-slider`}
                min={field.min}
                max={field.max}
                step={field.step}
                value={[sliderVal]}
                onValueChange={(v: number[]) => handleSliderChange(field, v)}
                aria-label={field.label}
                className="relative flex w-full touch-none items-center cursor-pointer py-1"
              >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-700">
                  <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-white shadow-md ring-ring/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
              </SliderPrimitive.Root>

              <div className="flex items-center gap-2">
                <Input
                  id={field.id}
                  type="text"
                  inputMode="decimal"
                  value={displayVal}
                  onChange={(e) => handleInputText(field, e.target.value)}
                  aria-label={`${field.label} input`}
                  aria-describedby={error ? `${field.id}-error` : undefined}
                  aria-invalid={!!error}
                  className={`h-9 text-sm font-medium ${
                    error ? "border-destructive ring-destructive" : ""
                  }`}
                />
                {field.unit && (
                  <span className="whitespace-nowrap text-xs text-muted-foreground">
                    {field.unit}
                  </span>
                )}
              </div>

              {error && (
                <p
                  id={`${field.id}-error`}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <Separator />

        <div className="flex gap-3">
          <Button
            onClick={onCalculate}
            className="flex-1 gap-2 font-semibold"
            size="lg"
            aria-label="Calculate required SIP"
          >
            <Calculator className="h-4 w-4" />
            Calculate SIP
          </Button>
          {hasCalculated && (
            <Button
              onClick={onReset}
              variant="outline"
              size="lg"
              aria-label="Reset all values to defaults"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
