"use client";

import { useReducer, useCallback } from "react";
import type { CalculatorInputs, CalculatorResult, BreakdownRow, ValidationError } from "@/types";
import { calculate, generateBreakdown } from "@/lib/calculations";
import { validateInputs } from "@/lib/validation";

interface CalculatorState {
  inputs: CalculatorInputs;
  result: CalculatorResult | null;
  breakdown: BreakdownRow[];
  validationErrors: ValidationError[];
}


type Action =
  | { type: "SET_INPUT"; field: keyof CalculatorInputs; value: number | boolean }
  | { type: "RESET" };

const DEFAULT_INPUTS: CalculatorInputs = {
  goalAmount: 1_000_000,
  yearsToGoal: 10,
  inflationRate: 0.06,
  expectedReturn: 0.12,
  annuityDue: false,
};

const DEFAULT_RESULT = calculate(DEFAULT_INPUTS);
const DEFAULT_BREAKDOWN = generateBreakdown(DEFAULT_RESULT.monthlySIP, DEFAULT_INPUTS.expectedReturn, DEFAULT_INPUTS.yearsToGoal);

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case "SET_INPUT": {
      const newInputs = { ...state.inputs, [action.field]: action.value };
      const errors = validateInputs(newInputs);
      if (errors.length === 0) {
        const result = calculate(newInputs);
        const breakdown = generateBreakdown(result.monthlySIP, newInputs.expectedReturn, newInputs.yearsToGoal);
        return { ...state, inputs: newInputs, result, breakdown, validationErrors: [] };
      }
      return { ...state, inputs: newInputs, validationErrors: errors };
    }
    case "RESET": {
      return { inputs: DEFAULT_INPUTS, result: DEFAULT_RESULT, breakdown: DEFAULT_BREAKDOWN, validationErrors: [] };
    }
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, {
    inputs: DEFAULT_INPUTS,
    result: DEFAULT_RESULT,
    breakdown: DEFAULT_BREAKDOWN,
    validationErrors: [],
  });

  const setInput = useCallback(
    (field: keyof CalculatorInputs, value: number | boolean) => {
      dispatch({ type: "SET_INPUT", field, value });
    },
    []
  );



  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    inputs: state.inputs,
    result: state.result,
    breakdown: state.breakdown,
    validationErrors: state.validationErrors,
    setInput,
    reset,
  };
}
