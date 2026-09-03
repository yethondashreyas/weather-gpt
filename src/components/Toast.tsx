import React from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export const Toast: React.FC = () => {
  const { toastMessage } = useWeatherGPT();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center space-x-3 text-xs font-semibold">
        <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center flex-shrink-0">
          <Info className="w-3.5 h-3.5" />
        </div>
        <span className="flex-1 leading-snug">{toastMessage}</span>
      </div>
    </div>
  );
};
