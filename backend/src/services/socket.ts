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
          message,
          roomId,
          senderId,
          tempId,
        }: {
          message: string;
          roomId: string;
          senderId: string;
          tempId: string;
        }) => {
          console.log(`new message recieved: ${message}`);

          const newMessage = await Message.create({
            sender: senderId,
            chat: roomId,
            content: message,
            messageType: "text",
          });

          socket.to(roomId).emit("event:message", {
            message,
            senderId,
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

      socket.on("typing", async ({ typing }: { typing: boolean }) => {});

      socket.on("stopTyping", async ({ typing }: { typing: boolean }) => {});
    });
  }
}

export default InitSocket;
