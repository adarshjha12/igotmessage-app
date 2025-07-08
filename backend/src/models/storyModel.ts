import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    musicData: {
      title: { type: String },
      artist: { type: String },
      genre: { type: String },
      url: { type: String },
      image: { type: String },
    },
  },
  { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
