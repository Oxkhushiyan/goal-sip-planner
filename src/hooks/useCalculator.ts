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
  hasCalculated: boolean;
}


type Action =
  | { type: "SET_INPUT"; field: keyof CalculatorInputs; value: number | boolean }
  | { type: "CALCULATE" }
  | { type: "RESET" };

const DEFAULT_INPUTS: CalculatorInputs = {
  goalAmount: 1_000_000,
  yearsToGoal: 10,
  inflationRate: 0.06,
  expectedReturn: 0.12,
  annuityDue: false,
};

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case "SET_INPUT": {
      const newInputs = { ...state.inputs, [action.field]: action.value };
      const errors = validateInputs(newInputs);
      // Auto-recalculate if previously calculated and no errors
      if (state.hasCalculated && errors.length === 0) {
        const result = calculate(newInputs);
        const breakdown = generateBreakdown(result.monthlySIP, newInputs.expectedReturn, newInputs.yearsToGoal);
        return { ...state, inputs: newInputs, result, breakdown, validationErrors: [] };
      }
      return { ...state, inputs: newInputs, validationErrors: errors };
    }
    case "CALCULATE": {
      const errors = validateInputs(state.inputs);
      if (errors.length > 0) {
        return { ...state, validationErrors: errors };
      }
      const result = calculate(state.inputs);
      const breakdown = generateBreakdown(result.monthlySIP, state.inputs.expectedReturn, state.inputs.yearsToGoal);
      return { ...state, result, breakdown, validationErrors: [], hasCalculated: true };
    }
    case "RESET": {
      return { inputs: DEFAULT_INPUTS, result: null, breakdown: [], validationErrors: [], hasCalculated: false };
    }
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, {
    inputs: DEFAULT_INPUTS,
    result: null,
    breakdown: [],
    validationErrors: [],
    hasCalculated: false,
  });

  const setInput = useCallback(
    (field: keyof CalculatorInputs, value: number | boolean) => {
      dispatch({ type: "SET_INPUT", field, value });
    },
    []
  );

  const calculate_ = useCallback(() => {
    dispatch({ type: "CALCULATE" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    inputs: state.inputs,
    result: state.result,
    breakdown: state.breakdown,
    validationErrors: state.validationErrors,
    hasCalculated: state.hasCalculated,
    setInput,
    calculate: calculate_,
    reset,
  };
}
