import { User } from "../models/userModel";
import { Post } from "../models/postModel";

import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response) => {
   try {
    const { userId,  text, musicData } = req.body;

    const post = new Post({ user: userId,  text, musicData });
    await post.save();

    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
}

export const toggleLike = async (req: Request, res: Response) : Promise<any> => {
    try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.filter(id => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: isLiked ? "Unliked" : "Liked", isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
}