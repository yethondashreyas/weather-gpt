import React, { useState } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { t, translateCity, LEVEL_LABEL } from "../lib/i18n";
import { localizeReason, localizedAction } from "../lib/reasonText";
import {
  FileText,
  X,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const SafetyBulletinModal: React.FC = () => {
  const { bulletinOpen, closeBulletin, weather, risk, lang, showToast } = useWeatherGPT();
  const [copied, setCopied] = useState(false);

  if (!bulletinOpen) return null;

  const incidentCode = `WG-DISASTER-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-CRIT`;
  const timestamp = new Date().toLocaleString();
  const localizedCity = translateCity(weather.locationName, lang);
  const localizedLevel = (LEVEL_LABEL[lang] || LEVEL_LABEL.en)[risk.level] || risk.level;
  const actionText = localizedAction(risk.level, lang);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `=========================================
OFFICIAL WEATHER & DISASTER SAFETY BULLETIN
Incident Reference: ${incidentCode}
Issued At: ${timestamp}
Jurisdiction: ${weather.locationName} (${localizedCity})
-----------------------------------------
RISK ASSESSMENT
Hazard Level: ${risk.level} (${localizedLevel}) - Score: ${risk.score}/100
Status: Grounded by Deterministic Risk Engine
Rainfall Intensity: ${weather.rainfall_intensity} mm/h
Wind Speed: ${weather.wind_speed} km/h
Flood Indicator: ${Math.round(weather.flood_indicator * 100)}%

PRIMARY HAZARDS:
${risk.reasons.map((r) => ` - ${localizeReason(r, lang)}`).join("\n")}

MANDATORY SAFETY DIRECTIVE:
${actionText}

EMERGENCY HELPLINES:
- National Emergency: 112
- State Disaster Management Authority: 1070
- GHMC Monsoon Emergency Cell: 040-21111111
- Emergency Ambulance: 108
=========================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(lang === "te" ? "బులిటెన్ కాపీ చేయబడింది" : lang === "hi" ? "बुलेटिन कॉपी किया गया" : "Official bulletin text copied to clipboard");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {lang === "te" ? "భద్రతా బులెటిన్ & నివేదిక" : lang === "hi" ? "सुरक्षा बुलेटिन और रिपोर्ट" : "Safety Bulletin & Incident Report"}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === "te" ? "అధికారిక విపత్తు సలహాదారు ఫార్మాట్" : lang === "hi" ? "आधिकारिक आपदा परामर्श प्रारूप" : "Official Disaster Advisory Format"}
              </p>
            </div>
          </div>
          <button
            onClick={closeBulletin}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Printable Bulletin Document Body */}
        <div id="printable-bulletin" className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Header Seal Banner */}
          <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                WeatherGPT Disaster Intelligence
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {lang === "te" ? "వాతావరణ విపత్తు సంఘటన బులెటిన్" : lang === "hi" ? "मौसम आपदा घटना बुलेटिन" : "WEATHER DISASTER INCIDENT BULLETIN"}
              </h2>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                REF: {incidentCode}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">
                {lang === "te" ? "సమయం" : lang === "hi" ? "समय" : "Timestamp"}
              </span>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{timestamp}</span>
            </div>
          </div>

          {/* Area & Score Strip */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block mb-0.5 uppercase">
                {lang === "te" ? "లక్ష్య అధికార పరిధి" : lang === "hi" ? "लक्षित क्षेत्राधिकार" : "Target Jurisdiction"}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{localizedCity}</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              risk.level === "CRITICAL"
                ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300"
            }`}>
              <span className="text-[10px] opacity-75 block mb-0.5 uppercase font-bold">
                {lang === "te" ? "ప్రమాద స్థాయి" : lang === "hi" ? "जोखिम स्तर" : "Assessed Hazard Level"}
              </span>
              <span className="text-sm font-black">{localizedLevel} ({risk.score}/100)</span>
            </div>
          </div>

          {/* Weather Telemetry Matrix */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
              {lang === "te" ? "ప్రత్యక్ష టెలిమెట్రీ రీడింగ్‌లు" : lang === "hi" ? "लाइव टेलीमेट्री रीडिंग" : "Active Telemetry Readings"}
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t(lang, "rainfall")}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{weather.rainfall_intensity} mm/h</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t(lang, "wind")}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{weather.wind_speed} km/h</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">{t(lang, "floodAlert")}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{Math.round(weather.flood_indicator * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Key Identified Factors */}
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px] mb-1.5">
              {t(lang, "detectedHazards")}
            </h4>
            <div className="space-y-1">
              {risk.reasons.map((r, i) => (
                <div key={i} className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{localizeReason(r, lang)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Directive */}
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>{t(lang, "recommendedAction")}</span>
            </h4>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
              {actionText}
            </p>
          </div>

          {/* Notice */}
          <p className="text-[10px] text-slate-400 text-center italic">
            Automated generated bulletin for NDMA / SDMA disaster coordination.
          </p>
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (lang === "te" ? "కాపీ చేయబడింది!" : lang === "hi" ? "कॉपी हुआ!" : "Copied!") : (lang === "te" ? "నివేదిక టెక్స్ట్ కాపీ" : lang === "hi" ? "रिपोर्ट टेक्स्ट कॉपी करें" : "Copy Report Text")}</span>
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === "te" ? "ప్రింట్ బులెటిన్" : lang === "hi" ? "प्रिंट बुलेटिन" : "Print Bulletin"}</span>
            </button>
            <button
              onClick={closeBulletin}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300"
            >
              {lang === "te" ? "పూర్తయింది" : lang === "hi" ? "पूर्ण" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
