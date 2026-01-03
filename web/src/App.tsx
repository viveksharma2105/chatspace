import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Message {
  text: string;
  username?: string;
  timestamp: string;
}

function App() {
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState(generateRoomId());
  const [username, setUsername] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [useCustomRoom, setUseCustomRoom] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const createRoom = () => {
    if (roomId.trim() && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "create",
          payload: {
            roomId: roomId.trim(),
          },
        })
      );
    }
  };

  const handleGenerateNewRoom = () => {
    setRoomId(generateRoomId());
    setRoomCreated(false);
  };

  const joinRoom = () => {
    if (roomId.trim() && username.trim() && wsRef.current) {
      const room = roomId.trim();
      wsRef.current.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: room,
          },
        })
      );
      // Store the room we're trying to join
      sessionStorage.setItem('attemptedRoom', room);
    }
  };

  const sendMessage = () => {
    if (!inputRef.current || !wsRef.current) return;
    const message = inputRef.current.value;
    if (message.trim()) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
            username: username
          },
        })
      );
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "success") {
          setMessages((m) => [...m, { text: data.message, timestamp: new Date().toISOString() }]);
          if (data.message.includes("Joined room")) {
            const attemptedRoom = sessionStorage.getItem('attemptedRoom');
            if (attemptedRoom) {
              setCurrentRoom(attemptedRoom);
              setIsConnected(true);
              console.log("Received memberCount:", data.memberCount);
              if (data.memberCount) {
                setMemberCount(data.memberCount);
              }
              sessionStorage.removeItem('attemptedRoom');
            }
          } else if (data.message.includes("created successfully")) {
            setRoomCreated(true);
            setMessages((m) => [...m, { text: "Room created! Now you can join it.", timestamp: new Date().toISOString() }]);
          }
        } else if (data.type === "error") {
          setMessages((m) => [...m, { text: `Error: ${data.message}`, timestamp: new Date().toISOString() }]);
          if (data.message.includes("already exists")) {
            alert("Room already exists! Please join instead.");
          }
        } else if (data.type === "chat") {
          setMessages((m) => [...m, { text: data.message, username: data.username, timestamp: new Date().toISOString() }]);
        } else if (data.type === "memberCount") {
          console.log("Received memberCount update:", data.count);
          setMemberCount(data.count);
        } else {
          setMessages((m) => [...m, { text: event.data, timestamp: new Date().toISOString() }]);
        }
      } catch {
        setMessages((m) => [...m, { text: event.data, timestamp: new Date().toISOString() }]);
      }
    };
    wsRef.current = ws;

    ws.onopen = () => {
      setMessages((m) => [...m, { text: "Connected to server", timestamp: new Date().toISOString() }]);
    };

    return () => {
      ws.close();
    };
  }, []);
  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-black via-gray-950 to-black'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-md border-b px-4 sm:px-6 py-5 shadow-lg transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-black/40 border-gray-800'
          : 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 sm:p-3 rounded-xl shadow-lg transition-colors duration-300 ${
              isDarkTheme
                ? 'bg-gradient-to-br from-gray-700 to-gray-900'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              <div className="text-2xl sm:text-3xl">💬</div>
            </div>
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                ChatSpace
              </h1>
              <p className={`text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors duration-300 ${
                isDarkTheme ? 'text-gray-400' : 'text-purple-200'
              }`}>
                <span className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-gray-400'} rounded-full animate-pulse`}></span>
                {currentRoom ? `Room: ${currentRoom}` : "Not in a room"}
                {isConnected && memberCount > 0 && (
                  <span className="flex items-center gap-1 ml-2">
                    <span>•</span>
                    <span className="font-semibold">{memberCount}</span>
                    <span>👥</span>
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkTheme
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={isDarkTheme ? 'Switch to purple theme' : 'Switch to dark theme'}
            >
              <span className="text-2xl">{isDarkTheme ? '🌙' : '☀️'}</span>
            </button>
            <div className={`hidden sm:flex items-center gap-2 text-sm transition-colors duration-300 ${
              isDarkTheme ? 'text-gray-400' : 'text-purple-200'
            }`}>
              <span className={`w-2 h-2 ${isConnected ? 'bg-green-400' : 'bg-gray-400'} rounded-full`}></span>
              <span>{isConnected ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`backdrop-blur-lg border rounded-2xl shadow-2xl p-8 w-full max-w-md transition-colors duration-300 ${
            isDarkTheme
              ? 'bg-black/60 border-gray-800'
              : 'bg-white/10 border-white/20'
          }`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Join ChatSpace</h2>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkTheme ? 'text-gray-400' : 'text-purple-200'
              }`}>Enter your details to get started</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                  isDarkTheme ? 'text-gray-400' : 'text-purple-200'
                }`}>Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-sm font-medium transition-colors duration-300 ${
                    isDarkTheme ? 'text-gray-400' : 'text-purple-200'
                  }`}>Room ID</label>
                  <button
                    onClick={() => setUseCustomRoom(!useCustomRoom)}
                    className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
                      isDarkTheme
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-white/20 hover:bg-white/30 text-purple-200'
                    }`}
                  >
                    {useCustomRoom ? '🔀 Auto ID' : '✏️ Custom'}
                  </button>
                </div>
                {useCustomRoom ? (
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter custom room name..."
                    className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        joinRoom();
                      }
                    }}
                  />
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomId}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 font-mono font-bold text-center focus:outline-none text-sm sm:text-base"
                    />
                    <button
                      onClick={handleGenerateNewRoom}
                      className={`px-4 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                        isDarkTheme
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                      title="Generate new room ID"
                    >
                      🔄
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                {!roomCreated && (
                  <button
                    onClick={createRoom}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Create Room
                  </button>
                )}
                <button
                  onClick={joinRoom}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Chat messages area - scrollable */}
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
          </div>
          
          {/* Input area - fixed at bottom */}
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
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
