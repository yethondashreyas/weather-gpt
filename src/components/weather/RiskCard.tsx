import React, { useState } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { LEVEL_STYLES } from "../../lib/riskEngine";
import { localizeReason } from "../../lib/reasonText";
import { t, LEVEL_LABEL } from "../../lib/i18n";
import { ShieldAlert, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from "lucide-react";

export const RiskCard: React.FC = () => {
  const { risk, lang } = useWeatherGPT();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const style = LEVEL_STYLES[risk.level] || LEVEL_STYLES.LOW;
  const levelLabels = LEVEL_LABEL[lang] || LEVEL_LABEL.en;
  const localizedLevel = levelLabels[risk.level] || risk.level;

  return (
    <div className={`rounded-3xl border p-6 ${style.bg} ${style.border} shadow-sm transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${style.dot}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {t(lang, "currentRisk")}
          </span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${style.badgeBg}`}>
          {localizedLevel}
        </span>
      </div>

      {/* Score & Reasons */}
      <div className="flex items-baseline space-x-3 mb-4">
        <span className={`text-4xl font-black ${style.text}`}>{risk.score}</span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">/ 100 {t(lang, "score")}</span>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          {t(lang, "riskReasons")}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {risk.reasons.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 shadow-2xs"
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>{localizeReason(r, lang)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-white/70 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 mb-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>{t(lang, "recommended")}</span>
        </h4>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {risk.recommended_action}
        </p>
      </div>

      {/* Breakdown Toggle */}
      <div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-2 px-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 transition-colors"
        >
          <span>Deterministic Weight Breakdown (Engine Authority)</span>
          {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showBreakdown && (
          <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            {risk.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
                <div className="flex items-center space-x-2 w-36">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.bar}`}
                      style={{ width: `${Math.min(100, (item.points / item.max) * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-bold text-slate-700 dark:text-slate-300">
                    {item.points}/{item.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
