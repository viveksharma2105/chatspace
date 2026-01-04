import { useEffect, useRef } from "react";
import type { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  isDarkTheme: boolean;
  currentUserId?: string;
}

// Generate a consistent color for each username
const getUsernameColor = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
    'text-pink-500',
    'text-indigo-500',
    'text-cyan-500',
    'text-orange-500',
    'text-teal-500',
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export function MessageList({ messages, isDarkTheme, currentUserId }: MessageListProps) {
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
      {messages.map((message, index) => {
        const isOwnMessage = message.userId === currentUserId;
        return (
          <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`backdrop-blur-sm px-4 py-3 rounded-2xl shadow-lg max-w-[85%] sm:max-w-md transition-colors duration-300 ${
              isOwnMessage
                ? (isDarkTheme ? 'bg-black/90 border border-gray-900 rounded-tr-sm' : 'bg-purple-600/90 rounded-tr-sm')
                : (isDarkTheme ? 'bg-gray-900/90 border border-gray-800 rounded-tl-sm' : 'bg-white/90 rounded-tl-sm')
            }`}>
              {message.username && (
                <p className={`text-xs font-semibold mb-1 transition-colors duration-300 ${
                  isOwnMessage
                    ? (isDarkTheme ? 'text-purple-300' : 'text-white')
                    : getUsernameColor(message.username)
                }`}>{message.username}</p>
              )}
              <p className={`text-sm sm:text-base overflow-wrap-break-word transition-colors duration-300 ${
                isOwnMessage
                  ? (isDarkTheme ? 'text-gray-100' : 'text-white')
                  : (isDarkTheme ? 'text-gray-100' : 'text-gray-800')
              }`}>{message.text}</p>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                isOwnMessage
                  ? (isDarkTheme ? 'text-purple-400' : 'text-purple-200')
                  : (isDarkTheme ? 'text-gray-600' : 'text-gray-500')
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      })}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
