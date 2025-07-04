import { Response, Request } from "express";
import { User } from "../models/userModel";
export const followController = async function (req: Request, res: Response) {
  const currentUserId = req.body.currentUserId;
  const { targetUserId } = req.params;

  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  try {
    if (!targetUser) {
      res
        .status(404)
        .json({ success: false, message: "target user not found" });
      return;
    }
    if (!currentUser) {
      res
        .status(404)
        .json({ success: false, message: "target user not found" });
      return;
    }
    const isFollowing = currentUser?.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following.filter((ids) => ids !== targetUser._id);
      targetUser.followers.filter((ids) => ids !== currentUser._id);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    currentUser.save();
    targetUser.save();
    res.status(200).json({message: isFollowing ? "unfollowed" : "followed", isFollowing: !isFollowing })
  } catch (error) {
    res.status(500).json({message: "server error of igotmessage", error: error})
  }
};
