import React from "react";
import { DAILY_RISK_HISTORY, getLevelFrequency } from "../lib/riskHistory";
import { LanguageSelector } from "../components/LanguageSelector";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calendar, ShieldAlert } from "lucide-react";

export const RiskHistory: React.FC = () => {
  const freq = getLevelFrequency();
  const total = DAILY_RISK_HISTORY.length;

  const chartData = [
    { level: "Low", count: freq.LOW, fill: "#10b981" },
    { level: "Moderate", count: freq.MODERATE, fill: "#f59e0b" },
    { level: "High", count: freq.HIGH, fill: "#f97316" },
    { level: "Critical", count: freq.CRITICAL, fill: "#ef4444" },
  ];

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Risk History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">30-day simulated risk progression log</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Total Simulated Days</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{total} Days</span>
        </div>
        <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm">
          <span className="text-xs text-red-600 dark:text-red-400 block mb-1">Critical Hazard Days</span>
          <span className="text-2xl font-black text-red-700 dark:text-red-300">{freq.CRITICAL} Days</span>
        </div>
      </div>

      {/* Recharts Frequency Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Level Frequency Distribution</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="level" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" name="Days" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Risk Trend Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">30-Day Sequence</h3>
        <div className="grid grid-cols-6 gap-1.5">
          {DAILY_RISK_HISTORY.map((item, idx) => {
            const bg =
              item.level === "CRITICAL"
                ? "bg-red-500 text-white"
                : item.level === "HIGH"
                ? "bg-orange-500 text-white"
                : item.level === "MODERATE"
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white";

            return (
              <div key={idx} className={`p-2 rounded-xl text-center shadow-2xs ${bg}`}>
                <div className="text-[10px] font-bold opacity-80">{item.date}</div>
                <div className="text-xs font-black mt-0.5">{item.score}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400">Simulated risk log for disaster management demonstration.</p>
    </div>
  );
};
