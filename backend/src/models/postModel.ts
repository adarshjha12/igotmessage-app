import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrls: { type: [String] },
    templateImage: { type: String },
    text: { type: String },
    isReposted: { type: Boolean },
    whoReposted: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postType: { type: String, default: "normal" },
    privacy: { type: String, default: "public" },
    poll: {
      question: { type: String },
      options: [
        {  
          text: { type: String },
          votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      ],
    },
    musicData: {
      title: { type: String },
      artist: { type: String },
      genre: { type: String },
      url: { type: String },
      image: { type: String },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", PostSchema);
