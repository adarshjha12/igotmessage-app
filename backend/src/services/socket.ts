import { Server } from "socket.io";
import { Message } from "../models/messageModel";
import { User } from "../models/userModel";

export async function initSocketIO() {
  const onlineUsers: string[] = [];

  const io = new Server();

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (!userId) return;

    onlineUsers.push(userId);
    await User.findByIdAndUpdate(userId, { lastSeen: Date.now() });

    socket.broadcast.emit("userOnline", { userId });
    socket.to(userId).emit("userOnline", { onlineUsers });

    console.log("🟢 socket connected:", socket.id);

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
        console.log("💬 New message:", content, roomId, senderId);

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

    // 🏠 Join room
    socket.on("event:joinRoom", async ({ roomId }: { roomId: string }) => {
      if (!roomId) return;
      await socket.join(roomId);
      const sockets = await io.in(roomId).fetchSockets();
      console.log(
        `✅ Joined room ${roomId} | Members:`,
        sockets.map((s) => s.id)
      );
    });

    // 🚪 Leave room
    socket.on("leaveRoom", async ({ roomId }: { roomId: string }) => {
      socket.leave(roomId);
      console.log("🚪 Left room:", roomId);
    });

    // ❌ Disconnect
    socket.on("disconnect", async () => {
      const sockets = await io.fetchSockets();
      const stillOnline = sockets.some(
        (s) => s.handshake.query.userId === userId
      );

      if (!stillOnline) {
        onlineUsers.splice(onlineUsers.indexOf(userId), 1);
        const lastSeen = Date.now();
        socket.broadcast.emit("userOffline", { userId, lastSeen });
        console.log(`❌ User disconnected: ${userId}`);
      }
    });

    socket.on("event:typing", ({ roomId, senderId }) => {
      socket.to(roomId).emit("event:otherTyping", { typing: true, senderId });
    });

    socket.on("event:stopTyping", ({ roomId, senderId }) => {
      socket
        .to(roomId)
        .emit("event:otherStopTyping", { typing: false, senderId });
    });
  });

  return io;
}

export default initSocketIO;
