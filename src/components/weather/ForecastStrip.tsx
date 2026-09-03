import React, { useState } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { WeatherIcon } from "../WeatherIcon";
import { t, translateCondition, translateDay } from "../../lib/i18n";
import { Clock, Umbrella } from "lucide-react";

export const ForecastStrip: React.FC = () => {
  const { weather, lang, formatTemp, showToast } = useWeatherGPT();
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const dailyForecast = [
    { day: "Today", tempMax: weather.temperature, tempMin: weather.temperature - 6, rain: weather.rain_probability, condition: weather.condition, icon: weather.icon },
    { day: "Thu", tempMax: 29, tempMin: 22, rain: 90, condition: "Thunderstorms with Heavy Rain", icon: "rain" },
    { day: "Fri", tempMax: 28, tempMin: 21, rain: 75, condition: "Heavy Rain", icon: "rain" },
    { day: "Sat", tempMax: 31, tempMin: 23, rain: 40, condition: "Scattered Showers", icon: "cloud" },
    { day: "Sun", tempMax: 33, tempMin: 24, rain: 20, condition: "Partly Cloudy", icon: "cloud" },
    { day: "Mon", tempMax: 34, tempMin: 25, rain: 10, condition: "Mostly Sunny", icon: "sun" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      {/* Header and Tab Toggler */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{activeTab === "hourly" ? t(lang, "hourlyForecast") : t(lang, "weeklyForecast")}</span>
        </div>

        {/* Forecast Range Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
          <button
            onClick={() => {
              setActiveTab("hourly");
              setSelectedSlot(null);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === "hourly"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t(lang, "tab24Hours")}
          </button>
          <button
            onClick={() => {
              setActiveTab("daily");
              setSelectedSlot(null);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeTab === "daily"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t(lang, "tab7Days")}
          </button>
        </div>
      </div>

      {/* Hourly Forecast Carousel */}
      {activeTab === "hourly" && (
        <div className="grid grid-cols-6 gap-2 overflow-x-auto pb-1">
          {weather.forecast.map((slot, idx) => {
            const isSelected = selectedSlot === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedSlot(isSelected ? null : idx);
                  showToast(`${slot.t}: ${formatTemp(slot.temp)}, ${slot.rain}% ${t(lang, "rainChance")}`);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 ring-2 ring-blue-400/40"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{slot.t}</span>
                <div className="my-1.5">
                  <WeatherIcon name={slot.icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {formatTemp(slot.temp)}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-0.5 flex items-center space-x-0.5">
                  <Umbrella className="w-2.5 h-2.5" />
                  <span>{slot.rain}%</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 7-Day Forecast View */}
      {activeTab === "daily" && (
        <div className="space-y-1.5 pt-1">
          {dailyForecast.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs"
            >
              <span className="w-12 font-bold text-slate-700 dark:text-slate-300">
                {translateDay(d.day, lang)}
              </span>
              <div className="flex items-center space-x-1.5 flex-1 px-2">
                <WeatherIcon name={d.icon} className="w-4 h-4 text-blue-500" />
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {translateCondition(d.condition, lang)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-right">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {d.rain}% {t(lang, "rain")}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatTemp(d.tempMax)} / {formatTemp(d.tempMin)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
