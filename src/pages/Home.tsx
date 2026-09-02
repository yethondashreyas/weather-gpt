import React from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { WeatherHero } from "../components/weather/WeatherHero";
import { ForecastStrip } from "../components/weather/ForecastStrip";
import { RiskCard } from "../components/weather/RiskCard";
import { MonthlyRiskSummary } from "../components/weather/MonthlyRiskSummary";
import { VoiceTrigger } from "../components/voice/VoiceTrigger";
import { LanguageSelector } from "../components/LanguageSelector";
import { t } from "../lib/i18n";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ShieldAlert, Sparkles, Sliders } from "lucide-react";

export const Home: React.FC = () => {
  const { openSiren, openLiveVoice, risk } = useWeatherGPT();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-5">
      {/* Top Bar with Language Selector & Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>WeatherGPT</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              SIH26068
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Multilingual disaster safety assistant</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Weather Hero Card */}
      <WeatherHero />

      {/* Forecast Strip */}
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
              <span className="text-[10px] bg-cyan-400/30 text-cyan-200 px-1.5 py-0.5 rounded-full font-mono">Real-time</span>
            </h4>
            <p className="text-xs text-blue-100">Talk live about rain, cyclone & safety</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-semibold text-white backdrop-blur-md group-hover:bg-white/30 transition-colors">
          Start Voice →
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
          <span className="text-xs">{t("en", "askGpt")}</span>
        </button>
        <button
          onClick={openSiren}
          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-2xl shadow-md transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span className="text-xs">Reopen Siren</span>
        </button>
      </div>
    </div>
  );
};
