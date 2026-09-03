import React from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { getLevelFrequency, DAILY_RISK_HISTORY } from "../../lib/riskHistory";
import { Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MonthlyRiskSummary: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useWeatherGPT();
  const freq = getLevelFrequency();
  const total = DAILY_RISK_HISTORY.length;
  const highOrCrit = freq.HIGH + freq.CRITICAL;

  return (
    <div
      onClick={() => navigate("/risk-history")}
      className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {lang === "te"
              ? "గత 30 రోజుల సారాంశం (సిమ్యులేటెడ్)"
              : lang === "hi"
              ? "पिछले 30 दिनों का सारांश (सिम्युलेटेड)"
              : "Last 30 Days Summary (Simulated)"}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{highOrCrit}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
            {lang === "te"
              ? `${total} రోజులలో అధిక / తీవ్రమైన రోజులు`
              : lang === "hi"
              ? `${total} में से उच्च / गंभीर दिन`
              : `High / Critical days out of ${total}`}
          </span>
        </div>
        <div className="flex space-x-1 text-xs">
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
            {lang === "te" ? "తక్కువ" : lang === "hi" ? "कम" : "Low"}: {freq.LOW}
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
            {lang === "te" ? "మధ్యస్థ" : lang === "hi" ? "मध्यम" : "Mod"}: {freq.MODERATE}
          </span>
        </div>
      </div>

      {/* Segmented color bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 space-x-0.5">
        <div className="bg-emerald-500 h-full" style={{ width: `${(freq.LOW / total) * 100}%` }} title={`Low: ${freq.LOW}`} />
        <div className="bg-amber-500 h-full" style={{ width: `${(freq.MODERATE / total) * 100}%` }} title={`Moderate: ${freq.MODERATE}`} />
        <div className="bg-orange-500 h-full" style={{ width: `${(freq.HIGH / total) * 100}%` }} title={`High: ${freq.HIGH}`} />
        <div className="bg-red-500 h-full" style={{ width: `${(freq.CRITICAL / total) * 100}%` }} title={`Critical: ${freq.CRITICAL}`} />
      </div>
    </div>
  );
};
