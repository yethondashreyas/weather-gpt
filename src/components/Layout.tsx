import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { SmartSiren } from "./SmartSiren";
import { ScrollToTop } from "./ScrollToTop";
import { GeminiLiveVoiceModal } from "./voice/GeminiLiveVoiceModal";
import { BottomNav } from "./BottomNav";
import { Toast } from "./Toast";
import { EmergencySosModal } from "./EmergencySosModal";
import { SafetyBulletinModal } from "./SafetyBulletinModal";
import { LanguageSelector } from "./LanguageSelector";
import { Bell, LifeBuoy } from "lucide-react";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, liveVoiceOpen, closeLiveVoice, openSos, risk } = useWeatherGPT();

  const isCritical = risk.level === "CRITICAL" || risk.score >= 75;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center">
      <ScrollToTop />
      <Toast />
      <SmartSiren />
      <EmergencySosModal />
      <SafetyBulletinModal />
      <GeminiLiveVoiceModal isOpen={liveVoiceOpen} onClose={closeLiveVoice} />

      {/* Main Container constrained to mobile-first max-w-md */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-2xl relative pb-20">
        {/* Unified Top App Header - No overlap with page controls */}
        <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-1.5 text-left group"
          >
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
              WeatherGPT
            </span>
          </button>

          <div className="flex items-center space-x-1.5">
            {/* Global Multilingual Selector */}
            <LanguageSelector compact />

            {/* Quick SOS Speed Dial Button */}
            <button
              onClick={openSos}
              className={`flex items-center space-x-1 py-1 px-2.5 rounded-xl font-black text-xs shadow-2xs transition-all ${
                isCritical
                  ? "bg-red-600 hover:bg-red-700 text-white animate-pulse ring-2 ring-red-400/50"
                  : "bg-red-500/10 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-300/50 hover:bg-red-600 hover:text-white"
              }`}
              title="Emergency SOS Speed Dial"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
              title="Alerts Log"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Routed Content View */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>

        {/* Dynamic Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
};
