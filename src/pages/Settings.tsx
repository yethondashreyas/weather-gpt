import React from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LOCATIONS } from "../lib/weatherData";
import { WEIGHTS } from "../lib/riskEngine";
import { LanguageSelector } from "../components/LanguageSelector";
import { ThemeToggle } from "../components/ThemeToggle";
import { Globe, MapPin, Play, Sliders, ShieldCheck } from "lucide-react";

export const Settings: React.FC = () => {
  const { lang, locationId, setLocationId, demoMode, setDemoMode, autoSpeakCritical, setAutoSpeakCritical, sirenAudioEnabled, setSirenAudioEnabled, scenario, setScenario } = useWeatherGPT();

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Settings & Rules</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure simulation & inspect deterministic engine</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Preferences Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Theme & High-Contrast Disaster Mode Toggle */}
        <ThemeToggle variant="card" />

        {/* Location Picker */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Target Location</span>
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">Demo Mode (Simulated Data)</span>
            <span className="text-xs text-slate-500">Toggle offline scenarios & crisis presets</span>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              demoMode ? "bg-blue-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Auto Speak Critical Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">Auto-Speak Critical Risk</span>
            <span className="text-xs text-slate-500">Read risk engine conclusion aloud automatically on CRITICAL alert</span>
          </div>
          <button
            onClick={() => setAutoSpeakCritical(!autoSpeakCritical)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              autoSpeakCritical ? "bg-blue-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Emergency Siren Sound Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">Emergency Siren Sound</span>
            <span className="text-xs text-slate-500">Play looping browser-based audio alarm when risk level is CRITICAL</span>
          </div>
          <button
            onClick={() => setSirenAudioEnabled(!sirenAudioEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              sirenAudioEnabled ? "bg-blue-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Scenario Picker */}
        {demoMode && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-2">
              <Play className="w-3.5 h-3.5 text-emerald-500" />
              <span>Crisis Demo Scenario</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "NORMAL", label: "Normal" },
                { id: "HEAVY_RAIN", label: "Heavy Rain" },
                { id: "SEVERE_RAINFALL", label: "Severe Cyclone" },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setScenario(sc.id)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    scenario === sc.id
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deterministic Risk Engine Weights */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Deterministic Risk Engine Weights (Sum = 100)</h3>
        </div>

        <div className="space-y-2.5 text-xs">
          {Object.entries(WEIGHTS).map(([key, weight]) => (
            <div key={key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize font-mono">{key.replace("_", " ")}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{weight} pts</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-800 dark:text-slate-200">Level Thresholds:</p>
          <p>• CRITICAL: Score ≥ 75</p>
          <p>• HIGH: Score ≥ 50</p>
          <p>• MODERATE: Score ≥ 25</p>
          <p>• LOW: Score &lt; 25</p>
        </div>
      </div>
    </div>
  );
};
