import type { CalculatorInputs, CalculatorResult, BreakdownRow, WarningType } from "@/types";

const EPSILON = 1e-12;

/**
 * Safe power function to avoid numeric overflow
 */
function safePow(base: number, exp: number): number {
  const result = Math.pow(base, exp);
  if (!isFinite(result)) return Infinity;
  return result;
}

/**
 * Step 1: Calculate Future Value of the goal after inflation
 * FV = P × (1 + i)^y
 */
export function calculateFutureValue(P: number, i: number, y: number): number {
  if (y === 0) return P;
  return P * safePow(1 + i, y);
}

/**
 * Step 2+3: Calculate required monthly SIP
 * PMT = (FV × r) / ((1 + r)^n - 1)
 * With annuity due: PMT / (1 + r)
 */
export function calculateSIP(
  FV: number,
  R: number,
  y: number,
  annuityDue = false
): number {
  const n = y * 12;
  const r = R / 12;

  if (y === 0) return 0;
  if (n < EPSILON) return 0;

  // Return = 0 fallback: SIP = FV / n
  if (Math.abs(r) < EPSILON) {
    return FV / n;
  }

  const compound = safePow(1 + r, n);
  if (!isFinite(compound)) return 0;

  const denominator = compound - 1;

  if (Math.abs(denominator) < EPSILON) {
    // Fallback for extremely small denominator
    return FV / n;
  }

  let pmt = (FV * r) / denominator;

  if (annuityDue) {
    pmt = pmt / (1 + r);
  }

  if (!isFinite(pmt) || pmt < 0) return 0;

  return pmt;
}

/**
 * Generate year-by-year breakdown table
 */
export function generateBreakdown(
  sip: number,
  R: number,
  y: number
): BreakdownRow[] {
  const rows: BreakdownRow[] = [];
  const r = R / 12;
  let corpus = 0;

  for (let year = 1; year <= y; year++) {
    const monthsThisYear = 12;
    for (let m = 0; m < monthsThisYear; m++) {
      corpus = corpus * (1 + r) + sip;
    }
    const totalInvested = sip * 12 * year;
    rows.push({
      year,
      monthlySIP: sip,
      totalInvested,
      corpusValue: corpus,
      returns: corpus - totalInvested,
    });
  }
  return rows;
}

/**
 * Main calculation function with full edge-case handling
 */
export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const { goalAmount, yearsToGoal, inflationRate, expectedReturn, annuityDue } = inputs;
  const warnings: WarningType[] = [];

  // Years = 0
  if (yearsToGoal === 0) {
    warnings.push("YEARS_ZERO");
    return {
      futureValue: goalAmount,
      monthlySIP: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      totalCorpus: 0,
      warnings,
    };
  }

  // Return = 0
  if (Math.abs(expectedReturn) < EPSILON) {
    warnings.push("RETURN_ZERO");
  }

  // Inflation >= Return
  if (inflationRate >= expectedReturn && expectedReturn > 0) {
    warnings.push("INFLATION_GTE_RETURN");
  }

  const FV = calculateFutureValue(goalAmount, inflationRate, yearsToGoal);

  if (!isFinite(FV)) {
    return {
      futureValue: 0,
      monthlySIP: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      totalCorpus: 0,
      warnings: [...warnings, "NUMERIC_OVERFLOW"],
      error: "The values entered result in a number too large to calculate. Please reduce the goal amount or time period.",
    };
  }

  const sip = calculateSIP(FV, expectedReturn, yearsToGoal, annuityDue);

  if (!isFinite(sip)) {
    return {
      futureValue: FV,
      monthlySIP: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      totalCorpus: 0,
      warnings: [...warnings, "NUMERIC_OVERFLOW"],
      error: "Could not compute a valid SIP. Please check your inputs.",
    };
  }

  const totalInvested = sip * 12 * yearsToGoal;
  const estimatedReturns = FV - totalInvested;

  return {
    futureValue: FV,
    monthlySIP: sip,
    totalInvested,
    estimatedReturns,
    totalCorpus: FV,
    warnings,
  };
}
