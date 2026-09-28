import React from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";

export const AtmosphericOverlay: React.FC = () => {
  const { risk, weather } = useWeatherGPT();
  const isCritical = risk.level === "CRITICAL" || risk.score >= 75 || weather.rainfall_intensity > 20;

  if (!isCritical) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 rounded-inherit">
      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-red-950/20 mix-blend-overlay animate-pulse duration-3000" />

      {/* Gentle rain streaks */}
      <div className="absolute inset-0 opacity-25">
        <div className="rain-streaks" />
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) translateX(0);
          }
          100% {
            transform: translateY(800px) translateX(-50px);
          }
        }
        .rain-streaks {
          background-image: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(56, 189, 248, 0.6) 50%, rgba(255,255,255,0) 100%);
          width: 1px;
          height: 60px;
          position: absolute;
          animation: fall 0.8s linear infinite;
          box-shadow: 100px 200px 0 rgba(56, 189, 248, 0.4),
                      250px 50px 0 rgba(56, 189, 248, 0.3),
                      350px 300px 0 rgba(56, 189, 248, 0.5),
                      50px 450px 0 rgba(56, 189, 248, 0.3),
                      200px 600px 0 rgba(56, 189, 248, 0.4);
        }
      `}</style>
    </div>
  );
};
