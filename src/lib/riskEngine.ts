import { WeatherData } from "./weatherData";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskBreakdownItem {
  key: string;
  points: number;
  max: number;
  label: string;
}

export interface RiskResult {
  score: number; // 0..100
  level: RiskLevel;
  reasons: string[];
  recommended_action: string;
  breakdown: RiskBreakdownItem[];
  inputs: {
    rainfall_intensity: number;
    rain_probability: number;
    wind_speed: number;
    official_warning: boolean;
    flood_indicator: number;
    landslide_indicator: number;
  };
}

export const WEIGHTS = {
  rainfall_intensity: 25,
  rain_probability: 15,
  wind_speed: 15,
  official_warning: 25,
  flood_indicator: 10,
  landslide_indicator: 10,
};

function clamp(val: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

export function analyzeRisk(weather: WeatherData, weights: typeof WEIGHTS = WEIGHTS): RiskResult {
  const {
    rainfall_intensity,
    rain_probability,
    wind_speed,
    official_warning,
    flood_indicator,
    landslide_indicator,
  } = weather;

  // Normalized subscores (0..1)
  const rf = clamp(rainfall_intensity / 30);
  const pf = clamp(rain_probability / 100);
  const wf = clamp(wind_speed / 50);
  const ow = official_warning ? 1 : 0;
  const fi = clamp(flood_indicator);
  const li = clamp(landslide_indicator);

  const rawScore =
    rf * weights.rainfall_intensity +
    pf * weights.rain_probability +
    wf * weights.wind_speed +
    ow * weights.official_warning +
    fi * weights.flood_indicator +
    li * weights.landslide_indicator;

  const score = Math.round(clamp(rawScore, 0, 100));

  let level: RiskLevel = "LOW";
  if (score >= 75) level = "CRITICAL";
  else if (score >= 50) level = "HIGH";
  else if (score >= 25) level = "MODERATE";
  else level = "LOW";

  // Reasons determination
  const reasons: string[] = [];
  if (rainfall_intensity >= 20) reasons.push("Heavy rainfall");
  else if (rainfall_intensity >= 7) reasons.push("Moderate rainfall");

  if (rain_probability >= 80) reasons.push("High rain probability");
  else if (rain_probability >= 50) reasons.push("Elevated rain probability");

  if (wind_speed >= 40) reasons.push("Strong wind");
  else if (wind_speed >= 25) reasons.push("Gusty wind");

  if (official_warning) reasons.push("Official warning signal");

  if (flood_indicator >= 0.4) reasons.push("Local flooding indicator");
  if (landslide_indicator >= 0.4) reasons.push("Landslide-prone conditions");

  if (weather.temperature >= 40) reasons.push("Extreme heat");

  if (reasons.length === 0) {
    reasons.push("No significant weather hazard detected");
  }

  // Recommended actions
  let recommended_action = "";
  switch (level) {
    case "LOW":
      recommended_action = "Conditions are calm. Normal travel is fine — keep an eye on updates before long trips.";
      break;
    case "MODERATE":
      recommended_action = "Carry rain protection, allow extra travel time and avoid waterlogged stretches.";
      break;
    case "HIGH":
      recommended_action = "Postpone non-essential travel, stay away from low-lying areas and monitor official warnings.";
      break;
    case "CRITICAL":
      recommended_action = "Avoid unnecessary travel and low-lying areas; follow official warnings.";
      break;
  }

  const breakdown: RiskBreakdownItem[] = [
    { key: "rainfall", label: "Rainfall Intensity", points: Math.round(rf * weights.rainfall_intensity), max: weights.rainfall_intensity },
    { key: "probability", label: "Rain Probability", points: Math.round(pf * weights.rain_probability), max: weights.rain_probability },
    { key: "wind", label: "Wind Speed", points: Math.round(wf * weights.wind_speed), max: weights.wind_speed },
    { key: "warning", label: "Official Warning", points: Math.round(ow * weights.official_warning), max: weights.official_warning },
    { key: "flood", label: "Flood Indicator", points: Math.round(fi * weights.flood_indicator), max: weights.flood_indicator },
    { key: "landslide", label: "Landslide Indicator", points: Math.round(li * weights.landslide_indicator), max: weights.landslide_indicator },
  ];

  return {
    score,
    level,
    reasons,
    recommended_action,
    breakdown,
    inputs: {
      rainfall_intensity,
      rain_probability,
      wind_speed,
      official_warning,
      flood_indicator,
      landslide_indicator,
    },
  };
}

export const LEVEL_STYLES: Record<
  RiskLevel,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    bar: string;
    badgeBg: string;
  }
> = {
  LOW: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  MODERATE: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  },
  HIGH: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    bar: "bg-orange-500",
    badgeBg: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  },
  CRITICAL: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500 animate-pulse",
    bar: "bg-red-600",
    badgeBg: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  },
};
