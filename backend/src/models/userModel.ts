import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isGuest: { type: Boolean, default: false },

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
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    userName: { type: String, unique: true, sparse: true },
    fullName: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

UserSchema.index({ userName: 1 }); 
UserSchema.index({ fullName: "text"});

const User = mongoose.model("User", UserSchema);
export { User };
