import React, { useState, useMemo } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Thermometer, Droplets, TrendingUp, Sparkles, Layers } from "lucide-react";

export type TrendViewMode = "combined" | "temp" | "humidity";

export interface HourlyDataPoint {
  hour: string;
  fullTime: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  rainProb: number;
}

export const HourlyTrendsWidget: React.FC = () => {
  const { weather, lang } = useWeatherGPT();
  const [viewMode, setViewMode] = useState<TrendViewMode>("combined");

  // Generate 24-hour dynamic trend data derived mathematically from current weather state
  const hourlyData = useMemo<HourlyDataPoint[]>(() => {
    const currentTemp = weather.temperature;
    const currentHumidity = weather.humidity;
    const isRaining = weather.rainfall_intensity > 0 || weather.rain_probability > 50;

    const data: HourlyDataPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 0; i < 24; i++) {
      const h = (currentHour + i) % 24;
      const hourStr = `${h.toString().padStart(2, "0")}:00`;
      const ampm = h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;

      // Diurnal temperature cycle: peak around 14:00-15:00, trough around 05:00-06:00
      // normalized hour phase: 0 at 14:00 (h=14), pi at 02:00-05:00
      const diurnalPhase = ((h - 14 + 24) % 24) * (2 * Math.PI / 24);
      const diurnalVariation = Math.cos(diurnalPhase) * (isRaining ? 2.5 : 4.5);

      // Random micro-fluctuation with stable seed
      const micro = Math.sin(i * 1.5 + h * 0.7) * 0.8;

      const tempVal = Math.round((currentTemp + diurnalVariation + micro) * 10) / 10;
      const feelsVal = Math.round((tempVal + (weather.feels_like - weather.temperature) + (micro * 0.5)) * 10) / 10;

      // Humidity inversely correlates with temperature, spikes during rain
      const humidityInverse = -Math.cos(diurnalPhase) * (isRaining ? 8 : 16);
      const humVal = Math.min(100, Math.max(20, Math.round(currentHumidity + humidityInverse - micro * 1.2)));

      // Rain probability variation
      const rainBase = weather.rain_probability;
      const rainVar = Math.sin((h - 16) * (2 * Math.PI / 24)) * (isRaining ? 15 : 8);
      const rainVal = Math.min(100, Math.max(0, Math.round(rainBase + rainVar)));

      data.push({
        hour: ampm,
        fullTime: `${hourStr} (${i === 0 ? "Now" : `+${i}h`})`,
        temp: tempVal,
        feelsLike: feelsVal,
        humidity: humVal,
        rainProb: rainVal,
      });
    }

    return data;
  }, [weather]);

  // Derived stats for 24h metrics summary
  const stats = useMemo(() => {
    if (!hourlyData.length) return { maxTemp: 0, minTemp: 0, avgTemp: 0, maxHum: 0, minHum: 0, avgHum: 0 };
    const temps = hourlyData.map((d) => d.temp);
    const hums = hourlyData.map((d) => d.humidity);

    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const avgTemp = Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10;

    const maxHum = Math.max(...hums);
    const minHum = Math.min(...hums);
    const avgHum = Math.round(hums.reduce((a, b) => a + b, 0) / hums.length);

    return { maxTemp, minTemp, avgTemp, maxHum, minHum, avgHum };
  }, [hourlyData]);

  // Custom polished Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: HourlyDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-xs text-white z-50 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="font-semibold text-slate-300">{data.fullTime}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
              Rain {data.rainProb}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Temperature</span>
              </div>
              <span className="font-bold text-amber-300 font-mono text-sm">{data.temp}°C</span>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Feels Like</span>
              <span className="font-mono text-slate-300">{data.feelsLike}°C</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5 text-cyan-400">
                <Droplets className="w-3.5 h-3.5" />
                <span>Humidity</span>
              </div>
              <span className="font-bold text-cyan-300 font-mono text-sm">{data.humidity}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>24-Hour Weather Trends</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Hourly temperature & humidity curve</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setViewMode("combined")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              viewMode === "combined"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3 h-3 text-indigo-500" />
            <span>Dual</span>
          </button>
          <button
            onClick={() => setViewMode("temp")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              viewMode === "temp"
                ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Thermometer className="w-3 h-3 text-amber-500" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => setViewMode("humidity")}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
              viewMode === "humidity"
                ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Droplets className="w-3 h-3 text-cyan-500" />
            <span>Humidity</span>
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Temperature Gradient */}
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              {/* Humidity Gradient */}
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
            />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              interval={3}
              className="text-slate-400 dark:text-slate-500"
            />

            {/* Left Y-Axis for Temperature */}
            {(viewMode === "combined" || viewMode === "temp") && (
              <YAxis
                yAxisId="tempAxis"
                domain={[(dataMin: number) => Math.floor(dataMin - 2), (dataMax: number) => Math.ceil(dataMax + 2)]}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                unit="°"
                className="text-amber-500 dark:text-amber-400"
                orientation="left"
              />
            )}

            {/* Right Y-Axis for Humidity */}
            {(viewMode === "combined" || viewMode === "humidity") && (
              <YAxis
                yAxisId="humidityAxis"
                domain={[20, 100]}
                tick={{ fontSize: 10, fill: "currentColor" }}
                tickLine={false}
                axisLine={false}
                unit="%"
                className="text-cyan-500 dark:text-cyan-400"
                orientation={viewMode === "humidity" ? "left" : "right"}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Render Temperature Series */}
            {(viewMode === "combined" || viewMode === "temp") && (
              <Area
                yAxisId="tempAxis"
                type="monotone"
                dataKey="temp"
                name="Temperature (°C)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
              />
            )}

            {/* Render Humidity Series */}
            {(viewMode === "combined" || viewMode === "humidity") && (
              <Area
                yAxisId="humidityAxis"
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray={viewMode === "combined" ? "4 4" : undefined}
                fillOpacity={1}
                fill="url(#humidityGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend / Guide */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          {(viewMode === "combined" || viewMode === "temp") && (
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Temperature (°C)</span>
            </div>
          )}
          {(viewMode === "combined" || viewMode === "humidity") && (
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
              <span>Humidity (%)</span>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-400">24-hour cycle</span>
      </div>
    </div>
  );
};
