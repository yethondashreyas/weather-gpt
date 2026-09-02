import React from "react";
import { useWeatherGPT, ThemeMode } from "../lib/WeatherGPTContext";
import { Sun, Moon, Eye, Contrast } from "lucide-react";

interface ThemeToggleProps {
  variant?: "header" | "card";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = "header" }) => {
  const { theme, setTheme } = useWeatherGPT();

  const themes: { id: ThemeMode; label: string; shortLabel: string; desc: string; icon: React.ElementType; color: string }[] = [
    {
      id: "light",
      label: "Light",
      shortLabel: "Light",
      desc: "Standard high-contrast daylight theme",
      icon: Sun,
      color: "text-amber-500",
    },
    {
      id: "dark",
      label: "Dark",
      shortLabel: "Dark",
      desc: "Slate night theme for low eye strain",
      icon: Moon,
      color: "text-indigo-400",
    },
    {
      id: "accessible",
      label: "Disaster / AMOLED",
      shortLabel: "Disaster",
      desc: "Pure black #000000 with ultra-high contrast for emergency low-light scenarios",
      icon: Eye,
      color: "text-yellow-400",
    },
  ];

  if (variant === "card") {
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
          <Contrast className="w-3.5 h-3.5 text-blue-500" />
          <span>Display & Disaster Contrast Mode</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                id={`theme-btn-${t.id}`}
                onClick={() => setTheme(t.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  active
                    ? t.id === "accessible"
                      ? "bg-black border-yellow-400 text-yellow-300 ring-2 ring-yellow-400/40 shadow-lg"
                      : "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-xl ${active ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"}`}>
                    <Icon className={`w-4 h-4 ${t.color}`} />
                  </div>
                  {active && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      t.id === "accessible" ? "bg-yellow-400 text-black" : "bg-blue-600 text-white"
                    }`}>
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{t.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header compact toggle pill
  return (
    <div
      id="theme-header-toggle"
      className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            id={`theme-quick-${t.id}`}
            onClick={() => setTheme(t.id)}
            title={`${t.label}: ${t.desc}`}
            aria-label={`Switch to ${t.label} theme`}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-lg transition-all flex items-center space-x-1 ${
              active
                ? t.id === "accessible"
                  ? "bg-black text-yellow-300 font-bold shadow-sm ring-1 ring-yellow-400"
                  : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${active ? t.color : ""}`} />
            <span className="hidden sm:inline text-[10px]">{t.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};
