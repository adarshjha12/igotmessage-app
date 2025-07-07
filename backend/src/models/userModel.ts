import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneNo: {
      type: Number,
      unique: true,
      sparse: true,
    },
    title: {
      type: String,
      default: "User",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dqj3x4k2h/image/upload/v1735681234/avatars/default-avatar.png",
    },
    username: { type: String, unique: true },
    fullName: { type: String },
    profilePicture: { type: String  },
    bio: { type: String  },
    verified: { type: Boolean, default: false },

    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    calls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Call" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", Schema);
export { User };
