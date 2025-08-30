import { User } from "../models/userModel";
import { Post } from "../models/postModel";
import imagekit from "../utils/imagekitConfig";

import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, text, musicData, templateImage, poll, postType, privacy } =
      req.body;

    const files = (req.files as Express.Multer.File[]) || [];

    const mediaUrls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        console.log("Uploading:", file.originalname);
        const uploadImage = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
        });
        mediaUrls.push(uploadImage.url);
      }
    }

    const post = new Post({
      user: userId,
      mediaUrls,
      templateImage,
      postType,
      poll,
      text,
      musicData: musicData ? JSON.parse(musicData) : null,
      privacy,
    });

    await post.save();

    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    return res
      .status(201)
      .json({ success: true, message: "Post created", post });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: isLiked ? "Unliked" : "Liked", isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
