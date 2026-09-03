import React, { useState, useRef, useEffect } from "react";
import { useWeatherGPT } from "../lib/WeatherGPTContext";
import { askWeatherGPT, ChatMessage } from "../lib/askWeatherGPT";
import { ChatBubble } from "../components/chat/ChatBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { LEVEL_STYLES } from "../lib/riskEngine";
import { t, LEVEL_LABEL, SUGGESTIONS, translateCity } from "../lib/i18n";
import { localizedAction } from "../lib/reasonText";
import { Bot, Sparkles, Trash2, Download, HelpCircle } from "lucide-react";

export const Chat: React.FC = () => {
  const { weather, risk, lang, openLiveVoice, showToast } = useWeatherGPT();

  const localizedLevel = (LEVEL_LABEL[lang] || LEVEL_LABEL.en)[risk.level] || risk.level;
  const localizedCity = translateCity(weather.locationName, lang);

  const getWelcomeMessage = (): string => {
    if (lang === "te") {
      return `నమస్కారం! నేను WeatherGPT, మీ విపత్తు భద్రతా సహాయకుడిని. ${localizedCity}లో ప్రస్తుత ప్రమాద స్థాయి: ${localizedLevel} (${risk.score}/100). వర్షం, వరదలు లేదా భద్రత గురించి నన్ను ఏదైనా అడగండి!`;
    }
    if (lang === "hi") {
      return `नमस्ते! मैं WeatherGPT हूँ, आपका आपदा सुरक्षा सहायक। ${localizedCity} में वर्तमान जोखिम स्तर: ${localizedLevel} (${risk.score}/100) है। मौसम या सुरक्षा से संबंधित कोई भी सवाल पूछें!`;
    }
    return `Hello! I am WeatherGPT, your safety assistant. Current risk in ${localizedCity} is ${localizedLevel} (${risk.score}/100). Ask me any safety or weather question!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "1",
      sender: "assistant",
      text: getWelcomeMessage(),
      source: "fallback",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const style = LEVEL_STYLES[risk.level] || LEVEL_STYLES.LOW;
  const quickPrompts = SUGGESTIONS[lang] || SUGGESTIONS.en;

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
          text: localizedAction(risk.level, lang),
          source: "fallback",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: String(Date.now()),
        sender: "assistant",
        text: getWelcomeMessage(),
        source: "fallback",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    showToast(lang === "te" ? "చాట్ క్లియర్ చేయబడింది" : lang === "hi" ? "चैट साफ़ की गई" : "Chat cleared");
  };

  const handleExportTranscript = () => {
    const lines = messages.map(m => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`).join("\n\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weathergpt-transcript-${weather.locationName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    showToast(lang === "te" ? "ట్రాన్స్ క్రిప్ట్ ఎగుమతి చేయబడింది" : lang === "hi" ? "ट्रांसक्रिप्ट निर्यात किया गया" : "Safety transcript exported");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Top Bar for Chat with Tools */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-2xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>{t(lang, "chatAi")}</span>
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t(lang, "groundedEngine")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={openLiveVoice}
            className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 text-xs font-bold flex items-center space-x-1"
            title="Open Live Voice"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t(lang, "liveVoice")}</span>
          </button>
          <button
            onClick={handleExportTranscript}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={t(lang, "exportTranscript")}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={t(lang, "clearChat")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Risk Status Bar Chip */}
      <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-bold ${style.bg} ${style.border} ${style.text}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
          <span>{t(lang, "currentRisk")}: {localizedLevel} ({risk.score}/100)</span>
        </div>
        <span className="text-[10px] opacity-80 uppercase tracking-wider">{localizedCity}</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <HelpCircle className="w-3 h-3" />
              <span>{t(lang, "suggestedInquiries")}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-blue-300 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

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
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
};
