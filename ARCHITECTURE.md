# Architecture

## Overview

A stateless, client-side only Next.js 15 application. No backend or database required.

```
Browser
  │
  ▼
Next.js App Router (src/app/)
  │  layout.tsx – root layout + metadata
  │  page.tsx   – landing page (Server Component)
  └─ calculator/page.tsx – calculator (Client Component via useCalculator hook)
  │
  ▼
React Components (src/components/)
  ├─ GoalForm        – inputs + sliders
  ├─ ResultCard      – SIP result, warnings, corpus bar
  ├─ Charts          – Recharts BarChart + PieChart
  ├─ BreakdownTable  – year-by-year shadcn Table
  ├─ Disclaimer      – centralized disclaimer
  └─ PDFDownloadButton – dynamic-import @react-pdf/renderer
  │
  ▼
Core Library (src/lib/)
  ├─ calculations.ts  – SIP & FV formulas, EPSILON stability
  ├─ validation.ts    – input sanitization & typed errors
  ├─ disclaimer.ts    – single disclaimer text constant
  └─ pdfGenerator.tsx – @react-pdf/renderer Document
  │
  ▼
State (src/hooks/useCalculator.ts)
  └─ useReducer managing inputs → result → breakdown
```

## Key Design Decisions

- **No SSR data fetching** – all calculation is pure TS on the client
- **Dynamic PDF import** – avoids SSR issues with @react-pdf/renderer
- **EPSILON = 1e-12** – guards against division by zero in SIP denominator
- **Centralized disclaimer** – single `DISCLAIMER_TEXT` constant used in UI, footer, and PDF
