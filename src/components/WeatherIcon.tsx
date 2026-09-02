import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Moon,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = "w-6 h-6", size }) => {
  switch (name?.toLowerCase()) {
    case "sun":
      return <Sun className={className} size={size} />;
    case "cloud-sun":
      return <CloudSun className={className} size={size} />;
    case "cloud":
      return <Cloud className={className} size={size} />;
    case "cloud-rain":
      return <CloudRain className={className} size={size} />;
    case "cloud-lightning":
      return <CloudLightning className={className} size={size} />;
    case "moon":
      return <Moon className={className} size={size} />;
    case "wind":
      return <Wind className={className} size={size} />;
    case "droplets":
      return <Droplets className={className} size={size} />;
    case "alert-triangle":
      return <AlertTriangle className={className} size={size} />;
    case "shield-alert":
      return <ShieldAlert className={className} size={size} />;
    case "shield-check":
      return <ShieldCheck className={className} size={size} />;
    case "check-circle":
      return <CheckCircle2 className={className} size={size} />;
    default:
      return <CloudSun className={className} size={size} />;
  }
};
