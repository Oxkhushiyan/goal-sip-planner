import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SIP Goal Planner – Educational SIP Calculator",
  description:
    "Estimate the monthly SIP required to reach your financial goal, accounting for inflation and expected returns. For educational purposes only – not financial advice.",
  keywords: ["SIP calculator", "goal-based investing", "SIP planner", "financial planning", "mutual fund"],
  openGraph: {
    title: "SIP Goal Planner",
    description: "Calculate your required monthly SIP to reach any financial goal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
