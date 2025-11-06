import { Request, Response } from "express";
import { Chat } from "../../models/chatModel";
import { User } from "../../models/userModel";
import { Message } from "../../models/messageModel";

import mongoose from "mongoose";

export const createOrGetChat = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { senderId, recieverId } = req.body;

    if (!senderId || !recieverId) {
      console.log("Required id not provided");
      return res
        .status(400)
        .json({ message: "Missing senderId or recieverId" });
    }

    const senderObjId = new mongoose.Types.ObjectId(senderId);
    const receiverObjId = new mongoose.Types.ObjectId(recieverId);

    const receiver = await User.findById(receiverObjId).select("_id lastSeen");

    if (!receiver) {
      console.log("Receiver user not found in DB:", receiverObjId);
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }
    // Find chat that has *exactly* these two participants
    let chat = await Chat.findOne({
      participants: { $size: 2, $all: [senderObjId, receiverObjId] },
    }).populate("participants", "userName profilePicture avatar");

    if (chat) {
      console.log("Existing chat found");
      console.log({
        senderId,
        recieverId,
        senderLastSeen: (await User.findById(senderId).select("lastSeen"))
          ?.lastSeen,
        recieverLastSeen: (await User.findById(recieverId).select("lastSeen"))
          ?.lastSeen,
      });

      return res.status(200).json({
        success: true,
        message: "Chat found",
        chat,
        receiverLastSeen: receiver?.lastSeen || null,
        receiverId: receiver?._id,
      });
    }

    // If no chat, create new one
    chat = await Chat.create({
      participants: [senderObjId, receiverObjId],
    });

    console.log("New chat created");

    return res.status(201).json({
      success: true,
      message: "Chat created",
      chat,
      receiverLastSeen: receiver?.lastSeen || null,
      receiverId: receiver?._id,
    });
  } catch (error) {
    console.error("createOrGetChat error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  const chatId = req.query.chatId;
  try {
    const messages = await Message.find({ chat: chatId });
    return res
      .status(200)
      .json({ success: true, message: "messages found", messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyChats = async (req: Request, res: Response): Promise<any> => {
  const userId = req.query.userId as string;

  try {
    // Get all chats where this user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "userName profilePicture avatar lastSeen")
      .sort({ updatedAt: -1 });

    // For each chat, pick the *other* participant
    const formattedChats = chats.map((chat) => {
      const coParticipant = chat.participants.find(
        (p: any) => p._id.toString() !== userId
      );

      return {
        _id: chat._id,
        isGroupChat: chat.isGroupChat,
        unreadMessages: chat.unreadMessages,
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        coParticipant, // other user's info
      };
    });

    return res.status(200).json({
      success: true,
      message: "Chats found",
      chats: formattedChats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
