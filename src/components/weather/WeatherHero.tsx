import React from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { WeatherIcon } from "../WeatherIcon";
import { DemoBadge } from "../DemoBadge";
import { t } from "../../lib/i18n";
import { Thermometer, Droplets, Wind, MapPin } from "lucide-react";

export const WeatherHero: React.FC = () => {
  const { weather, lang, demoMode } = useWeatherGPT();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-xl border border-slate-700/50">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">{weather.locationName}</span>
        </div>
        {demoMode && <DemoBadge />}
      </div>

      <div className="flex items-center justify-between my-6">
        <div>
          <div className="text-5xl font-black tracking-tight">{weather.temperature}°C</div>
          <div className="text-sm text-slate-300 mt-1 flex items-center space-x-1.5">
            <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            <span>Feels like {weather.feels_like}°C</span>
          </div>
          <div className="text-lg font-medium text-blue-200 mt-2">{weather.condition}</div>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-inner">
          <WeatherIcon name={weather.icon} className="w-12 h-12 text-blue-300 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/60 text-xs text-slate-300">
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center">
          <Droplets className="w-4 h-4 text-blue-400 mb-1" />
          <span className="text-slate-400">{t(lang, "rainfall")}</span>
          <span className="font-bold text-white mt-0.5">{weather.rainfall_intensity} mm/h</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center">
          <Wind className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-slate-400">{t(lang, "wind")}</span>
          <span className="font-bold text-white mt-0.5">{weather.wind_speed} km/h</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center">
          <span className="text-slate-400 mb-1">Humidity</span>
          <span className="font-bold text-white mt-0.5">{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
};
