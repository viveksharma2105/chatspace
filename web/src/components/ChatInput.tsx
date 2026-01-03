import { useRef } from "react";

interface ChatInputProps {
  isDarkTheme: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatInput({ isDarkTheme, onSendMessage }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = () => {
    if (!inputRef.current) return;
    const message = inputRef.current.value;
    if (message.trim()) {
      onSendMessage(message);
      inputRef.current.value = "";
      // Keep focus on input to prevent keyboard from closing on mobile
      inputRef.current.focus();
    }
  };

  // Handle send button click - prevent default to keep keyboard open
  const handleSendClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sendMessage();
    // Refocus input after a small delay to ensure keyboard stays open
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className={`backdrop-blur-md border-t p-4 sm:p-6 transition-colors duration-300 ${
      isDarkTheme
        ? 'bg-black/40 border-gray-800'
        : 'bg-white/10 border-white/10'
    }`}>
      <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
        <input 
          ref={inputRef} 
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg text-sm sm:text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onMouseDown={handleSendClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            sendMessage();
            inputRef.current?.focus();
          }}
          className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
}
