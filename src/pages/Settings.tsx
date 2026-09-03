import React from "react";
import { useNavigate } from "react-router-dom";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LOCATIONS } from "../lib/weatherData";
import { ThemeToggle } from "../components/ThemeToggle";
import { t, translateCity } from "../lib/i18n";
import {
  MapPin,
  Play,
  Sliders,
  Smartphone,
  ChevronRight,
  Zap,
  RotateCcw,
  FileText,
  LifeBuoy,
  Download,
} from "lucide-react";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const {
    lang,
    locationId,
    setLocationId,
    demoMode,
    setDemoMode,
    autoSpeakCritical,
    setAutoSpeakCritical,
    sirenAudioEnabled,
    setSirenAudioEnabled,
    scenario,
    setScenario,
    customWeights,
    updateCustomWeight,
    resetWeights,
    openSos,
    openBulletin,
    showToast,
  } = useWeatherGPT();

  const totalWeight = (Object.values(customWeights) as number[]).reduce((a, b) => a + b, 0);

  const applyPreset = (preset: "standard" | "cyclone" | "flood") => {
    if (preset === "standard") {
      resetWeights();
      showToast(
        lang === "te"
          ? "ప్రామాణిక IMD బరువులు రీసెట్ చేయబడ్డాయి"
          : lang === "hi"
          ? "मानक आईएमडी वेट्स रीसेट किए गए"
          : "Reset to Standard IMD Meteorological Weights"
      );
    } else if (preset === "cyclone") {
      updateCustomWeight("rainfall", 20);
      updateCustomWeight("prob", 10);
      updateCustomWeight("wind", 35);
      updateCustomWeight("official_warning", 20);
      updateCustomWeight("flood", 5);
      updateCustomWeight("landslide", 10);
      showToast(
        lang === "te"
          ? "తుఫాను ప్రాధాన్యత బరువులు వర్తించబడ్డాయి"
          : lang === "hi"
          ? "चक्रवात प्राथमिकता वेट्स लागू किए गए"
          : "Applied Cyclone Priority Weights"
      );
    } else if (preset === "flood") {
      updateCustomWeight("rainfall", 35);
      updateCustomWeight("prob", 15);
      updateCustomWeight("wind", 10);
      updateCustomWeight("official_warning", 15);
      updateCustomWeight("flood", 20);
      updateCustomWeight("landslide", 5);
      showToast(
        lang === "te"
          ? "ఆకస్మిక వరద ప్రాధాన్యత బరువులు వర్తించబడ్డాయి"
          : lang === "hi"
          ? "अचानक बाढ़ प्राथमिकता वेट्स लागू किए गए"
          : "Applied Flash Flood Priority Weights"
      );
    }
  };

  const exportConfigJson = () => {
    const config = {
      locationId,
      demoMode,
      scenario,
      autoSpeakCritical,
      sirenAudioEnabled,
      customWeights,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weathergpt-config-${Date.now()}.json`;
    a.click();
    showToast(
      lang === "te"
        ? "కాన్ఫిగరేషన్ JSON డౌన్‌లోడ్ చేయబడింది"
        : lang === "hi"
        ? "कॉन्फ़िगरेशन JSON डाउनलोड किया गया"
        : "Engine configuration exported as JSON"
    );
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t(lang, "settingsTitle")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t(lang, "settingsSubtitle")}
          </p>
        </div>
      </div>

      {/* Preferences Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Theme & High-Contrast Disaster Mode Toggle */}
        <ThemeToggle variant="card" />

        {/* Location Picker */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>{t(lang, "monitoringCity")}</span>
          </label>
          <select
            value={locationId}
            onChange={(e) => {
              setLocationId(e.target.value);
              showToast(
                lang === "te"
                  ? "ప్రాంతం నవీకరించబడింది"
                  : lang === "hi"
                  ? "स्थान अपडेट किया गया"
                  : "Location updated"
              );
            }}
            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {translateCity(loc.name, lang)}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
              {t(lang, "demoMode")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t(lang, "demoModeDesc")}
            </span>
          </div>
          <button
            onClick={() => {
              setDemoMode(!demoMode);
              showToast(demoMode ? "Switched to Live Data" : "Switched to Demo Simulation Mode");
            }}
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
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
              {t(lang, "autoSpeak")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t(lang, "autoSpeakDesc")}
            </span>
          </div>
          <button
            onClick={() => {
              setAutoSpeakCritical(!autoSpeakCritical);
              showToast(autoSpeakCritical ? "Auto-speech disabled" : "Auto-speech enabled");
            }}
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
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
              {t(lang, "emergencySirenSound")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t(lang, "emergencySirenDesc")}
            </span>
          </div>
          <button
            onClick={() => {
              setSirenAudioEnabled(!sirenAudioEnabled);
              showToast(sirenAudioEnabled ? "Emergency audio muted" : "Emergency audio armed");
            }}
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
              <span>{t(lang, "scenarioPresets")}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: "NORMAL",
                  label: lang === "te" ? "సాధారణం" : lang === "hi" ? "सामान्य" : "Normal",
                },
                {
                  id: "HEAVY_RAIN",
                  label: lang === "te" ? "భారీ వర్షం" : lang === "hi" ? "भारी वर्षा" : "Heavy Rain",
                },
                {
                  id: "SEVERE_RAINFALL",
                  label: lang === "te" ? "తీవ్ర తుఫాను" : lang === "hi" ? "गंभीर चक्रवात" : "Severe Cyclone",
                },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    setScenario(sc.id);
                    showToast(`Active scenario: ${sc.label}`);
                  }}
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

      {/* Quick Emergency Actions Bar */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={openSos}
          className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 transition-colors shadow-2xs"
        >
          <LifeBuoy className="w-4 h-4 text-red-600" />
          <span>{t(lang, "testSos")}</span>
        </button>
        <button
          onClick={openBulletin}
          className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>{t(lang, "incidentBulletin")}</span>
        </button>
      </div>

      {/* High-Speed Native Mobile Code Hub Banner */}
      <div
        onClick={() => navigate("/native")}
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 shadow-sm border border-blue-700/40 cursor-pointer hover:border-blue-500 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-cyan-300 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black">{t(lang, "nativeCode")}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-black flex items-center space-x-1">
                  <Zap className="w-2.5 h-2.5" />
                  <span>Fast Loading</span>
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                {t(lang, "nativeCodeDesc")}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Interactive Deterministic Risk Engine Weights Customizer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {t(lang, "interactiveWeights")}
            </h3>
          </div>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              totalWeight === 100
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
            }`}
          >
            Total: {totalWeight} / 100
          </span>
        </div>

        {/* Preset Profiles */}
        <div className="flex space-x-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => applyPreset("standard")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold whitespace-nowrap"
          >
            {t(lang, "standardImd")}
          </button>
          <button
            onClick={() => applyPreset("cyclone")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold whitespace-nowrap"
          >
            {t(lang, "cyclonePriority")}
          </button>
          <button
            onClick={() => applyPreset("flood")}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold whitespace-nowrap"
          >
            {t(lang, "floodPriority")}
          </button>
        </div>

        {/* Weight Sliders */}
        <div className="space-y-3 pt-1 text-xs">
          {Object.entries(customWeights).map(([key, weight]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300 capitalize font-mono">
                  {key.replace("_", " ")}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {weight} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weight}
                onChange={(e) => updateCustomWeight(key, parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Reset & Export Actions */}
        <div className="flex space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              resetWeights();
              showToast("Weights restored to default (Sum = 100)");
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(lang, "resetWeights")}</span>
          </button>
          <button
            onClick={exportConfigJson}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t(lang, "exportJson")}</span>
          </button>
        </div>

        {/* Level Thresholds info */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-400">
          <p className="font-bold text-slate-800 dark:text-slate-200">{t(lang, "levelThresholds")}</p>
          <p>• CRITICAL: Score ≥ 75</p>
          <p>• HIGH: Score ≥ 50</p>
          <p>• MODERATE: Score ≥ 25</p>
          <p>• LOW: Score &lt; 25</p>
        </div>
      </div>
    </div>
  );
};
