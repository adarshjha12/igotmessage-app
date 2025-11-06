import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },

    chatName: {
      type: String,
      trim: true,
    },

    // For 1-on-1: contains exactly 2 users
    // For group chat: contains all group members
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Only for group chats
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Optional: keep track of last message for quick preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    unreadMessages: {
      type: Number,
      default: 0,
    },

    // Optionally store chat avatar or group photo
    chatAvatar: String,
  },
  { timestamps: true }
);
chatSchema.index(
  { participants: 1 },
  {
    unique: true,
    partialFilterExpression: { "participants.2": { $exists: false } },
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
