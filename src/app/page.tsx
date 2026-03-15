import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/Disclaimer";
import {
  TrendingUp,
  Calculator,
  BarChart2,
  FileDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Calculator,
    title: "Accurate SIP Formula",
    desc: "Uses the standard PMT annuity formula with inflation-adjusted future value.",
  },
  {
    icon: BarChart2,
    title: "Interactive Charts",
    desc: "Visualize corpus growth year-by-year with stacked bar and donut charts.",
  },
  {
    icon: FileDown,
    title: "PDF Export",
    desc: "Download a clean report with all inputs, results, breakdown, and disclaimer.",
  },
  {
    icon: ShieldCheck,
    title: "100% Client-side",
    desc: "No data stored or sent to any server. Fully private calculations.",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    desc: "Results update instantly as you adjust sliders or type values.",
  },
  {
    icon: TrendingUp,
    title: "Inflation-Aware",
    desc: "Accounts for purchasing power erosion to show the true future goal value.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden">
        {/* Glow effects */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <Badge
          variant="outline"
          className="mb-6 gap-1.5 border-blue-500/50 text-blue-400 px-4 py-1.5 text-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Educational Tool · Not Financial Advice
        </Badge>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Goal-Based{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            SIP Planner
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Estimate the monthly SIP investment you need to reach any financial goal,
          factoring in <strong className="text-slate-300">inflation</strong> and{" "}
          <strong className="text-slate-300">assumed returns</strong>. All assumptions
          are fully adjustable.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
          >
            <Calculator className="h-5 w-5" />
            Open Calculator
          </Link>
          <a
            href="#features"
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-base px-4 py-3"
          >
            See how it works →
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center sm:gap-16">
          {[
            { value: "₹0", label: "Data stored" },
            { value: "100%", label: "Client-side" },
            { value: "WCAG 2.1", label: "Accessible" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-center text-3xl font-bold text-white mb-12">
          Everything you need to plan your goal
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-blue-500/40 transition-colors group"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-600/10 p-3 group-hover:bg-blue-600/20 transition-colors">
                <f.icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
          >
            <Calculator className="h-5 w-5" />
            Start Planning
          </Link>
        </div>
      </section>

      {/* Footer with disclaimer */}
      <footer className="border-t border-slate-800 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Disclaimer />
          <p className="mt-4 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} SIP Goal Planner · Built for educational purposes
          </p>
        </div>
      </footer>
    </main>
  );
}
