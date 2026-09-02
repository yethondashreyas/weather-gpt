import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { LanguageCode } from "./i18n";
import { getWeather, WeatherData } from "./weatherData";
import { analyzeRisk, RiskResult } from "./riskEngine";

export type ThemeMode = "light" | "dark" | "accessible";

export interface NotificationItem {
  id: number;
  time: string;
  location: string;
  score: number;
  scenario: string;
  read: boolean;
}

interface WeatherGPTContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  locationId: string;
  setLocationId: (id: string) => void;
  demoMode: boolean;
  setDemoMode: (b: boolean) => void;
  autoSpeakCritical: boolean;
  setAutoSpeakCritical: (b: boolean) => void;
  sirenAudioEnabled: boolean;
  setSirenAudioEnabled: (b: boolean) => void;
  scenario: string;
  setScenario: (sc: string) => void;
  resetScenario: () => void;
  weather: WeatherData;
  risk: RiskResult;
  sirenOpen: boolean;
  openSiren: () => void;
  ackSiren: () => void;
  liveVoiceOpen: boolean;
  openLiveVoice: () => void;
  closeLiveVoice: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
}

const WeatherGPTContext = createContext<WeatherGPTContextType | undefined>(undefined);

export function WeatherGPTProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    return (localStorage.getItem("wgpt_lang") as LanguageCode) || "en";
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("wgpt_theme") as ThemeMode) || "light";
  });

  const [locationId, setLocationIdState] = useState<string>(() => {
    return localStorage.getItem("wgpt_loc") || "hyd";
  });

  const [demoMode, setDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem("wgpt_demo");
    return saved !== null ? saved === "true" : true;
  });

  const [autoSpeakCritical, setAutoSpeakCriticalState] = useState<boolean>(() => {
    const saved = localStorage.getItem("wgpt_auto_speak");
    return saved !== null ? saved === "true" : true;
  });

  const [sirenAudioEnabled, setSirenAudioEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem("wgpt_siren_audio");
    return saved !== null ? saved === "true" : true;
  });

  const [scenario, setScenarioState] = useState<string>(() => {
    return localStorage.getItem("wgpt_scenario") || "NORMAL";
  });

  const [sirenOpen, setSirenOpen] = useState<boolean>(false);
  const [sirenAcked, setSirenAcked] = useState<boolean>(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("wgpt_notifs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem("wgpt_lang", newLang);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("wgpt_theme", newTheme);
  };

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "accessible");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "accessible") {
      root.classList.add("dark", "accessible");
    }
  }, [theme]);

  const setLocationId = (id: string) => {
    setLocationIdState(id);
    localStorage.setItem("wgpt_loc", id);
  };

  const setDemoMode = (b: boolean) => {
    setDemoModeState(b);
    localStorage.setItem("wgpt_demo", String(b));
  };

  const setAutoSpeakCritical = (b: boolean) => {
    setAutoSpeakCriticalState(b);
    localStorage.setItem("wgpt_auto_speak", String(b));
  };

  const setSirenAudioEnabled = (b: boolean) => {
    setSirenAudioEnabledState(b);
    localStorage.setItem("wgpt_siren_audio", String(b));
  };

  const setScenario = (sc: string) => {
    setScenarioState(sc);
    localStorage.setItem("wgpt_scenario", sc);
    setSirenAcked(false); // reset ack on scenario change
  };

  const resetScenario = () => {
    setScenario("NORMAL");
  };

  const weather = useMemo(() => {
    return getWeather({ locationId, demoMode, scenario });
  }, [locationId, demoMode, scenario]);

  const risk = useMemo(() => {
    return analyzeRisk(weather);
  }, [weather]);

  const lastLevelRef = useRef(risk.level);

  // Auto behaviors on CRITICAL risk transition
  useEffect(() => {
    const prevLevel = lastLevelRef.current;
    const currentLevel = risk.level;

    if (currentLevel === "CRITICAL" && prevLevel !== "CRITICAL" && !sirenAcked) {
      setSirenOpen(true);
      // Prepend notification log
      const newNotif: NotificationItem = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: weather.locationName,
        score: risk.score,
        scenario: scenario,
        read: false,
      };
      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, 50);
        localStorage.setItem("wgpt_notifs", JSON.stringify(updated));
        return updated;
      });

      if (autoSpeakCritical && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const speechText = `CRITICAL ALERT! Severe weather detected in ${weather.locationName}. Risk score ${risk.score} out of 100. ${risk.conclusion}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } else if (currentLevel !== "CRITICAL") {
      setSirenOpen(false);
      setSirenAcked(false);
    }

    lastLevelRef.current = currentLevel;
  }, [risk.level, risk.score, weather.locationName, scenario, sirenAcked, autoSpeakCritical, lang, risk.conclusion]);

  const openSiren = () => setSirenOpen(true);
  const ackSiren = () => {
    setSirenOpen(false);
    setSirenAcked(true);
  };

  const openLiveVoice = () => setLiveVoiceOpen(true);
  const closeLiveVoice = () => setLiveVoiceOpen(false);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("wgpt_notifs", JSON.stringify(updated));
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("wgpt_notifs");
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const value = {
    lang,
    setLang,
    theme,
    setTheme,
    locationId,
    setLocationId,
    demoMode,
    setDemoMode,
    autoSpeakCritical,
    setAutoSpeakCritical,
    sirenAudioEnabled,
    setSirenAudioEnabled,
    scenario,
    setScenario,
    resetScenario,
    weather,
    risk,
    sirenOpen,
    openSiren,
    ackSiren,
    liveVoiceOpen,
    openLiveVoice,
    closeLiveVoice,
    notifications,
    unreadCount,
    markAllNotificationsRead,
    clearNotifications,
  };

  return <WeatherGPTContext.Provider value={value}>{children}</WeatherGPTContext.Provider>;
}

export function useWeatherGPT() {
  const context = useContext(WeatherGPTContext);
  if (!context) {
    throw new Error("useWeatherGPT must be used within a WeatherGPTProvider");
  }
  return context;
}
