export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const LOCATIONS: Location[] = [
  { id: "hyd", name: "Hyderabad, Telangana", lat: 17.385, lon: 78.4867 },
  { id: "vskp", name: "Visakhapatnam, Andhra Pradesh", lat: 17.6868, lon: 83.2185 },
  { id: "chn", name: "Chennai, Tamil Nadu", lat: 13.0827, lon: 80.2707 },
  { id: "mum", name: "Mumbai, Maharashtra", lat: 19.076, lon: 72.8777 },
  { id: "del", name: "New Delhi", lat: 28.6139, lon: 77.209 },
];

export interface ForecastSlot {
  t: string;
  temp: number;
  rain: number;
  icon: string;
}

export interface WeatherData {
  condition: string;
  icon: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  rainfall_intensity: number; // mm/h
  rain_probability: number; // %
  wind_speed: number; // km/h
  official_warning: boolean;
  flood_indicator: number; // 0..1
  landslide_indicator: number; // 0..1
  forecast: ForecastSlot[];
  source: "SIMULATED" | "SAMPLE_PROVIDER";
  locationName: string;
  scenarioName?: string;
}

export const SCENARIOS: Record<string, WeatherData> = {
  NORMAL: {
    condition: "Partly Cloudy",
    icon: "cloud-sun",
    temperature: 30,
    feels_like: 32,
    humidity: 55,
    rainfall_intensity: 0,
    rain_probability: 10,
    wind_speed: 12,
    official_warning: false,
    flood_indicator: 0.05,
    landslide_indicator: 0.0,
    source: "SIMULATED",
    locationName: "Hyderabad, Telangana",
    scenarioName: "NORMAL",
    forecast: [
      { t: "09:00", temp: 28, rain: 0, icon: "sun" },
      { t: "12:00", temp: 32, rain: 0, icon: "cloud-sun" },
      { t: "15:00", temp: 33, rain: 5, icon: "cloud" },
      { t: "18:00", temp: 30, rain: 10, icon: "cloud-sun" },
      { t: "21:00", temp: 27, rain: 5, icon: "cloud" },
      { t: "00:00", temp: 25, rain: 0, icon: "moon" },
    ],
  },
  HEAVY_RAIN: {
    condition: "Heavy Rain & Squalls",
    icon: "cloud-rain",
    temperature: 24,
    feels_like: 23,
    humidity: 88,
    rainfall_intensity: 18,
    rain_probability: 85,
    wind_speed: 38,
    official_warning: true,
    flood_indicator: 0.65,
    landslide_indicator: 0.3,
    source: "SIMULATED",
    locationName: "Hyderabad, Telangana",
    scenarioName: "HEAVY_RAIN",
    forecast: [
      { t: "09:00", temp: 25, rain: 60, icon: "cloud-rain" },
      { t: "12:00", temp: 24, rain: 85, icon: "cloud-rain" },
      { t: "15:00", temp: 23, rain: 90, icon: "cloud-lightning" },
      { t: "18:00", temp: 23, rain: 75, icon: "cloud-rain" },
      { t: "21:00", temp: 22, rain: 50, icon: "cloud-rain" },
      { t: "00:00", temp: 22, rain: 30, icon: "cloud" },
    ],
  },
  SEVERE_RAINFALL: {
    condition: "Severe Cyclone & Flash Flood Risk",
    icon: "cloud-lightning",
    temperature: 22,
    feels_like: 21,
    humidity: 96,
    rainfall_intensity: 35,
    rain_probability: 98,
    wind_speed: 62,
    official_warning: true,
    flood_indicator: 0.92,
    landslide_indicator: 0.85,
    source: "SIMULATED",
    locationName: "Hyderabad, Telangana",
    scenarioName: "SEVERE_RAINFALL",
    forecast: [
      { t: "09:00", temp: 23, rain: 95, icon: "cloud-lightning" },
      { t: "12:00", temp: 22, rain: 100, icon: "cloud-lightning" },
      { t: "15:00", temp: 21, rain: 100, icon: "cloud-lightning" },
      { t: "18:00", temp: 21, rain: 95, icon: "cloud-rain" },
      { t: "21:00", temp: 20, rain: 85, icon: "cloud-rain" },
      { t: "00:00", temp: 20, rain: 70, icon: "cloud-rain" },
    ],
  },
};

export function getWeather({
  locationId = "hyd",
  demoMode = true,
  scenario = "NORMAL",
}: {
  locationId?: string;
  demoMode?: boolean;
  scenario?: string;
}): WeatherData {
  const loc = LOCATIONS.find((l) => l.id === locationId) || LOCATIONS[0];

  if (demoMode && SCENARIOS[scenario]) {
    return {
      ...SCENARIOS[scenario],
      locationName: loc.name,
    };
  }

  // Live / Sample provider deterministic calm weather derived from location name length
  const baseTemp = 26 + (loc.name.length % 6);
  return {
    condition: "Clear & Stable",
    icon: "sun",
    temperature: baseTemp,
    feels_like: baseTemp + 1,
    humidity: 50 + (loc.name.length * 2) % 25,
    rainfall_intensity: 0,
    rain_probability: 5,
    wind_speed: 8 + (loc.name.length % 10),
    official_warning: false,
    flood_indicator: 0.0,
    landslide_indicator: 0.0,
    source: "SAMPLE_PROVIDER",
    locationName: loc.name,
    forecast: [
      { t: "09:00", temp: baseTemp - 2, rain: 0, icon: "sun" },
      { t: "12:00", temp: baseTemp + 3, rain: 0, icon: "sun" },
      { t: "15:00", temp: baseTemp + 4, rain: 5, icon: "cloud-sun" },
      { t: "18:00", temp: baseTemp + 1, rain: 5, icon: "cloud-sun" },
      { t: "21:00", temp: baseTemp - 2, rain: 0, icon: "moon" },
      { t: "00:00", temp: baseTemp - 4, rain: 0, icon: "moon" },
    ],
  };
}

export interface ClimateRow {
  year: number;
  rainfall: number; // mm
  heavyDays: number;
}

export const CLIMATE_SERIES: ClimateRow[] = [
  { year: 2015, rainfall: 820, heavyDays: 12 },
  { year: 2016, rainfall: 890, heavyDays: 14 },
  { year: 2017, rainfall: 860, heavyDays: 13 },
  { year: 2018, rainfall: 940, heavyDays: 17 },
  { year: 2019, rainfall: 1020, heavyDays: 21 },
  { year: 2020, rainfall: 1150, heavyDays: 26 },
  { year: 2021, rainfall: 1080, heavyDays: 24 },
  { year: 2022, rainfall: 1190, heavyDays: 29 },
  { year: 2023, rainfall: 1240, heavyDays: 32 },
  { year: 2024, rainfall: 1310, heavyDays: 38 },
];

export const CLIMATE_INSIGHT =
  "Over the past decade (2015–2024), annual cumulative rainfall across urban clusters has risen by ~38%, accompanied by a sharp 216% increase in localized heavy-rain event frequency. Urban drainage stress and flash flood risks have escalated correspondingly.";

export const SEASONAL_NOTE = [
  { season: "Monsoon (Jun-Sep)", note: "Peak risk window for flash flooding, waterlogging, and transport disruptions." },
  { season: "Post-Monsoon (Oct-Nov)", note: "Cyclonic disturbances along coastal corridors impacting inland precipitation." },
  { season: "Summer & Pre-Monsoon (Mar-May)", note: "Sudden convective squalls, severe thunderstorms, and urban heat island spikes." },
];
