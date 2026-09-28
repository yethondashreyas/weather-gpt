import React, { useState, useEffect } from "react";
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
import { AtmosphericOverlay } from "./weather/AtmosphericOverlay";
import { Bell, LifeBuoy, Smartphone, Monitor, Wifi, Battery, Signal } from "lucide-react";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, liveVoiceOpen, closeLiveVoice, openSos, risk, nativeSimulatorMode, toggleNativeSimulator } = useWeatherGPT();

  const [currentTime, setCurrentTime] = useState("9:41");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isCritical = risk.level === "CRITICAL" || risk.score >= 75;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-0 sm:py-6 selection:bg-blue-500 selection:text-white">
      <ScrollToTop />
      <Toast />
      <SmartSiren />
      <EmergencySosModal />
      <SafetyBulletinModal />
      <GeminiLiveVoiceModal isOpen={liveVoiceOpen} onClose={closeLiveVoice} />

      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-4xl px-4 mb-2 hidden sm:flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-slate-300 font-bold">React Native 0.76+ & CSS StyleSheet Architecture</span>
          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono text-[10px] border border-blue-500/30">60 FPS Native Hermes</span>
        </div>

        <button
          onClick={toggleNativeSimulator}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700 transition-all shadow-sm"
          title="Toggle React Native Mobile Simulator Bezel"
        >
          {nativeSimulatorMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Switch to Full Web View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enable React Native Device Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Outer Wrapper: Conditional React Native Mobile Bezel or Full Fluid */}
      <div className={nativeSimulatorMode ? "w-full sm:max-w-[412px] sm:rounded-[48px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden bg-white dark:bg-slate-900 flex flex-col min-h-screen sm:min-h-[860px] relative transition-all duration-300" : "w-full max-w-2xl min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-2xl relative"}>
        <AtmosphericOverlay />
        
        {/* Simulated iOS / Android Hardware Status Bar when in Device Frame Mode */}
        {nativeSimulatorMode && (
          <div className="bg-slate-900 text-white px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold select-none z-40 border-b border-slate-800/60">
            <span>{currentTime}</span>
            <div className="w-24 h-4 bg-black rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40" />
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Unified Top App Header */}
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
            {/* React Native Mode badge */}
            <button
              onClick={toggleNativeSimulator}
              className="sm:hidden p-1.5 rounded-xl bg-blue-500/10 text-blue-500 text-xs font-bold"
              title="Toggle RN Mode"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

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
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Outlet />
        </div>

        {/* Dynamic Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
};
