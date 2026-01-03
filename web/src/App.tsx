import { useState } from "react";
import "./App.css";
import { Header, JoinRoom, MessageList, ChatInput } from "./components";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [roomId, setRoomId] = useState(generateRoomId());
  const [username, setUsername] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [useCustomRoom, setUseCustomRoom] = useState(false);

  const {
    messages,
    isConnected,
    currentRoom,
    roomCreated,
    memberCount,
    wsRef,
    setRoomCreated,
  } = useWebSocket();

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

  const handleSendMessage = (message: string) => {
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: message,
            username: username
          },
        })
      );
    }
  };

  return (
    <div className={`h-dvh flex flex-col transition-colors duration-300 ${
      isDarkTheme 
        ? 'bg-linear-to-br from-black via-gray-950 to-black'
        : 'bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'
    }`}>
      <Header
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
        isConnected={isConnected}
        currentRoom={currentRoom}
        memberCount={memberCount}
      />

      {!isConnected ? (
        <JoinRoom
          isDarkTheme={isDarkTheme}
          username={username}
          setUsername={setUsername}
          roomId={roomId}
          setRoomId={setRoomId}
          useCustomRoom={useCustomRoom}
          setUseCustomRoom={setUseCustomRoom}
          roomCreated={roomCreated}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onGenerateNewRoom={handleGenerateNewRoom}
        />
      ) : (
        <>
          <MessageList messages={messages} isDarkTheme={isDarkTheme} />
          <ChatInput isDarkTheme={isDarkTheme} onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
}

export default App;
