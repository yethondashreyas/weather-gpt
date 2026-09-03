import { WeatherData, RiskResult, RiskLevel, RiskBreakdownItem } from '../types/weather';

const WEIGHTS = {
  rainfall_intensity: 25,
  rain_probability: 15,
  wind_speed: 15,
  official_warning: 25,
  flood_indicator: 10,
  landslide_indicator: 10,
} as const;

const clamp = (val: number, min = 0, max = 1): number => 
  Math.max(min, Math.min(max, val));

/**
 * Deterministic, ultra-fast O(1) risk calculation engine.
 * Optimized for React Native (Hermes JIT/AOT bytecode).
 */
export function analyzeRisk(weather: WeatherData): RiskResult {
  const {
    rainfall_intensity,
    rain_probability,
    wind_speed,
    official_warning,
    flood_indicator,
    landslide_indicator,
  } = weather;

  const rf = clamp(rainfall_intensity / 30);
  const pf = clamp(rain_probability / 100);
  const wf = clamp(wind_speed / 50);
  const ow = official_warning ? 1 : 0;
  const fi = clamp(flood_indicator);
  const li = clamp(landslide_indicator);

  const rawScore =
    rf * WEIGHTS.rainfall_intensity +
    pf * WEIGHTS.rain_probability +
    wf * WEIGHTS.wind_speed +
    ow * WEIGHTS.official_warning +
    fi * WEIGHTS.flood_indicator +
    li * WEIGHTS.landslide_indicator;

  const score = Math.round(clamp(rawScore, 0, 100));

  let level: RiskLevel = 'LOW';
  if (score >= 75) level = 'CRITICAL';
  else if (score >= 50) level = 'HIGH';
  else if (score >= 25) level = 'MODERATE';

  const reasons: string[] = [];
  if (rainfall_intensity >= 20) reasons.push('Heavy rainfall');
  else if (rainfall_intensity >= 7) reasons.push('Moderate rainfall');
  if (rain_probability >= 80) reasons.push('High rain probability');
  else if (rain_probability >= 50) reasons.push('Elevated rain probability');
  if (wind_speed >= 40) reasons.push('Strong wind');
  else if (wind_speed >= 25) reasons.push('Gusty wind');
  if (official_warning) reasons.push('Official warning signal');
  if (flood_indicator >= 0.4) reasons.push('Local flooding indicator');
  if (landslide_indicator >= 0.4) reasons.push('Landslide-prone conditions');
  if (weather.temperature >= 40) reasons.push('Extreme heat');
  if (reasons.length === 0) reasons.push('No significant weather hazard detected');

  let recommended_action = 'Conditions are calm. Normal travel is safe.';
  if (level === 'MODERATE') {
    recommended_action = 'Carry rain gear, allow extra travel time and avoid waterlogged areas.';
  } else if (level === 'HIGH') {
    recommended_action = 'Postpone non-essential travel and stay away from low-lying areas.';
  } else if (level === 'CRITICAL') {
    recommended_action = 'EMERGENCY: Avoid unnecessary travel; shelter in place and heed sirens.';
  }

  const breakdown: RiskBreakdownItem[] = [
    { key: 'rainfall', label: 'Rainfall Intensity', points: Math.round(rf * WEIGHTS.rainfall_intensity), max: WEIGHTS.rainfall_intensity },
    { key: 'probability', label: 'Rain Probability', points: Math.round(pf * WEIGHTS.rain_probability), max: WEIGHTS.rain_probability },
    { key: 'wind', label: 'Wind Speed', points: Math.round(wf * WEIGHTS.wind_speed), max: WEIGHTS.wind_speed },
    { key: 'warning', label: 'Official Warning', points: Math.round(ow * WEIGHTS.official_warning), max: WEIGHTS.official_warning },
    { key: 'flood', label: 'Flood Indicator', points: Math.round(fi * WEIGHTS.flood_indicator), max: WEIGHTS.flood_indicator },
    { key: 'landslide', label: 'Landslide Indicator', points: Math.round(li * WEIGHTS.landslide_indicator), max: WEIGHTS.landslide_indicator },
  ];

  return { score, level, reasons, recommended_action, breakdown };
}
