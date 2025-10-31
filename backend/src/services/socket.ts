import { Server } from "socket.io";
import { Message } from "../models/messageModel";

class InitSocket {
  private _io: Server;
  constructor() {
    console.log("socket initialized");

    this._io = new Server();
  }

  get io() {
    return this._io;
  }

  public initListners() {
    const io = this.io;
    io.on("connect", (socket) => {
      console.log("socket connected", socket.id);

      socket.on(
        "event:message",
        async ({
          content,
          roomId,
          senderId,
          tempId,
        }: {
          content: string;
          roomId: string;
          senderId: string;
          tempId: string;
        }) => {
          console.log(`new message recieved: ${content}`);

          const newMessage = await Message.create({
            sender: senderId,
            chat: roomId,
            content,
            messageType: "text",
          });

          socket.to(roomId).emit("event:message", {
            content,
            senderId,
            roomId,
            updatedAt: newMessage.updatedAt,
            messageId: newMessage._id,
            messageType: newMessage.messageType,
            tempId,
          });
        }
      );

      socket.on("joinRoom", async ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        console.log("room joined", roomId);
      });

      socket.on("leaveRoom", async ({ roomId }: { roomId: string }) => {
        socket.leave(roomId);
        console.log("room left", roomId);
      });

      socket.on("disconnect", () => {
        console.log("socket disconnected", socket.id);
      });

      socket.on(
        "event:typing",
        async ({ roomId, senderId }: { roomId: string; senderId: boolean }) => {
          socket.to(roomId).emit("event:typing", { typing: true });
        }
      );

      socket.on(
        "event:stopTyping",
        async ({ roomId, senderId }: { roomId: string; senderId: boolean }) => {
          socket.to(roomId).emit("event:stopTyping", { typing: false });
        }
      );
    });
  }
}

export default InitSocket;
