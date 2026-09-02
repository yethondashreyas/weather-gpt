import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { SmartSiren } from "./SmartSiren";
import { ScrollToTop } from "./ScrollToTop";
import { GeminiLiveVoiceModal } from "./voice/GeminiLiveVoiceModal";
import { BottomNav } from "./BottomNav";
import { Bell } from "lucide-react";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, liveVoiceOpen, closeLiveVoice } = useWeatherGPT();

  const showBell = location.pathname !== "/chat" && location.pathname !== "/notifications";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center">
      <ScrollToTop />
      <SmartSiren />
      <GeminiLiveVoiceModal isOpen={liveVoiceOpen} onClose={closeLiveVoice} />

      {/* Main Container constrained to mobile-first max-w-md */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-2xl relative pb-20">
        {/* Top Header Floating Controls */}
        {showBell && (
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
              title="Alerts Log"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}

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
