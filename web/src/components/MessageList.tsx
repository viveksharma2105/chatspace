import { useEffect, useRef } from "react";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isDarkTheme: boolean;
}

export function MessageList({ messages, isDarkTheme }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="flex">
          <div className={`backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm shadow-lg max-w-[85%] sm:max-w-md transition-colors duration-300 ${
            isDarkTheme
              ? 'bg-gray-900/90 border border-gray-800'
              : 'bg-white/90'
          }`}>
            {message.username && (
              <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                isDarkTheme ? 'text-gray-400' : 'text-purple-600'
              }`}>{message.username}</p>
            )}
            <p className={`text-sm sm:text-base break-words transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-100' : 'text-gray-800'
            }`}>{message.text}</p>
            <p className={`text-xs mt-1 transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-600' : 'text-gray-500'
            }`}>
              {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
