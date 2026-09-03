import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { LanguageCode } from "./i18n";
import { getWeather, WeatherData } from "./weatherData";
import { analyzeRisk, RiskResult, WEIGHTS } from "./riskEngine";

export type ThemeMode = "light" | "dark" | "accessible";
export type TempUnit = "C" | "F";

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
  // Enhanced Hackathon Interactive State
  tempUnit: TempUnit;
  toggleTempUnit: () => void;
  formatTemp: (celsius: number) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  sosOpen: boolean;
  openSos: () => void;
  closeSos: () => void;
  bulletinOpen: boolean;
  openBulletin: () => void;
  closeBulletin: () => void;
  speaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  customWeights: typeof WEIGHTS;
  setCustomWeights: (w: typeof WEIGHTS) => void;
  resetWeights: () => void;
  triggerTestAlert: () => void;
  refreshRadar: () => void;
  lastRefreshed: string;
}

const WeatherGPTContext = createContext<WeatherGPTContextType | undefined>(undefined);

export function WeatherGPTProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    return (localStorage.getItem("wgpt_lang") as LanguageCode) || "en";
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem("wgpt_theme") as ThemeMode) || "light";
  });

  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem("wgpt_unit") as TempUnit) || "C";
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

  const [customWeights, setCustomWeightsState] = useState<typeof WEIGHTS>(() => {
    const saved = localStorage.getItem("wgpt_weights");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return WEIGHTS;
      }
    }
    return WEIGHTS;
  });

  const [sirenOpen, setSirenOpen] = useState<boolean>(false);
  const [sirenAcked, setSirenAcked] = useState<boolean>(false);
  const [liveVoiceOpen, setLiveVoiceOpen] = useState<boolean>(false);
  const [sosOpen, setSosOpen] = useState<boolean>(false);
  const [bulletinOpen, setBulletinOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("Just now");

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const toggleTempUnit = () => {
    setTempUnit((prev) => {
      const next = prev === "C" ? "F" : "C";
      localStorage.setItem("wgpt_unit", next);
      showToast(`Units switched to °${next}`);
      return next;
    });
  };

  const formatTemp = (celsius: number) => {
    if (tempUnit === "F") {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const setCustomWeights = (w: typeof WEIGHTS) => {
    setCustomWeightsState(w);
    localStorage.setItem("wgpt_weights", JSON.stringify(w));
    showToast("Deterministic risk weights recalculated!");
  };

  const resetWeights = () => {
    setCustomWeightsState(WEIGHTS);
    localStorage.removeItem("wgpt_weights");
    showToast("Weights restored to default");
  };

  const refreshRadar = () => {
    setLastRefreshed("Just now");
    showToast("Synced with IMD Doppler Radar telemetry feed");
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      showToast("Speech synthesis not supported in this browser");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    showToast("Playing voice audio...");
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem("wgpt_lang", newLang);
    showToast(`Language set to ${newLang === "te" ? "తెలుగు" : newLang === "hi" ? "हिन्दी" : "English"}`);
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
    showToast(b ? "Demo Mode Active (Simulated)" : "Live Provider Mode Active");
  };

  const setAutoSpeakCritical = (b: boolean) => {
    setAutoSpeakCriticalState(b);
    localStorage.setItem("wgpt_auto_speak", String(b));
    showToast(b ? "Auto-speech for critical alerts enabled" : "Auto-speech muted");
  };

  const setSirenAudioEnabled = (b: boolean) => {
    setSirenAudioEnabledState(b);
    localStorage.setItem("wgpt_siren_audio", String(b));
    showToast(b ? "Emergency audio alarm enabled" : "Emergency audio alarm muted");
  };

  const setScenario = (sc: string) => {
    setScenarioState(sc);
    localStorage.setItem("wgpt_scenario", sc);
    setSirenAcked(false); // reset ack on scenario change
    showToast(`Switched scenario to ${sc.replace("_", " ")}`);
  };

  const resetScenario = () => {
    setScenario("NORMAL");
  };

  const weather = useMemo(() => {
    return getWeather({ locationId, demoMode, scenario });
  }, [locationId, demoMode, scenario]);

  const risk = useMemo(() => {
    return analyzeRisk(weather, customWeights);
  }, [weather, customWeights]);

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
        const speechText = `CRITICAL ALERT! Severe weather detected in ${weather.locationName}. Risk score ${risk.score} out of 100. ${risk.recommended_action}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
        window.speechSynthesis.speak(utterance);
      }
    } else if (currentLevel !== "CRITICAL") {
      setSirenOpen(false);
      setSirenAcked(false);
    }

    lastLevelRef.current = currentLevel;
  }, [risk.level, risk.score, weather.locationName, scenario, sirenAcked, autoSpeakCritical, lang, risk.recommended_action]);

  const openSiren = () => setSirenOpen(true);
  const ackSiren = () => {
    setSirenOpen(false);
    setSirenAcked(true);
  };

  const openLiveVoice = () => setLiveVoiceOpen(true);
  const closeLiveVoice = () => setLiveVoiceOpen(false);

  const openSos = () => setSosOpen(true);
  const closeSos = () => setSosOpen(false);

  const openBulletin = () => setBulletinOpen(true);
  const closeBulletin = () => setBulletinOpen(false);

  const triggerTestAlert = () => {
    const testNotif: NotificationItem = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: `${weather.locationName} (Simulated Test)`,
      score: 92,
      scenario: "CYCLONE_TEST_ALERT",
      read: false,
    };
    setNotifications((prev) => {
      const updated = [testNotif, ...prev].slice(0, 50);
      localStorage.setItem("wgpt_notifs", JSON.stringify(updated));
      return updated;
    });
    setSirenOpen(true);
    showToast("🚨 Critical Disaster Alert triggered for testing!");
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("wgpt_notifs", JSON.stringify(updated));
      return updated;
    });
    showToast("All notifications marked as read");
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("wgpt_notifs");
    showToast("Notification log cleared");
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
    tempUnit,
    toggleTempUnit,
    formatTemp,
    toastMessage,
    showToast,
    sosOpen,
    openSos,
    closeSos,
    bulletinOpen,
    openBulletin,
    closeBulletin,
    speaking,
    speak,
    stopSpeaking,
    customWeights,
    setCustomWeights,
    resetWeights,
    triggerTestAlert,
    refreshRadar,
    lastRefreshed,
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

