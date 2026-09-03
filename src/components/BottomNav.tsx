import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { ThemeToggle } from "./ThemeToggle";
import { t } from "../lib/i18n";
import {
  Home,
  Map as MapIcon,
  MessageSquare,
  ShieldAlert,
  Menu,
  X,
  CloudRain,
  Calendar,
  Settings,
  Radio,
  Smartphone,
} from "lucide-react";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount, risk, openSiren, lang } = useWeatherGPT();
  const [moreOpen, setMoreOpen] = useState(false);

  const isCritical = risk.level === "CRITICAL" || risk.score >= 75;

  const handleNav = (path: string) => {
    setMoreOpen(false);
    navigate(path);
  };

  const moreItems = [
    {
      path: "/climate",
      label: t(lang, "climateLens"),
      desc: t(lang, "climateDesc"),
      icon: CloudRain,
    },
    {
      path: "/risk-history",
      label: t(lang, "riskTimeline"),
      desc: t(lang, "riskTimelineDesc"),
      icon: Calendar,
    },
    {
      path: "/native",
      label: t(lang, "nativeCode"),
      desc: t(lang, "nativeCodeDesc"),
      icon: Smartphone,
    },
    {
      path: "/settings",
      label: t(lang, "settingsNav"),
      desc: t(lang, "settingsNavDesc"),
      icon: Settings,
    },
  ];

  return (
    <>
      {/* "More" Drawer Backdrop & Sheet for Secondary Pages */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl p-5 space-y-3 animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t(lang, "more")}
                </span>
              </div>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Display & Disaster Theme Mode Toggler */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {t(lang, "displayMode")}
                </span>
                <ThemeToggle variant="header" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t(lang, "displayModeDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center space-x-3 p-3 rounded-2xl text-left transition-all ${
                      active
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}

              {/* Quick Trigger Siren Button in Menu */}
              <button
                onClick={() => {
                  setMoreOpen(false);
                  openSiren();
                }}
                className="flex items-center space-x-3 p-3 rounded-2xl text-left bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse">
                  <Radio className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold flex items-center space-x-1.5">
                    <span>{t(lang, "testSiren")}</span>
                    <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-mono">
                      Audio
                    </span>
                  </div>
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {t(lang, "testSirenDesc")}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar for Mobile */}
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 z-40 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      >
        <div className="grid grid-cols-5 items-center justify-between gap-1">
          {/* 1. Home */}
          <button
            id="nav-btn-home"
            onClick={() => handleNav("/")}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] relative ${
              location.pathname === "/"
                ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Home
              className={`w-5 h-5 transition-transform ${
                location.pathname === "/" ? "scale-110" : ""
              }`}
            />
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              {t(lang, "home")}
            </span>
          </button>

          {/* 2. Map (Direct Quick Switch) */}
          <button
            id="nav-btn-map"
            onClick={() => handleNav("/map")}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] relative ${
              location.pathname === "/map"
                ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MapIcon
              className={`w-5 h-5 transition-transform ${
                location.pathname === "/map" ? "scale-110" : ""
              }`}
            />
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              {t(lang, "map")}
            </span>
          </button>

          {/* 3. Chat AI (Center Highlight Quick Switch) */}
          <button
            id="nav-btn-chat"
            onClick={() => handleNav("/chat")}
            className="flex flex-col items-center justify-center min-h-[48px] relative group"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-all transform group-active:scale-95 ${
                location.pathname === "/chat"
                  ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/40 ring-2 ring-blue-400/50"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-blue-600 group-hover:text-white"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                location.pathname === "/chat"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {t(lang, "chat")}
            </span>
          </button>

          {/* 4. Critical Alerts (Direct Quick Switch with Real-Time Badge) */}
          <button
            id="nav-btn-alerts"
            onClick={() => handleNav("/notifications")}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] relative ${
              location.pathname === "/notifications"
                ? "text-red-600 dark:text-red-400 font-bold bg-red-50/80 dark:bg-red-950/50"
                : isCritical
                ? "text-red-500 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <div className="relative">
              <ShieldAlert
                className={`w-5 h-5 transition-transform ${
                  isCritical ? "text-red-500 animate-bounce" : ""
                } ${location.pathname === "/notifications" ? "scale-110" : ""}`}
              />
              {/* Unread / Active Badge */}
              {unreadCount > 0 ? (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              ) : isCritical ? (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              ) : null}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              {t(lang, "alerts")}
            </span>
          </button>

          {/* 5. More (Secondary Options) */}
          <button
            id="nav-btn-more"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all min-h-[48px] relative ${
              moreOpen ||
              ["/climate", "/risk-history", "/settings", "/native"].includes(
                location.pathname
              )
                ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50/80 dark:bg-blue-950/50"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">
              {t(lang, "more")}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
