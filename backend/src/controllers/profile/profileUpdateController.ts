import { Request, Response } from "express";
import imagekit from "../../utils/imagekitConfig";
import { User } from "../../models/userModel";
import mongoose from "mongoose";

const profileUpdateController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, userName, fullName, bio } = req.body;

  const profilePic = req.file;

  let profilePicUrl = null;
  let profilePicUpload = null;
  try {
    if (profilePic) {
      profilePicUpload = await imagekit.upload({
        file: profilePic?.buffer,
        fileName: profilePic?.originalname,
      });

      profilePicUrl = profilePicUpload?.url || null;
    }
    const profile = await User.findByIdAndUpdate(
      userId,
      {
        ...(userName && { userName: userName.toLowerCase() }),
        ...(fullName && { fullName }),
        ...(bio && { bio }),
        ...(profilePic && { profilePicture: profilePicUrl }),
      },
      { new: true }
    );

    // console.log("profile updated successfully", profile);

    return res.status(200).json({
      success: true,
      message: "profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "profile update unsuccessful" });
  }
};

export default profileUpdateController;

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  const userId = req.query.userId;
  try {
    const profile = await User.findById(userId);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Profile found", profile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleFollow = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { currentUserId, targetUserId } = req.body;

  console.log("currentUserId", currentUserId, "targetUserId", targetUserId);

  // Prevent self-follow
  if (currentUserId === targetUserId) {
    return res
      .status(400)
      .json({ success: false, message: "You cannot follow yourself" });
  }

  try {
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
      );
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      success: true,
      message: isFollowing ? "Unfollowed" : "Followed",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
