"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import type { CalculatorInputs, ValidationError } from "@/types";

interface GoalFormProps {
  inputs: CalculatorInputs;
  validationErrors: ValidationError[];
  onInputChange: (field: keyof CalculatorInputs, value: number | boolean) => void;
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
  onInputChange,
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
            <CardTitle className="text-xl font-bold text-foreground">Your Goal</CardTitle>
            <CardDescription>Adjust the values to match your financial goal</CardDescription>
          </div>
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
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  {field.label}
                  {field.unit && (
                    <span className="text-xs font-normal text-muted-foreground">
                      ({field.unit})
                    </span>
                  )}
                  <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] font-medium bg-muted text-muted-foreground leading-tight rounded-sm font-sans flex items-center">
                    Illustrative only
                  </Badge>
                </Label>
                <span className="text-sm font-bold text-primary">
                  {field.sliderFormat(sliderVal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{field.description}</p>

              <Slider
                id={field.id}
                min={field.min}
                max={field.max}
                step={field.step}
                value={[sliderVal]}
                onValueChange={(val) => {
                  const valueArray = Array.isArray(val) ? val : [val as number];
                  handleSliderChange(field, valueArray);
                }}
                className="py-2"
                aria-label={`${field.label} slider`}
                aria-valuetext={field.sliderFormat(sliderVal)}
              />

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

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            aria-label="Reset all values to defaults"
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Defaults (Press R)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
