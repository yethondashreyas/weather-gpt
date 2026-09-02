import React from "react";
import { CLIMATE_SERIES, CLIMATE_INSIGHT, SEASONAL_NOTE } from "../lib/weatherData";
import { t } from "../lib/i18n";
import { LanguageSelector } from "../components/LanguageSelector";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { CloudRain, TrendingUp, Info } from "lucide-react";

export const ClimateLens: React.FC = () => {
  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Climate Lens</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Decadal trend analysis (2015–2024)</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Composed Chart Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Rainfall & Heavy Days Trend</h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={CLIMATE_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#64748b" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar yAxisId="left" dataKey="rainfall" name="Rainfall (mm)" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Line yAxisId="right" type="monotone" dataKey="heavyDays" name="Heavy Days" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plain Language Insight Card */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-3xl p-5">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-1">Decadal Climate Insight</h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{CLIMATE_INSIGHT}</p>
          </div>
        </div>
      </div>

      {/* Seasonal Notes */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Seasonal Vulnerability Notes</h4>
        <div className="space-y-3">
          {SEASONAL_NOTE.map((note, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="font-bold text-xs text-blue-600 dark:text-blue-400 block mb-0.5">{note.season}</span>
              <p className="text-xs text-slate-700 dark:text-slate-300">{note.note}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 pt-2">Illustrative sample historical climate data for demonstration.</p>
    </div>
  );
};
