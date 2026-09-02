import React, { useState, useRef, useEffect } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { askWeatherGPT, ChatMessage } from "../lib/askWeatherGPT";
import { ChatBubble } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { LanguageSelector } from "../components/LanguageSelector";
import { LEVEL_STYLES } from "../lib/riskEngine";
import { t, LEVEL_LABEL } from "../lib/i18n";
import { Bot, ShieldCheck, AlertTriangle } from "lucide-react";

export const Chat: React.FC = () => {
  const { weather, risk, lang } = useWeatherGPT();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "1",
      sender: "assistant",
      text: `Hello! I am WeatherGPT, your safety assistant. Current risk in ${weather.locationName} is ${risk.level} (${risk.score}/100). Ask me any safety or weather question!`,
      source: "fallback",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const style = LEVEL_STYLES[risk.level] || LEVEL_STYLES.LOW;
  const levelLabels = LEVEL_LABEL[lang] || LEVEL_LABEL.en;
  const localizedLevel = levelLabels[risk.level] || risk.level;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await askWeatherGPT({
        message: text,
        lang,
        weather,
        risk,
      });

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: "assistant",
        text: result.reply,
        source: result.source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "assistant",
          text: "I am currently unable to reach the AI model, but our deterministic rules engine keeps you safe. " + risk.recommended_action,
          source: "fallback",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950">
      {/* Top Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">WeatherGPT</h2>
            <p className="text-[10px] text-slate-500">Grounded by Rules Engine</p>
          </div>
        </div>
        <LanguageSelector />
      </div>

      {/* Risk Status Bar Chip */}
      <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-bold ${style.bg} ${style.border} ${style.text}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
          <span>Risk Level: {localizedLevel} ({risk.score}/100)</span>
        </div>
        <span className="text-[10px] opacity-80 uppercase tracking-wider">{weather.locationName}</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs p-3 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-xs">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
            <span>{t(lang, "thinking")}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 sticky bottom-16 z-20">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
};
