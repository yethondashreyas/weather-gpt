import React, { useState, useEffect, useRef } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { LEVEL_LABEL } from "../../lib/i18n";
import { Mic, MicOff, Volume2, Radio } from "lucide-react";

export const VoiceTrigger: React.FC = () => {
  const { lang, risk, weather } = useWeatherGPT();
  const [enabled, setEnabled] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Idle");
  const recognitionRef = useRef<any>(null);
  const lastSpokenRef = useRef(0);

  const levelLabels = LEVEL_LABEL[lang] || LEVEL_LABEL.en;
  const localizedLevel = levelLabels[risk.level] || risk.level;

  const speakRisk = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const reasonsText = risk.reasons.join(". ");
    const speechText = `Is it safe? Current risk is ${localizedLevel}, score ${risk.score} out of 100. ${reasonsText}. ${risk.recommended_action}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    setStatus("Spoke safety response!");
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Voice recognition not supported");
      return;
    }

    if (!enabled) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setStatus("Hands-free OFF");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";

    recognition.onstart = () => {
      setStatus("Listening for wake phrases...");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript.toLowerCase();
      setTranscript(text);

      const wakePhrases = ["is it safe", "am i safe", "are we safe", "safe or not", "weather gpt"];
      const matched = wakePhrases.some((phrase) => text.includes(phrase));

      if (matched) {
        const now = Date.now();
        if (now - lastSpokenRef.current > 4000) {
          lastSpokenRef.current = now;
          speakRisk();
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        setEnabled(false);
        setStatus("Microphone permission denied");
      }
    };

    recognition.onend = () => {
      if (enabled && recognitionRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    try {
      recognition.start();
    } catch {
      setEnabled(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [enabled, lang, risk]);

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-5 shadow-lg border border-blue-700/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${enabled ? "bg-red-500 animate-pulse" : "bg-white/10"}`}>
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Hands-Free Voice Trigger</h4>
            <p className="text-xs text-blue-200">Say "Is it safe?" anytime</p>
          </div>
        </div>

        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            enabled
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-white text-blue-900 hover:bg-blue-50"
          }`}
        >
          {enabled ? "Active (ON)" : "Enable Voice"}
        </button>
      </div>

      <div className="bg-white/10 rounded-2xl p-3 text-xs flex items-center justify-between backdrop-blur-xs">
        <span className="text-blue-200 truncate max-w-[240px]">
          {transcript ? `Heard: "${transcript}"` : status}
        </span>
        <button
          onClick={speakRisk}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Test Voice</span>
        </button>
      </div>
    </div>
  );
};
