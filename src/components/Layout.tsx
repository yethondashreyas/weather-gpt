import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { t } from "../lib/i18n";
import { SmartSiren } from "./SmartSiren";
import { ScrollToTop } from "./ScrollToTop";
import { GeminiLiveVoiceModal } from "./voice/GeminiLiveVoiceModal";
import { Home, MessageSquare, CloudRain, Calendar, Map as MapIcon, Settings, Bell } from "lucide-react";

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, unreadCount, liveVoiceOpen, closeLiveVoice } = useWeatherGPT();

  const navItems = [
    { path: "/", label: t(lang, "home"), icon: Home },
    { path: "/chat", label: t(lang, "chat"), icon: MessageSquare },
    { path: "/climate", label: t(lang, "climate"), icon: CloudRain },
    { path: "/risk-history", label: t(lang, "history"), icon: Calendar },
    { path: "/map", label: t(lang, "map"), icon: MapIcon },
    { path: "/settings", label: t(lang, "settings"), icon: Settings },
  ];

  const showBell = location.pathname !== "/chat";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center">
      <ScrollToTop />
      <SmartSiren />
      <GeminiLiveVoiceModal isOpen={liveVoiceOpen} onClose={closeLiveVoice} />

      {/* Main Container constrained to mobile-first max-w-md or md */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-white dark:bg-slate-900 shadow-2xl relative pb-24">
        {/* Top Header Floating Notification Bell */}
        {showBell && (
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
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

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-2 py-2">
          <div className="grid grid-cols-6 gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                    active
                      ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] truncate max-w-[56px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
