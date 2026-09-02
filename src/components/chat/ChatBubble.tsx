import React from "react";
import { ChatMessage } from "../../lib/askWeatherGPT";
import { Bot, User, ShieldAlert } from "lucide-react";

export const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-start space-x-3 my-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
          isUser ? "bg-blue-600" : "bg-slate-800 dark:bg-slate-700"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-400" />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-xs"
            : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] opacity-75">
          <span>{message.time}</span>
          {!isUser && message.source && (
            <span
              className={`px-1.5 py-0.5 rounded font-mono ${
                message.source === "fallback"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              {message.source === "fallback" ? "Engine Template" : "Gemini Grounded"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
