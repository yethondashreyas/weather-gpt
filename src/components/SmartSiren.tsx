import React, { useEffect, useRef, useMemo } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { t, SIREN_ACTIONS, SIREN_MESSAGE, LEVEL_LABEL } from "../lib/i18n";
import { playEmergencySiren, stopEmergencySiren } from "../lib/audioSiren";
import { ShieldAlert, AlertOctagon, ArrowRight, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SmartSiren: React.FC = () => {
  const { sirenOpen, ackSiren, risk, lang, weather, sirenAudioEnabled } = useWeatherGPT();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate dynamic browser WAV audio blob for looping emergency alarm
  const sirenAudioSrc = useMemo(() => {
    try {
      const sampleRate = 8000;
      const duration = 1.2;
      const numSamples = sampleRate * duration;
      const buffer = new Uint8Array(44 + numSamples * 2);
      const view = new DataView(buffer.buffer);

      const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeStr(0, "RIFF");
      view.setUint32(4, 36 + numSamples * 2, true);
      writeStr(8, "WAVE");
      writeStr(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeStr(36, "data");
      view.setUint32(40, numSamples * 2, true);

      let offset = 44;
      for (let i = 0; i < numSamples; i++) {
        const tVal = i / sampleRate;
        const freq = 450 + 400 * Math.sin(2 * Math.PI * tVal * 1.5);
        const sample = Math.sin(2 * Math.PI * freq * tVal) * 0.25;
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, Math.max(-32768, Math.min(32767, intSample)), true);
        offset += 2;
      }

      const blob = new Blob([buffer], { type: "audio/wav" });
      return URL.createObjectURL(blob);
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    if (sirenOpen && sirenAudioEnabled) {
      playEmergencySiren();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      stopEmergencySiren();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    return () => {
      stopEmergencySiren();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [sirenOpen, sirenAudioEnabled]);

  if (!sirenOpen) return null;

  const actions = SIREN_ACTIONS[lang] || SIREN_ACTIONS.en;
  const message = SIREN_MESSAGE[lang] || SIREN_MESSAGE.en;
  const levelLabels = LEVEL_LABEL[lang] || LEVEL_LABEL.en;
  const localizedLevel = levelLabels[risk.level] || risk.level;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      {/* Browser-based Audio Element for looping emergency alarm sound */}
      {sirenAudioSrc && (
        <audio
          ref={audioRef}
          src={sirenAudioSrc}
          loop
          preload="auto"
        />
      )}

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-4 border-red-600 rounded-3xl shadow-2xl overflow-hidden animate-siren-flash">
        {/* Top Header Banner with pulse */}
        <div className="bg-red-600 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500 rounded-full opacity-30 animate-ping pointer-events-none" />
          <div className="flex justify-center items-center space-x-2 mb-2">
            <ShieldAlert className="w-8 h-8 animate-bounce text-yellow-300" />
            <AlertOctagon className="w-8 h-8 animate-pulse text-white" />
            {sirenAudioEnabled ? (
              <Volume2 className="w-5 h-5 text-yellow-300 animate-pulse" title="Siren Audio Active" />
            ) : (
              <VolumeX className="w-5 h-5 text-red-300" title="Siren Audio Muted in Settings" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{t(lang, "sirenTitle")}</h2>
          <p className="text-red-100 text-sm mt-1">{message}</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Risk Level Badge & Score */}
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-2xl p-4">
            <div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                {t(lang, "currentRisk")}
              </span>
              <h3 className="text-xl font-bold text-red-700 dark:text-red-300">{localizedLevel}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Location: {weather.locationName}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-red-600 dark:text-red-400">{risk.score}</span>
              <span className="text-xs text-slate-500 block">/100 {t(lang, "score")}</span>
            </div>
          </div>

          {/* Immediate Actions */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
              <span>{t(lang, "immediate")}</span>
            </h4>
            <ul className="space-y-2.5">
              {actions.map((act, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                ackSiren();
                navigate("/chat");
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-colors"
            >
              <span>{t(lang, "guidance")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={ackSiren}
              className="flex items-center justify-center space-x-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t(lang, "understand")}</span>
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            {t(lang, "disclaimer")}
          </p>
        </div>
      </div>
    </div>
  );
};
