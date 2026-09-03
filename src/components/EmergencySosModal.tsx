import React, { useState } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { useNavigate } from "react-router-dom";
import { t, translateCity, translateCondition } from "../lib/i18n";
import {
  PhoneCall,
  ShieldAlert,
  X,
  MapPin,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Home as HomeIcon,
} from "lucide-react";

export const EmergencySosModal: React.FC = () => {
  const { sosOpen, closeSos, weather, risk, showToast, lang } = useWeatherGPT();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!sosOpen) return null;

  const helplines = [
    { number: "112", name: lang === "te" ? "జాతీయ అత్యవసర ప్రతిస్పందన (NERS)" : lang === "hi" ? "राष्ट्रीय आपातकालीन प्रतिक्रिया (NERS)" : "National Emergency Response Support (NERS)", desc: lang === "te" ? "పోలీస్, అగ్నిమాపక, వైద్యం" : lang === "hi" ? "पुलिस, अग्निशमन, आपदा व चिकित्सा" : "Police, Fire, Disaster & Medical", priority: "critical" },
    { number: "1070", name: lang === "te" ? "రాష్ట్ర విపత్తు నిర్వహణ (SDMA)" : lang === "hi" ? "राज्य आपदा प्रबंधन (SDMA)" : "State Disaster Management (SDMA)", desc: lang === "te" ? "తెలంగాణ సంక్షోభ కేంద్రం" : lang === "hi" ? "तेलंगाना क्राइसिस सेंटर" : "Telangana State Crisis Center", priority: "high" },
    { number: "04021111111", name: lang === "te" ? "GHMC వర్షాకాల ఎమర్జెన్సీ సెల్" : lang === "hi" ? "जीएचएमसी मानसून आपातकालीन सेल" : "GHMC Monsoon Emergency Cell", desc: lang === "te" ? "హైదరాబాద్ వరద నియంత్రణ" : lang === "hi" ? "हैदराबाद बाढ़ नियंत्रण" : "Hyderabad City Flood & Inundation", priority: "high" },
    { number: "1077", name: lang === "te" ? "జిల్లా విపత్తు నియంత్రణ" : lang === "hi" ? "जिला आपदा नियंत्रण" : "District Disaster Control", desc: lang === "te" ? "కలెక్టరేట్ తరలింపు కేంద్రం" : lang === "hi" ? "कलेक्ट्रेट निकासी सहायता" : "District Collectorate Evacuation", priority: "medium" },
    { number: "108", name: lang === "te" ? "అత్యవసర అంబులెన్స్ సేవలు" : lang === "hi" ? "आपातकालीन एम्बुलेंस सेवा" : "Emergency Ambulance Services", desc: lang === "te" ? "క్రిటికల్ మెడికల్ రవాణా" : lang === "hi" ? "गंभीर चिकित्सा परिवहन" : "Critical Medical Transport", priority: "high" },
  ];

  const localizedCity = translateCity(weather.locationName, lang);
  const localizedCond = translateCondition(weather.condition, lang);

  const emergencyMessage = `🚨 EMERGENCY WEATHER ALERT & SOS
Location: ${weather.locationName} (${localizedCity})
GPS: 17.3850° N, 78.4867° E
Risk Level: ${risk.level} (${risk.score}/100)
Weather: ${weather.condition} (${localizedCond}), ${weather.rainfall_intensity} mm/h rain, ${weather.wind_speed} km/h wind.
Status: Seeking immediate assistance / flood guidance.
Grounded by WeatherGPT Disaster Assistant.`;

  const copyEmergencyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    showToast(lang === "te" ? "GPS కోఆర్డినేట్లతో SOS సందేశం కాపీ చేయబడింది" : lang === "hi" ? "जीपीएस निर्देशांकों के साथ एसओएस संदेश कॉपी किया गया" : "Emergency SOS text copied with GPS coordinates");
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(emergencyMessage)}`;
    window.open(url, "_blank");
  };

  const safeShelters = [
    { name: "Kotla Vijaya Bhaskara Reddy Indoor Stadium", area: "Yousufguda / Begumpet", capacity: "1,200 persons", food: lang === "te" ? "యాక్టివ్" : lang === "hi" ? "सक्रिय" : "Active" },
    { name: "Quli Qutb Shah Relief Stadium", area: "Old City / Charminar", capacity: "850 persons", food: lang === "te" ? "యాక్టివ్" : lang === "hi" ? "सक्रिय" : "Active" },
    { name: "Sanjeevaiah High Grounds Shelter", area: "Secunderabad", capacity: "950 persons", food: lang === "te" ? "యాక్టివ్" : lang === "hi" ? "सक्रिय" : "Active" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-red-500/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with high-urgency styling */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-black text-base">
                  {lang === "te" ? "ఎమర్జెన్సీ SOS హెల్ప్‌లైన్" : lang === "hi" ? "आपातकालीन एसओएस हेल्पलाइन" : "Emergency SOS Speed Dial"}
                </h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white text-red-700">
                  Live
                </span>
              </div>
              <p className="text-xs text-red-100">
                {lang === "te" ? "ప్రత్యక్ష విపత్తు సహాయ హెల్ప్‌లైన్‌లు" : lang === "hi" ? "सीधी आपदा राहत हेल्पलाइनें" : "Direct disaster & rescue helplines"}
              </p>
            </div>
          </div>
          <button
            onClick={closeSos}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Quick SOS Message Dispatch */}
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === "te" ? "మీ ప్రాంతం & టెలిమెట్రీ" : lang === "hi" ? "आपका स्थान और टेलीमेट्री" : "Your Location & Telemetry"}</span>
              </div>
              <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-bold">
                17.3850° N, 78.4867° E
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {lang === "te"
                ? "తీవ్ర ఆపదలో ఉన్నప్పుడు, ఈ ప్రమాణీకృత సందేశాన్ని సహాయక బృందాలకు లేదా కుటుంబానికి పంపండి."
                : lang === "hi"
                ? "गंभीर संकट की स्थिति में, इस मानकीकृत संदेश को राहत दलों या परिवार को तुरंत भेजें।"
                : "In severe distress, copy or dispatch this standardized distress message to rescue teams or family."}
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={copyEmergencyMessage}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (lang === "te" ? "కాపీ చేయబడింది" : lang === "hi" ? "कॉपी हुआ" : "Copied SOS") : "Copy SOS SMS"}</span>
              </button>
              <button
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp SOS</span>
              </button>
            </div>
          </div>

          {/* Direct Tap-to-Call Helplines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span>{lang === "te" ? "అత్యవసర సేవలకు కాల్ చేయండి" : lang === "hi" ? "आपातकालीन सेवाओं को कॉल करें" : "Tap to Call Emergency Services"}</span>
            </h4>
            <div className="space-y-2">
              {helplines.map((h, i) => (
                <a
                  key={i}
                  href={`tel:${h.number}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-900 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform shadow-xs">
                      {h.number.length > 5 ? "040" : h.number}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                        {h.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{h.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold">
                    <PhoneCall className="w-3 h-3 animate-pulse" />
                    <span>{lang === "te" ? "కాల్" : lang === "hi" ? "कॉल" : "Call"}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Active Relief Centers */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>{t(lang, "reliefShelters")}</span>
              </h4>
              <button
                onClick={() => {
                  closeSos();
                  navigate("/map");
                }}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-0.5"
              >
                <span>{lang === "te" ? "మ్యాప్ చూడండి" : lang === "hi" ? "मानचित्र देखें" : "View Map"}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {safeShelters.map((s, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">{s.area} • {lang === "te" ? "సామర్థ్యం:" : lang === "hi" ? "क्षमता:" : "Capacity:"} {s.capacity}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                    {s.food}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>{lang === "te" ? "తీవ్ర ప్రమాదంలో 112 కు నేరుగా డయల్ చేయండి." : lang === "hi" ? "अत्यधिक खतरे में सीधे 112 डायल करें।" : "In extreme danger, dial 112 directly."}</span>
          <button
            onClick={closeSos}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
          >
            {lang === "te" ? "మూసివేయి" : lang === "hi" ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
