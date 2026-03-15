# Goal-Based Investment Calculator

A sleek, modern, and highly-accurate SIP (Systematic Investment Plan) calculator designed to help users plan for specific financial goals.

![Demo](demo.gif)


## 🚀 Features

- **Real-time Accuracy**: Immediate visual feedback and calculations as you drag sliders or type input values—no "Calculate" button required.
- **Inflation-Aware Logic**: Built-in adjustments to illustrate the true future cost of a goal vs. present-day purchasing power.
- **WCAG 2.1 AA Compliant**: Color-contrast checked progress bars, fully semantic ARIA labels mapped to live regions, and screen-reader accessible form inputs.
- **100% Client-Side Privacy**: Zero data is stored or sent to external servers. All operations happen instantly in the browser.
- **Professional PDF Export**: One-click generation of fully-styled, print-ready PDF reports outlining the goal parameters and a year-by-year financial breakdown.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Styling**: Tailwind CSS v4 & custom CSS variables
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **Language**: TypeScript

## 🏎️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/goal-sip-planner.git
   cd goal-sip-planner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *or if you use yarn/pnpm:*
   ```bash
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the app:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

## 📋 Folder Structure highlights
- **`src/app/`**: Next.js App Router routing logic (`page.tsx`, `layout.tsx`).
- **`src/components/`**: Modular UI components (`GoalForm`, `ResultCard`, `BreakdownTable`, `PDFDownloadButton`).
- **`src/hooks/`**: Custom React Hooks containing the core financial logic (`useCalculator.ts`).
- **`src/lib/`**: Standalone TypeScript utilities and configurations (`pdfGenerator.tsx`, `utils.ts`).
