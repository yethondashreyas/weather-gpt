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

      {/* 24-Hour Trends Chart Widget (Recharts) */}
      <HourlyTrendsWidget />

      {/* Forecast Strip (24H vs 7-Day) */}
      <ForecastStrip />

      {/* Deterministic Risk Card */}
      <RiskCard />

      {/* Hands-Free Voice Trigger Card */}
      <VoiceTrigger />



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
