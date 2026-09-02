import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getMapAreas, getPinHexColor, MapArea } from "../lib/mapAreas";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { LanguageSelector } from "../components/LanguageSelector";
import { DemoBadge } from "../components/DemoBadge";
import { MapPin, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

export const RiskMap: React.FC = () => {
  const { scenario, demoMode } = useWeatherGPT();
  const areas = getMapAreas(demoMode ? scenario : "NORMAL");
  const [selectedArea, setSelectedArea] = useState<MapArea>(areas[0]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Risk Map</h1>
          <p className="text-xs text-slate-500">Hyderabad Multi-Zone Intelligence</p>
        </div>
        <LanguageSelector />
      </div>

      {/* Leaflet Map Container */}
      <div className="h-64 w-full relative z-10 border-b border-slate-200 dark:border-slate-800">
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {areas.map((area) => {
            const hex = getPinHexColor(area.risk.level);
            return (
              <CircleMarker
                key={area.id}
                center={[area.lat, area.lon]}
                radius={10}
                pathOptions={{
                  color: hex,
                  fillColor: hex,
                  fillOpacity: 0.8,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedArea(area),
                }}
              >
                <Popup>
                  <div className="text-xs font-bold">
                    {area.name}<br />
                    Risk: {area.risk.level} ({area.risk.score}/100)
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected Area Detail Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{selectedArea.name}</span>
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
            selectedArea.risk.level === "CRITICAL"
              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
              : selectedArea.risk.level === "HIGH"
              ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
              : selectedArea.risk.level === "MODERATE"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          }`}>
            {selectedArea.risk.level} ({selectedArea.risk.score}/100)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 block mb-0.5">Rainfall Intensity</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedArea.weather.rainfall_intensity} mm/h</span>
          </div>
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 block mb-0.5">Wind Speed</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedArea.weather.wind_speed} km/h</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Reasons</h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedArea.risk.reasons.map((r, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1">Recommended Action</h4>
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{selectedArea.risk.recommended_action}</p>
        </div>
      </div>
    </div>
  );
};
