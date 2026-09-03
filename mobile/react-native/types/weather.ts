export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface WeatherData {
  city: string;
  state: string;
  temperature: number;
  feels_like: number;
  condition: string;
  humidity: number;
  rainfall_intensity: number; // mm/h
  rain_probability: number;   // %
  wind_speed: number;         // km/h
  official_warning: boolean;
  flood_indicator: number;     // 0..1
  landslide_indicator: number; // 0..1
}

export interface RiskBreakdownItem {
  key: string;
  label: string;
  points: number;
  max: number;
}

export interface RiskResult {
  score: number; // 0..100
  level: RiskLevel;
  reasons: string[];
  recommended_action: string;
  breakdown: RiskBreakdownItem[];
}
