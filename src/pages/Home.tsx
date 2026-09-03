import React from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { WeatherHero } from "../components/weather/WeatherHero";
import { HourlyTrendsWidget } from "../components/weather/HourlyTrendsWidget";
import { ForecastStrip } from "../components/weather/ForecastStrip";
import { RiskCard } from "../components/weather/RiskCard";
import { VoiceTrigger } from "../components/voice/VoiceTrigger";
import { MonthlyRiskSummary } from "../components/weather/MonthlyRiskSummary";
import { t, translateCity } from "../lib/i18n";
import {
  MessageSquare,
  ShieldAlert,
  MapPin,
  LifeBuoy,
  FileText,
  Sliders,
  Sparkles,
} from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    locationId,
    setLocationId,
    openSiren,
    openBulletin,
    openSos,
    openLiveVoice,
    showToast,
    lang,
  } = useWeatherGPT();

  const cities = [
    { id: "hyd", label: "Hyderabad" },
    { id: "vizag", label: "Visakhapatnam" },
    { id: "chennai", label: "Chennai" },
    { id: "mumbai", label: "Mumbai" },
    { id: "delhi", label: "Delhi" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Subtitle & Status Banner */}
      <div className="flex items-center justify-between pt-0.5">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t(lang, "appSubtitle")}
        </p>
      </div>

      {/* Quick City Switcher Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1 pl-1 flex-shrink-0">
          <MapPin className="w-3 h-3 text-blue-500" />
          <span>{t(lang, "cityLabel")}</span>
        </span>
        {cities.map((c) => {
          const isSelected = locationId === c.id;
          const translatedCity = translateCity(c.label, lang);
          return (
            <button
              key={c.id}
              onClick={() => {
                setLocationId(c.id);
                showToast(
                  lang === "te"
                    ? `రాడార్ మానిటర్ ${translatedCity}కు మార్చబడింది`
                    : lang === "hi"
                    ? `रडार मॉनिटर ${translatedCity} पर सेट किया गया`
                    : `Switched radar monitor to ${translatedCity}`
                );
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {translatedCity}
            </button>
          );
        })}
      </div>

      {/* Weather Hero Card with Telemetry */}
      <WeatherHero />

      {/* 4-Tool Quick Command Matrix for Rapid Disaster Action */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={openSos}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <LifeBuoy className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t(lang, "sosDial")}</span>
        </button>

        <button
          onClick={() => navigate("/map")}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t(lang, "shelters")}</span>
        </button>

        <button
          onClick={openBulletin}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t(lang, "bulletin")}</span>
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-900/60 text-purple-700 dark:text-purple-300 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t(lang, "weights")}</span>
        </button>
      </div>

      {/* 24-Hour Trends Chart Widget (Recharts) */}
      <HourlyTrendsWidget />

      {/* Forecast Strip (24H vs 7-Day) */}
      <ForecastStrip />

      {/* Deterministic Risk Card */}
      <RiskCard />

      {/* Hands-Free Voice Trigger Card */}
      <VoiceTrigger />

      {/* Gemini Live Voice Banner */}
      <button
        onClick={openLiveVoice}
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl p-4 shadow-lg flex items-center justify-between group transition-all transform hover:scale-[1.01]"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-sm flex items-center space-x-1.5">
              <span>Gemini Live Voice AI</span>
              <span className="text-[10px] bg-cyan-400/30 text-cyan-200 px-1.5 py-0.5 rounded-full font-mono">
                {lang === "te" ? "రియల్ టైమ్" : lang === "hi" ? "रीयल-टाइम" : "Real-time"}
              </span>
            </h4>
            <p className="text-xs text-blue-100">
              {lang === "te"
                ? "వర్షం, తుఫాను & భద్రతపై నేరుగా మాట్లాడండి"
                : lang === "hi"
                ? "वर्षा, चक्रवात और सुरक्षा पर लाइव बात करें"
                : "Talk live about rain, cyclone & safety"}
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-semibold text-white backdrop-blur-md group-hover:bg-white/30 transition-colors">
          {lang === "te" ? "ప్రారంభించండి →" : lang === "hi" ? "शुरू करें →" : "Start Voice →"}
        </div>
      </button>

      {/* 30-Day Risk Summary Card */}
      <MonthlyRiskSummary />

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-xs">{t(lang, "chatAi")}</span>
        </button>
        <button
          onClick={openSiren}
          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-xs">{t(lang, "testSiren")}</span>
        </button>
      </div>
    </div>
  );
};
