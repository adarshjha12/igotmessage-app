import { Request, Response } from "express";
import { Chat } from "../../models/chatModel";
import { User } from "../../models/userModel";

export const createOrGetChat = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { senderId, recieverId } = req.body;
  if (!senderId || !recieverId) {
    console.log("required id not provided");

    return res.status(400).json({ message: "Missing senderId or recieverId" });
  }
  try {
    let chat;
    const recieverLastSeen = await User.findOne({ _id: recieverId }).select("lastSeen");
    chat = await Chat.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate("participants", "userName profilePicture avatar");

    if (chat) {
      console.log("chat found");

      return res
        .status(200)
        .json({ success: true, message: "Chat found", chat: chat, recieverLastSeen: recieverLastSeen?.lastSeen });
    } else {
      chat = await Chat.create({ participants: [senderId, recieverId] });
      console.log("chat created");

      return res
        .status(201)
        .json({ success: true, message: "Chat created", chat: chat, recieverLastSeen });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
