import React from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LANGUAGES, LanguageCode } from "../lib/i18n";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useWeatherGPT();

  return (
    <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <Globe className="w-4 h-4 ml-1.5 text-slate-500 dark:text-slate-400" />
      {LANGUAGES.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code as LanguageCode)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              active
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {l.native}
          </button>
        );
      })}
    </div>
  );
};
