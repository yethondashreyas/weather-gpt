import { LanguageCode } from "./i18n";
import { WeatherData } from "./weatherData";
import { RiskResult } from "./riskEngine";
import { templateReply } from "./reasonText";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  source?: "gemini" | "fallback";
  time: string;
}

export async function askWeatherGPT({
  message,
  lang,
  weather,
  risk,
}: {
  message: string;
  lang: LanguageCode;
  weather: WeatherData;
  risk: RiskResult;
}): Promise<{ reply: string; source: "gemini" | "fallback" }> {
  try {
    const res = await fetch("/api/ask-weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, lang, weather, risk }),
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = await res.json();
    if (data.reply && data.source === "gemini") {
      return { reply: data.reply, source: "gemini" };
    }
  } catch (err) {
    console.warn("LLM network or server error, using deterministic fallback:", err);
  }

  // Fallback to template reply
  const fallbackText = templateReply({ message, lang, weather, risk });
  return { reply: fallbackText, source: "fallback" };
}
