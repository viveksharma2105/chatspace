import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}


let allSockets: User[] = []; //[{socket: socket1, room: "room1"},{socket: socket2, room: "room2"}]
let rooms: Set<string> = new Set(); // Store all created rooms

// Helper function to get member count for a room
const getRoomMemberCount = (roomId: string): number => {
  return allSockets.filter(user => user.room === roomId).length;
};

// Helper function to broadcast member count to all users in a room
const broadcastMemberCount = (roomId: string) => {
  const memberCount = getRoomMemberCount(roomId);
  allSockets.forEach(user => {
    if (user.room === roomId) {
      user.socket.send(JSON.stringify({
        type: "memberCount",
        count: memberCount
      }));
    }
  });
};

wss.on("connection", (socket) => {
  //message catch
  socket.on("message", (message) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);

    // Create a new room
    if (parsedMessage.type === "create") {
      console.log("user wants to create room");
      
      const roomId = parsedMessage.payload.roomId;
      
      if (rooms.has(roomId)) {
        socket.send(JSON.stringify({ 
          type: "error", 
          message: `Room "${roomId}" already exists` 
        }));
      } else {
        rooms.add(roomId);
        console.log(`Room "${roomId}" created. Total rooms: ${rooms.size}`);
        socket.send(JSON.stringify({ 
          type: "success", 
          message: `Room "${roomId}" created successfully` 
        }));
      }
    }

    // Join an existing room
    if (parsedMessage.type === "join") {
      console.log("user wants to join room");
      
      const roomId = parsedMessage.payload.roomId;
      
      if (!rooms.has(roomId)) {
        socket.send(JSON.stringify({ 
          type: "error", 
          message: `Room "${roomId}" does not exist. Please create it first.` 
        }));
      } else {
        allSockets.push({
          socket,
          room: roomId,
        });
        const memberCount = getRoomMemberCount(roomId);
        console.log(`User joined room "${roomId}". Members: ${memberCount}`);
        socket.send(JSON.stringify({ 
          type: "success", 
          message: `Joined room "${roomId}" successfully`,
          memberCount: memberCount
        }));
        // Broadcast updated member count to all users in the room
        broadcastMemberCount(roomId);
      }
    }




    if (parsedMessage.type === "chat") {
        console.log("user want to do chat");
        
      const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room; //find the room


      //after find the room send the user msg to all the members of the room
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i]?.room == currentUserRoom) {
            allSockets[i]?.socket.send(JSON.stringify({
              type: "chat",
              message: parsedMessage.payload.message,
              username: parsedMessage.payload.username
            }))
        }
      }
    }
  });

  // User disconnected
  socket.on("close", () => {
    const user = allSockets.find((x) => x.socket === socket);
    if (user) {
      const roomId = user.room;
      allSockets = allSockets.filter((x) => x.socket !== socket);
      console.log(`User disconnected from room "${roomId}". Remaining members: ${getRoomMemberCount(roomId)}`);
      // Broadcast updated member count to remaining users
      if (getRoomMemberCount(roomId) > 0) {
        broadcastMemberCount(roomId);
      }
    }
  });
});
