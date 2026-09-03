import React, { useState } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { WeatherIcon } from "../WeatherIcon";
import { DemoBadge } from "../DemoBadge";
import { t, translateCondition, translateCity } from "../../lib/i18n";
import {
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Gauge,
  Sun,
  Eye,
  Cloud,
} from "lucide-react";

export const WeatherHero: React.FC = () => {
  const {
    weather,
    lang,
    demoMode,
    formatTemp,
    toggleTempUnit,
    tempUnit,
    refreshRadar,
    lastRefreshed,
  } = useWeatherGPT();

  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshRadar();
    setTimeout(() => setRefreshing(false), 800);
  };

  const localizedCondition = translateCondition(weather.condition, lang);
  const localizedCity = translateCity(weather.locationName, lang);
  const localizedRefreshed = lastRefreshed === "Just now" ? t(lang, "justNow") : lastRefreshed;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-5 sm:p-6 shadow-xl border border-slate-700/60">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Location & Control Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-sm font-bold tracking-wide text-slate-100">
            {localizedCity}
          </span>
          <span className="text-[10px] font-mono text-blue-300 bg-blue-900/50 border border-blue-700/40 px-1.5 py-0.2 rounded-md">
            {t(lang, "radarBadge")}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Unit Switcher Button */}
          <button
            onClick={toggleTempUnit}
            className="px-2 py-0.8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white transition-colors"
            title="Switch temperature unit"
          >
            °{tempUnit}
          </button>

          {/* Sync / Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-slate-300 hover:text-white transition-colors"
            title="Refresh Doppler Radar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
          </button>

          {demoMode && <DemoBadge />}
        </div>
      </div>

      {/* Center Temperature & Icon Row */}
      <div className="flex items-center justify-between my-4">
        <div>
          <div className="text-5xl font-black tracking-tight flex items-baseline space-x-1">
            <span>{formatTemp(weather.temperature)}</span>
          </div>
          <div className="text-xs text-slate-300 mt-1 flex items-center space-x-1.5 font-medium">
            <Thermometer className="w-3.5 h-3.5 text-blue-400" />
            <span>{t(lang, "feelsLike")} {formatTemp(weather.feels_like)}</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-300">{localizedRefreshed}</span>
          </div>
          <div className="text-base font-semibold text-blue-200 mt-2">
            {localizedCondition}
          </div>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-inner">
          <WeatherIcon name={weather.icon} className="w-12 h-12 text-blue-300 animate-pulse" />
        </div>
      </div>

      {/* Key Primary Metrics */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-700/60 text-xs text-slate-300">
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/5">
          <Droplets className="w-4 h-4 text-blue-400 mb-1" />
          <span className="text-[11px] text-slate-400">{t(lang, "rainfall")}</span>
          <span className="font-bold text-white mt-0.5">{weather.rainfall_intensity} mm/h</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/5">
          <Wind className="w-4 h-4 text-cyan-400 mb-1" />
          <span className="text-[11px] text-slate-400">{t(lang, "wind")}</span>
          <span className="font-bold text-white mt-0.5">{weather.wind_speed} km/h</span>
        </div>
        <div className="bg-white/5 rounded-xl p-2.5 flex flex-col items-center justify-center border border-white/5">
          <Gauge className="w-4 h-4 text-emerald-400 mb-1" />
          <span className="text-[11px] text-slate-400">{t(lang, "humidity")}</span>
          <span className="font-bold text-white mt-0.5">{weather.humidity}%</span>
        </div>
      </div>

      {/* Expandable Advanced Telemetry Dropdown */}
      {expanded && (
        <div className="grid grid-cols-3 gap-2.5 pt-2.5 mt-2.5 border-t border-slate-700/40 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
            <Sun className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
            <span className="text-[10px] text-slate-400">{t(lang, "uvIndex")}</span>
            <span className="font-bold text-white text-[11px]">2 (Low)</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
            <Cloud className="w-3.5 h-3.5 text-blue-300 mb-0.5" />
            <span className="text-[10px] text-slate-400">{t(lang, "cloudCover")}</span>
            <span className="font-bold text-white text-[11px]">84%</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2 flex flex-col items-center justify-center">
            <Eye className="w-3.5 h-3.5 text-slate-300 mb-0.5" />
            <span className="text-[10px] text-slate-400">{t(lang, "visibility")}</span>
            <span className="font-bold text-white text-[11px]">6.5 km</span>
          </div>
        </div>
      )}

      {/* Expand / Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-3 py-1 text-[11px] font-semibold text-slate-400 hover:text-white flex items-center justify-center space-x-1 transition-colors"
      >
        <span>{expanded ? t(lang, "hideTelemetry") : t(lang, "showTelemetry")}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
