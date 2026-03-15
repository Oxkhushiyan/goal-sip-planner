import type { CalculatorInputs, ValidationError } from "@/types";

const MAX_GOAL = 1_000_000_000_00; // 100 billion
const MAX_YEARS = 50;
const MAX_RATE = 1; // 100%

/**
 * Parse a currency/number string, stripping ₹, commas, spaces
 * ₹1,00,000 → 100000
 */
export function parseAmount(str: string): number {
  const cleaned = str.replace(/[₹,\s]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

/**
 * Validate all calculator inputs, returning an array of errors
 */
export function validateInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isFinite(inputs.goalAmount) || inputs.goalAmount <= 0) {
    errors.push({ field: "goalAmount", message: "Goal amount must be a positive number." });
  } else if (inputs.goalAmount > MAX_GOAL) {
    errors.push({ field: "goalAmount", message: `Goal amount cannot exceed ₹${MAX_GOAL.toLocaleString("en-IN")}.` });
  }

  if (!isFinite(inputs.yearsToGoal) || inputs.yearsToGoal < 0) {
    errors.push({ field: "yearsToGoal", message: "Years to goal must be 0 or more." });
  } else if (inputs.yearsToGoal > MAX_YEARS) {
    errors.push({ field: "yearsToGoal", message: `Years cannot exceed ${MAX_YEARS}.` });
  } else if (!Number.isInteger(inputs.yearsToGoal)) {
    errors.push({ field: "yearsToGoal", message: "Please enter a whole number of years." });
  }

  if (!isFinite(inputs.inflationRate) || inputs.inflationRate < 0) {
    errors.push({ field: "inflationRate", message: "Inflation rate must be 0% or more." });
  } else if (inputs.inflationRate > MAX_RATE) {
    errors.push({ field: "inflationRate", message: "Inflation rate cannot exceed 100%." });
  }

  if (!isFinite(inputs.expectedReturn) || inputs.expectedReturn < 0) {
    errors.push({ field: "expectedReturn", message: "Expected return must be 0% or more." });
  } else if (inputs.expectedReturn > MAX_RATE) {
    errors.push({ field: "expectedReturn", message: "Expected return cannot exceed 100%." });
  }

  return errors;
}
