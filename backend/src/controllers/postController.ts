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

    if (templateImage) {
      mediaUrls.push(templateImage);
    }

    const post = new Post({
      user: userId,
      mediaUrls: mediaUrls || [],
      templateImage: templateImage || "",
      postType,
      poll: poll && JSON.parse(poll),
      text: text || "",
      musicData: musicData && JSON.parse(musicData),
      privacy: privacy || "public",
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

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    let { page } = req.query;

    const pageNo = parseInt(page as string);
    const limit = 10;

    const skip = (pageNo - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "userName profilePicture isGuest",
        match: { $or: [{ isGuest: false }, { isGuest: { $exists: false } }] },
      });

    const filteredPosts = posts.filter((post) => post.user);

    const total = await Post.countDocuments();

    const hasMore = skip + filteredPosts.length < total;

    return res.status(200).json({
      success: true,
      message: "Posts found",
      posts: filteredPosts,
      hasMore,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.some(id => id.toString() === userId.toString());

    let updatedPost;

    if (isLiked) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true } 
      );
      return res.json({
        message: "Unliked",
        isLiked: false,
        likeCount: updatedPost?.likes.length || 0,
      });
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      return res.json({
        message: "Liked",
        isLiked: true,
        likeCount: updatedPost?.likes.length || 0,
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

