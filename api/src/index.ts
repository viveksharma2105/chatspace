import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}


let allSockets: User[] = []; //[{socket: socket1, room: "room1"},{socket: socket2, room: "room2"}]

wss.on("connection", (socket) => {
  //message catch
  socket.on("message", (message) => {
    //@ts-ignore
    const parsedMessage = JSON.parse(message);


    if (parsedMessage.type === "join") {
        console.log("user want to join room");
        
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }




    if (parsedMessage.type === "chat") {
        console.log("user want to do chat");
        
      const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room; //find the room


      //after find the room send the user msg to all the members of the room
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i]?.room == currentUserRoom) {
            allSockets[i]?.socket.send(parsedMessage.payload.message)
        }
      }
    }
  });

//   //userDisconnected
//   socket.on("disconnect", () => {
    
//     allSockets = allSockets.filter((x) => x !== socket);
//   });
});
