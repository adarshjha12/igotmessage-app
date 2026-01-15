import { Request, Response } from "express";
import { Chat } from "../../models/chatModel";
import { User } from "../../models/userModel";
import { Message } from "../../models/messageModel";

export const createOrGetChat = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { senderId, recieverId } = req.body;

    if (!senderId || !recieverId)
      return res
        .status(400)
        .json({ message: "Missing senderId or recieverId" });

    const receiver = await User.findById(recieverId)
      .select("_id lastSeen")
      .lean();

    let chat = await Chat.findOne({
      participants: { $all: [senderId, recieverId], $size: 2 },
    })
      .populate("participants", "userName profilePicture avatar")
      .lean();

    // ✔️ If chat exists → load messages
    if (chat) {
      // Reset unread count
      await Chat.updateOne(
        { _id: chat._id },
        { [`unreadCounts.${senderId}`]: 0 }
      );

      console.log('chat found+++++++++++++++++++++');
      

      // Get last 30 messages
      const messages = await Message.find({ chat: chat._id })
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        chat,
        allMessages: messages.reverse(),
        receiverLastSeen: receiver?.lastSeen ?? null,
      });
    }


    // ✔️ Create new chat
    const newChat = await Chat.create({
      participants: [senderId, recieverId],
    });

    console.log('chat created++++++++++++++++++');
    
    return res.status(201).json({
      success: true,
      chat: newChat,
      messages: [], // no messages yet
      receiverLastSeen: receiver?.lastSeen ?? null,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyChats = async (req: Request, res: Response): Promise<any> => {
  const userId = req.query.userId as string;

  try {
    // Get all chats where this user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "userName profilePicture avatar lastSeen")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "userName profilePicture" },
      })
      .sort({ updatedAt: -1 });

    // For each chat, pick the *other* participant
    const formattedChats = chats.map((chat) => {
      const coParticipant = chat.participants.find(
        (p: any) => p._id.toString() !== userId
      );

      return {
        _id: chat._id,
        isGroupChat: chat.isGroupChat,
        unreadCount: chat.unreadCounts.get(userId),
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
