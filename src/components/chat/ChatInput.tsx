import React, { useState } from "react";
import { useWeatherGPT } from "../../lib/WeatherGPTContext";
import { t, SUGGESTIONS, LanguageCode } from "../../lib/i18n";
import { Send, Mic, MicOff, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, loading }) => {
  const { lang } = useWeatherGPT();
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.en;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const toggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use keyboard input.");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          onSendMessage(transcript);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognition.start();
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Suggested chips */}
      <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {suggestions.map((sug, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(sug)}
            disabled={loading}
            className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>{sug}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl transition-colors ${
            listening
              ? "bg-red-600 text-white animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          title="Voice input"
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            listening
              ? lang === "te"
                ? "వినబడుతోంది..."
                : lang === "hi"
                ? "सुन रहा हूँ..."
                : "Listening..."
              : t(lang, "chatPlaceholder")
          }
          disabled={loading}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 px-2"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
