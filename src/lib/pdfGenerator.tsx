import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CalculatorInputs, CalculatorResult, BreakdownRow } from "@/types";
import { DISCLAIMER_TEXT } from "@/lib/disclaimer";

// Use built-in Helvetica (no external font embedding needed for Vercel)
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #3b82f6",
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a8a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a8a",
    marginBottom: 8,
    borderBottom: "1pt solid #e2e8f0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "55%",
    color: "#475569",
  },
  value: {
    width: "45%",
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  highlight: {
    backgroundColor: "#eff6ff",
    border: "1pt solid #bfdbfe",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  highlightLabel: {
    fontSize: 9,
    color: "#1e40af",
  },
  highlightValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a8a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    padding: "5 4",
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: "4",
    borderBottom: "0.5pt solid #e2e8f0",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: "4",
    backgroundColor: "#f8fafc",
    borderBottom: "0.5pt solid #e2e8f0",
  },
  tableCell: {
    fontSize: 8,
    color: "#374151",
  },
  col1: { width: "10%" },
  col2: { width: "22.5%" },
  col3: { width: "22.5%" },
  col4: { width: "22.5%" },
  col5: { width: "22.5%" },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fef9c3",
    border: "1pt solid #fde047",
    borderRadius: 4,
  },
  disclaimerTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: "#854d0e",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 7.5,
    color: "#713f12",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7.5,
    color: "#94a3b8",
    textAlign: "center",
  },
});

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

interface Props {
  inputs: CalculatorInputs;
  result: CalculatorResult;
  breakdown: BreakdownRow[];
}

export function SIPReport({ inputs, result, breakdown }: Props) {
  const now = new Date();
  const istTimestamp = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Document
      title="Goal-Based SIP Calculation Report"
      author="SIP Planner – Educational Tool"
      subject="SIP Calculation"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Goal-Based SIP Report</Text>
          <Text style={styles.subtitle}>Generated on: {istTimestamp} IST · For educational purposes only</Text>
        </View>

        {/* Highlighted SIP */}
        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>REQUIRED MONTHLY SIP</Text>
          <Text style={styles.highlightValue}>{fmt(result.monthlySIP)}</Text>
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Inputs</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Current Goal Cost</Text>
            <Text style={styles.value}>{fmt(inputs.goalAmount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Years to Goal</Text>
            <Text style={styles.value}>{inputs.yearsToGoal} years</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Inflation Rate (assumed)</Text>
            <Text style={styles.value}>{fmtPct(inputs.inflationRate)} p.a.</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Expected Return (assumed)</Text>
            <Text style={styles.value}>{fmtPct(inputs.expectedReturn)} p.a.</Text>
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Future Value of Goal</Text>
            <Text style={styles.value}>{fmt(result.futureValue)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount Invested</Text>
            <Text style={styles.value}>{fmt(result.totalInvested)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estimated Returns</Text>
            <Text style={styles.value}>{fmt(Math.max(0, result.estimatedReturns))}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Final Corpus</Text>
            <Text style={styles.value}>{fmt(result.totalCorpus)}</Text>
          </View>
        </View>

        {/* Breakdown Table */}
        {breakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Year-by-Year Breakdown</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>Year</Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>Monthly SIP</Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>Total Invested</Text>
              <Text style={[styles.tableHeaderCell, styles.col4]}>Corpus Value</Text>
              <Text style={[styles.tableHeaderCell, styles.col5]}>Returns</Text>
            </View>
            {breakdown.map((row, i) => (
              <View key={row.year} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, styles.col1]}>{row.year}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{fmt(row.monthlySIP)}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{fmt(row.totalInvested)}</Text>
                <Text style={[styles.tableCell, styles.col4]}>{fmt(row.corpusValue)}</Text>
                <Text style={[styles.tableCell, styles.col5]}>{fmt(row.returns)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠ IMPORTANT DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
        </View>

        <Text style={styles.footer}>
          This document is for illustrative and educational purposes only. Not financial advice.
        </Text>
      </Page>
    </Document>
  );
}
