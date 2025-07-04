import { Comment } from "../models/commentModel";
import { Post } from "../models/postModel";
import { Request, Response } from "express";
// Add comment to a post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
