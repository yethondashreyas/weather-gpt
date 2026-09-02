import React from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { WeatherIcon } from "../WeatherIcon";
import { t } from "../../lib/i18n";
import { Clock } from "lucide-react";

export const ForecastStrip: React.FC = () => {
  const { weather, lang } = useWeatherGPT();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <Clock className="w-3.5 h-3.5 text-blue-500" />
        <span>{t(lang, "forecast")}</span>
      </div>

      <div className="grid grid-cols-6 gap-2 overflow-x-auto pb-1">
        {weather.forecast.map((slot, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50"
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{slot.t}</span>
            <div className="my-1.5">
              <WeatherIcon name={slot.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{slot.temp}°</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">{slot.rain}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
