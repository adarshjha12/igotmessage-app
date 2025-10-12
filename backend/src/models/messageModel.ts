import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    // Optional features:
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file", "system"],
      default: "text",
    },

    attachments: [String], // URLs for files/media

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // reactions: [{ emoji: "❤️", users: [userIds] }]
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
