import path from "path";
import { Comment } from "../models/commentModel";
import { Post } from "../models/postModel";
import { Request, Response } from "express";
import { User } from "../models/userModel";

export const addComment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, text, postId } = req.body;
    const checkGuestUser = await User.findById(userId);
    if (checkGuestUser?.isGuest) {
      return res.status(403).json({ message: "Guest user cannot comment" });
    }

    console.log(userId, text, postId);

    const comment = new Comment({ post: postId, user: userId, text });
    await comment.save();

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    const savedComment = await comment.populate(
      "user",
      "userName profilePicture avatar"
    );

    return res
      .status(201)
      .json({ message: "Comment added", comment: savedComment });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const addReply = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, text, commentId } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: { user: userId, text } } },
      { new: true }
    ).populate("replies.user", "userName profilePicture avatar");

    const newReply = updatedComment?.replies[updatedComment.replies.length - 1];

    return res.status(201).json({ message: "Reply added", reply: newReply });
  } catch (err) {
    console.error("Add reply error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const getCommentAndReplies = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { postId } = req.body;
    console.log(postId);

    const comments = await Comment.find({ post: postId })
      .populate({
        path: "user",
        select: "userName profilePicture avatar",
        match: { $or: [{ isGuest: false }, { isGuest: { $exists: false } }] },
        strictPopulate: true,
      })
      .populate({
        path: "replies.user",
        select: "userName profilePicture avatar",
        match: { $or: [{ isGuest: false }, { isGuest: { $exists: false } }] },
        strictPopulate: true,
      })
      .sort({ createdAt: -1 });

    console.log(comments);

    const filteredComments = comments.filter((comment) => comment.user);

    return res
      .status(200)
      .json({ message: "Comments retrieved", comments: filteredComments });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
