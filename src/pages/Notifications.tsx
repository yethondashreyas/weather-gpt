import React, { useEffect } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LanguageSelector } from "../components/LanguageSelector";
import { Bell, CheckCheck, Trash2, ShieldAlert } from "lucide-react";

export const Notifications: React.FC = () => {
  const { notifications, markAllNotificationsRead, clearNotifications } = useWeatherGPT();

  useEffect(() => {
    const timer = setTimeout(() => {
      markAllNotificationsRead();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Alert Log</h1>
          <p className="text-xs text-slate-500">Critical danger & siren transition history</p>
        </div>
        <LanguageSelector />
      </div>

      {notifications.length > 0 && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2.5 py-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark read</span>
          </button>
          <button
            onClick={clearNotifications}
            className="flex items-center space-x-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline px-2.5 py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200">No Critical Alerts Logged</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Critical alerts will automatically trigger when the risk score enters CRITICAL status (≥75) during severe weather scenarios.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start space-x-3 ${
                notif.read
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 shadow-sm"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    CRITICAL RISK ({notif.score}/100)
                  </span>
                  <span className="text-[11px] text-slate-400">{notif.time}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{notif.location}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Scenario trigger: <span className="font-semibold font-mono">{notif.scenario}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
