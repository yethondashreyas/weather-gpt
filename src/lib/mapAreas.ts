import { analyzeRisk, RiskResult } from "./riskEngine";
import { WeatherData } from "./weatherData";

export interface MapArea {
  id: string;
  name: string;
  lat: number;
  lon: number;
  weather: WeatherData;
  risk: RiskResult;
}

export interface ReliefShelter {
  id: string;
  name: string;
  area: string;
  lat: number;
  lon: number;
  capacity: string;
  contact: string;
  status: string;
}

export const RELIEF_SHELTERS: ReliefShelter[] = [
  {
    id: "shelter-1",
    name: "Kotla Vijaya Bhaskara Reddy Indoor Stadium",
    area: "Yousufguda / Begumpet",
    lat: 17.4320,
    lon: 78.4285,
    capacity: "1,200 beds",
    contact: "GHMC Officer: 040-21111111",
    status: "Operational • High Ground",
  },
  {
    id: "shelter-2",
    name: "Quli Qutb Shah Relief Ground",
    area: "Charminar / Old City",
    lat: 17.3690,
    lon: 78.4680,
    capacity: "850 beds",
    contact: "Disaster Cell: 1070",
    status: "Operational • Medical Unit",
  },
  {
    id: "shelter-3",
    name: "Sanjeevaiah Park High Ground Center",
    area: "Secunderabad",
    lat: 17.4310,
    lon: 78.4770,
    capacity: "950 beds",
    contact: "Rescue Cell: 112",
    status: "Operational • Food Ready",
  },
];

export const HYDERABAD_AREAS: Omit<MapArea, "risk" | "weather">[] = [
  { id: "hitec", name: "HITEC City / Gachibowli", lat: 17.4435, lon: 78.3772 },
  { id: "secund", name: "Secunderabad", lat: 17.4399, lon: 78.5016 },
  { id: "banjara", name: "Banjara Hills", lat: 17.4156, lon: 78.4357 },
  { id: "charminar", name: "Charminar Old City", lat: 17.3616, lon: 78.4747 },
  { id: "hussainsagar", name: "Hussain Sagar Lake Basin", lat: 17.4239, lon: 78.4738 },
  { id: "musi", name: "Musi River Catchment / Moosarambagh", lat: 17.3713, lon: 78.5089 },
  { id: "begumpet", name: "Begumpet Airport Lowland", lat: 17.4447, lon: 78.4664 },
  { id: "lbnagar", name: "LB Nagar", lat: 17.3457, lon: 78.5522 },
  { id: "kukatpally", name: "Kukatpally", lat: 17.4948, lon: 78.3996 },
  { id: "uppal", name: "Uppal", lat: 17.3984, lon: 78.5583 },
  { id: "alwal", name: "Alwal / Old Bowenpally", lat: 17.5023, lon: 78.5284 },
  { id: "mehdipatnam", name: "Mehdipatnam / Tolichowki", lat: 17.3916, lon: 78.4116 },
];

export function getMapAreas(scenario = "NORMAL"): MapArea[] {
  return HYDERABAD_AREAS.map((item, idx) => {
    // Vary slightly based on area index
    let rainfall = 0;
    let prob = 15;
    let wind = 12;
    let warning = false;
    let flood = 0.05;
    let landslide = 0.0;
    let cond = "Partly Cloudy";
    let icon = "cloud-sun";

    if (scenario === "HEAVY_RAIN") {
      rainfall = 16 + (idx % 3) * 4;
      prob = 80;
      wind = 35 + (idx % 4) * 5;
      warning = true;
      flood = 0.6 + (idx % 3) * 0.1;
      landslide = idx === 2 ? 0.45 : 0.15; // Banjara Hills terrain
      cond = "Heavy Rain & Waterlogging";
      icon = "cloud-rain";
    } else if (scenario === "SEVERE_RAINFALL") {
      rainfall = 32 + (idx % 3) * 8;
      prob = 98;
      wind = 58 + (idx % 4) * 8;
      warning = true;
      flood = 0.88 + (idx % 2) * 0.1;
      landslide = idx === 2 || idx === 3 ? 0.82 : 0.4;
      cond = "Severe Cyclone / Flash Flood";
      icon = "cloud-lightning";
    }

    const weather: WeatherData = {
      condition: cond,
      icon,
      temperature: 28 - (rainfall > 0 ? 5 : 0),
      feels_like: 29 - (rainfall > 0 ? 6 : 0),
      humidity: 60 + (rainfall > 0 ? 30 : 0),
      rainfall_intensity: rainfall,
      rain_probability: prob,
      wind_speed: wind,
      official_warning: warning,
      flood_indicator: flood,
      landslide_indicator: landslide,
      source: "SIMULATED",
      locationName: item.name,
      forecast: [],
    };

    const risk = analyzeRisk(weather);

    return {
      ...item,
      weather,
      risk,
    };
  });
}

export function getPinHexColor(level: string): string {
  switch (level) {
    case "CRITICAL":
      return "#ef4444"; // red-500
    case "HIGH":
      return "#f97316"; // orange-500
    case "MODERATE":
      return "#f59e0b"; // amber-500
    case "LOW":
    default:
      return "#10b981"; // emerald-500
  }
}
