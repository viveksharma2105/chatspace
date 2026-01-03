import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";

interface UseWebSocketReturn {
  messages: Message[];
  isConnected: boolean;
  currentRoom: string;
  roomCreated: boolean;
  memberCount: number;
  wsRef: React.MutableRefObject<WebSocket | null>;
  setRoomCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useWebSocket(): UseWebSocketReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);

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
              if (data.memberCount) {
                setMemberCount(data.memberCount);
              }
              sessionStorage.removeItem('attemptedRoom');
            }
          } else if (data.message.includes("created successfully")) {
            setRoomCreated(true);
          }
        } else if (data.type === "error") {
          setMessages((m) => [...m, { text: `Error: ${data.message}`, timestamp: new Date().toISOString() }]);
          if (data.message.includes("already exists")) {
            alert("Room already exists! Please join instead.");
          }
        } else if (data.type === "chat") {
          setMessages((m) => [...m, { text: data.message, username: data.username, timestamp: new Date().toISOString() }]);
        } else if (data.type === "memberCount") {
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

  return {
    messages,
    isConnected,
    currentRoom,
    roomCreated,
    memberCount,
    wsRef,
    setRoomCreated,
  };
}
