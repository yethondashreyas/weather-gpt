import React, { useState } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { t, LEVEL_LABEL } from "../lib/i18n";
import { localizeReason, localizedAction } from "../lib/reasonText";
import {
  MapPin,
  AlertTriangle,
  Search,
  CheckCircle,
  Radio,
  Share2,
  Volume2,
  VolumeX,
  Navigation,
  Home as HomeIcon,
  PhoneCall,
} from "lucide-react";
import { getMapAreas, RELIEF_SHELTERS, MapArea } from "../lib/mapAreas";

export const RiskMap: React.FC = () => {
  const { lang, speaking, speak, stopSpeaking, openSos, showToast, scenario } = useWeatherGPT();
  const [areas, setAreas] = useState<MapArea[]>(() => getMapAreas(scenario || "HEAVY_RAIN"));
  const [selectedArea, setSelectedArea] = useState<MapArea>(() => getMapAreas(scenario || "HEAVY_RAIN")[0]);
  const [selectedShelter, setSelectedShelter] = useState<typeof RELIEF_SHELTERS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "critical" | "shelters">("all");
  const [radarSimulating, setRadarSimulating] = useState(false);

  // Filtered list based on search and tab
  const filteredAreas = areas.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === "critical") {
      return a.risk.level === "CRITICAL" || a.risk.level === "HIGH";
    }
    return true;
  });

  const handleSimulateRadar = () => {
    setRadarSimulating(true);
    showToast(
      lang === "te"
        ? "🛰️ లైవ్ IMD డాప్లర్ రాడార్ ఫ్రంట్ స్కాన్ చేస్తోంది..."
        : lang === "hi"
        ? "🛰️ लाइव आईएमडी डॉपलर रडार फ्रंट स्कैन किया जा रहा है..."
        : "🛰️ Simulating Live IMD Doppler Radar Front"
    );
    setTimeout(() => {
      setRadarSimulating(false);
      showToast(
        lang === "te"
          ? "రాడార్ స్కాన్ పూర్తయింది: 3 తీవ్రమైన వరద ప్రాంతాలు గుర్తించబడ్డాయి"
          : lang === "hi"
          ? "रडार स्कैन पूरा हुआ: 3 गंभीर बाढ़ क्षेत्र पाए गए"
          : "Radar sweep complete: 3 critical flood cells identified"
      );
    }, 2800);
  };

  const currentLevelLabel = (LEVEL_LABEL[lang] || LEVEL_LABEL.en)[selectedArea.risk.level] || selectedArea.risk.level;
  const currentAction = localizedAction(selectedArea.risk.level, lang);

  const handleSpeakGuidance = (area: MapArea) => {
    if (speaking) {
      stopSpeaking();
    } else {
      const areaLevel = (LEVEL_LABEL[lang] || LEVEL_LABEL.en)[area.risk.level] || area.risk.level;
      const text = `${area.name}: ${areaLevel}, ${t(lang, "score")} ${area.risk.score} / 100. ${localizedAction(area.risk.level, lang)}`;
      speak(text);
    }
  };

  const handleCopyCoords = (lat: number, lon: number, name: string) => {
    navigator.clipboard.writeText(`${name}: ${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`);
    showToast(
      lang === "te"
        ? `${name} కోఆర్డినేట్లు కాపీ చేయబడ్డాయి`
        : lang === "hi"
        ? `${name} के निर्देशांक कॉपी किए गए`
        : `Copied coordinates for ${name}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t(lang, "riskMapTitle")}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {t(lang, "zonesCount")}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t(lang, "mapSubtitle")}
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar (Search + Filter Chips + Radar Sweep) */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2 z-20">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t(lang, "searchZone")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-0.5">
          <div className="flex space-x-1">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === "all"
                  ? "bg-blue-600 text-white shadow-xs font-bold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {t(lang, "allZones")}
            </button>
            <button
              onClick={() => setFilterMode("critical")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === "critical"
                  ? "bg-red-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {t(lang, "criticalRisk")}
            </button>
            <button
              onClick={() => setFilterMode("shelters")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === "shelters"
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {t(lang, "reliefShelters")}
            </button>
          </div>

          <button
            onClick={handleSimulateRadar}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-2xs ${
              radarSimulating
                ? "bg-cyan-500 text-white animate-pulse"
                : "bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40"
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{radarSimulating ? t(lang, "sweeping") : t(lang, "radarFront")}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <div className="h-64 w-full relative z-10 border-b border-slate-200 dark:border-slate-800">
        <MapContainer
          center={[17.410, 78.470]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Risk Zone Pins */}
          {filteredAreas.map((area) => {
            const hex = getPinHexColor(area.risk.level);
            const isSelected = selectedArea.id === area.id;
            return (
              <CircleMarker
                key={area.id}
                center={[area.lat, area.lon]}
                radius={isSelected ? 14 : 9}
                pathOptions={{
                  color: isSelected ? "#ffffff" : hex,
                  fillColor: hex,
                  fillOpacity: 0.85,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedArea(area);
                    setSelectedShelter(null);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <div className="text-xs font-bold text-slate-900">
                    {area.name} ({area.risk.score}/100)
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          {/* Render Relief Shelters */}
          {(filterMode === "shelters" || filterMode === "all") &&
            RELIEF_SHELTERS.map((s) => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lon]}
                radius={10}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#059669",
                  fillOpacity: 0.95,
                  weight: 3,
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedShelter(s);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <div className="text-xs font-bold text-emerald-900">
                    🏥 {s.name}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-2 left-2 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-2 text-[10px] font-bold border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600 dark:text-slate-300">
              {t(lang, "criticalRisk")} (≥75)
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">
              {t(lang, "reliefShelters")}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Shelter Modal Card if Clicked */}
      {selectedShelter && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900/60 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <HomeIcon className="w-4 h-4 text-emerald-600" />
              <span>{selectedShelter.name}</span>
            </div>
            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
              {selectedShelter.status}
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            {lang === "te" ? "సామర్థ్యం:" : lang === "hi" ? "क्षमता:" : "Capacity:"} <strong>{selectedShelter.capacity}</strong> • {lang === "te" ? "హెల్ప్‌లైన్:" : lang === "hi" ? "हेल्पलाइन:" : "Helpline:"} <strong>{selectedShelter.contact}</strong>
          </p>
          <div className="flex space-x-2 pt-1">
            <button
              onClick={() => showToast(`${selectedShelter.name}...`)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center space-x-1 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t(lang, "safeRoute")}</span>
            </button>
            <button
              onClick={openSos}
              className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 text-xs font-bold"
            >
              {t(lang, "dialHelplines")}
            </button>
          </div>
        </div>
      )}

      {/* Selected Area Detail Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{selectedArea.name}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {selectedArea.lat.toFixed(4)}° N, {selectedArea.lon.toFixed(4)}° E
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSpeakGuidance(selectedArea)}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center space-x-1"
              title="Speak Safety Instructions"
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                selectedArea.risk.level === "CRITICAL"
                  ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  : selectedArea.risk.level === "HIGH"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                  : selectedArea.risk.level === "MODERATE"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              {currentLevelLabel} ({selectedArea.risk.score}/100)
            </span>
          </div>
        </div>

        {/* Telemetry Numbers */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 block mb-0.5">{t(lang, "rainfall")}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedArea.weather.rainfall_intensity} mm/h
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 block mb-0.5">{t(lang, "wind")}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {selectedArea.weather.wind_speed} km/h
            </span>
          </div>
        </div>

        {/* Reasons */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t(lang, "detectedHazards")}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedArea.risk.reasons.map((r, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {localizeReason(r, lang)}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{t(lang, "recommendedAction")}</span>
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
            {currentAction}
          </p>

          <div className="pt-1 flex space-x-2">
            <button
              onClick={() => handleCopyCoords(selectedArea.lat, selectedArea.lon, selectedArea.name)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800"
            >
              <Share2 className="w-3 h-3" />
              <span>{t(lang, "shareLocation")}</span>
            </button>
            <button
              onClick={openSos}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{t(lang, "emergencyHelp")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getPinHexColor(level: string): string {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";
    case "HIGH":
      return "#f97316";
    case "MODERATE":
      return "#f59e0b";
    default:
      return "#10b981";
  }
}
