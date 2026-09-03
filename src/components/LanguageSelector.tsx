import React from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LANGUAGES, LanguageCode } from "../lib/i18n";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang, setLang } = useWeatherGPT();

  return (
    <div className="flex items-center space-x-0.5 bg-slate-100/90 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
      <Globe className="w-3.5 h-3.5 ml-1 mr-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
      {LANGUAGES.map((l) => {
        const active = lang === l.code;
        // In compact mode: EN | తె | हि or English | తెలుగు | हिन्दी
        const label = compact
          ? l.code === "en"
            ? "EN"
            : l.code === "te"
            ? "తె"
            : "हि"
          : l.native;

        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code as LanguageCode)}
            className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
              active
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title={l.label}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
