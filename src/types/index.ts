export interface CalculatorInputs {
  goalAmount: number;        // Current cost of goal in ₹
  yearsToGoal: number;       // Time horizon in years
  inflationRate: number;     // Annual inflation rate (e.g., 0.06 for 6%)
  expectedReturn: number;    // Annual expected return (e.g., 0.12 for 12%)
  annuityDue?: boolean;      // true = beginning-of-month, false = end-of-month
}

export interface CalculatorResult {
  futureValue: number;       // Inflation-adjusted future goal amount
  monthlySIP: number;        // Required monthly SIP
  totalInvested: number;     // Total amount invested over the period
  estimatedReturns: number;  // Corpus - Total invested
  totalCorpus: number;       // Final corpus value
  warnings: WarningType[];
  error?: string;
}

export type WarningType =
  | 'INFLATION_GTE_RETURN'
  | 'YEARS_ZERO'
  | 'RETURN_ZERO'
  | 'NUMERIC_OVERFLOW';

export interface BreakdownRow {
  year: number;
  monthlySIP: number;
  totalInvested: number;
  corpusValue: number;
  returns: number;
}

export interface ValidationError {
  field: keyof CalculatorInputs;
  message: string;
}
