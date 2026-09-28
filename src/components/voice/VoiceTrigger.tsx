import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { Mic, ArrowRight } from "lucide-react";

export const VoiceTrigger: React.FC = () => {
  const navigate = useNavigate();
  const { risk, lang } = useWeatherGPT();
  const [listening, setListening] = useState(true);

  const responseText = risk.level === "CRITICAL"
    ? "CRITICAL risk. Travel is not recommended."
    : risk.level === "HIGH"
    ? "HIGH risk. Postpone non-essential travel."
    : "Conditions are calm. Normal travel is safe.";

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-500/30 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-cyan-300">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              🎙 SENTINEL VOICE
            </h4>
            <p className="text-[11px] text-slate-400">Active Listening • Wake phrase: "Is it safe?"</p>
          </div>
        </div>

        <button
          onClick={() => setListening(!listening)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
            listening ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-slate-800 text-slate-400"
          }`}
        >
          {listening ? "Listening" : "Paused"}
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1">
        <div className="text-[10px] uppercase font-bold text-slate-400">Latest response</div>
        <p className="text-xs font-medium text-slate-200 leading-relaxed italic">
          "{responseText}"
        </p>
      </div>

      <button
        onClick={() => navigate("/chat")}
        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
      >
        <span>ASK SENTINEL</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
