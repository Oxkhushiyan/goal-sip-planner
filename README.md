# SIP Goal Planner

An **educational** web app that estimates the monthly SIP required to reach a financial goal, accounting for inflation and assumed returns.

> **Disclaimer:** For educational and illustrative purposes only. Not financial advice.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| PDF Export | @react-pdf/renderer |
| State | React useReducer |
| Hosting | Vercel |

## Getting Started

```bash
cd sip-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build    # production build
npm run lint     # lint check
```

Deploy to Vercel by connecting the repo. `vercel.json` is pre-configured.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components (GoalForm, ResultCard, Charts, BreakdownTable, Disclaimer)
├── lib/              # Calculations, validation, disclaimer, PDF generator
├── hooks/            # useCalculator (useReducer state)
└── types/            # TypeScript interfaces
```

## Key Formulas

```
FV  = P × (1 + i)^y                         — Future value of goal
PMT = (FV × r) / ((1 + r)^n − 1)            — Required monthly SIP
```

Where `P` = goal cost, `i` = inflation, `y` = years, `r` = monthly return, `n` = months.

## Compliance

- No scheme recommendations
- All assumptions user-editable
- Mandatory disclaimer on every screen and PDF export
