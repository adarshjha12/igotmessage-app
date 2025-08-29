import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrls: { type: [String] },
    text: { type: String },
    postType: { type: String, default: "normal" },
    poll: {},
    musicData: {
      title: { type: String },
      artist: { type: String },
      genre: { type: String },
      url: { type: String },
      image: { type: String },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", PostSchema);
