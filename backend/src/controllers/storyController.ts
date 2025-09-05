import { Request, Response } from "express";
import { Story } from "../models/storyModel";
import imagekit from "../utils/imagekitConfig";

const storyUploadController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, musicData } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const uploadStoryImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    const story = await Story.create({
      user: userId,
      imageUrl: uploadStoryImage.url,
      imageId: uploadStoryImage.fileId,
      musicData: musicData && JSON.parse(musicData),
    });

    return res
      .status(201)
      .json({ message: "Story uploaded", success: true, story });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "IGotMessage Server error", error });
  }
};

const getMyStoryController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.body;

  try {
    if (!userId)
      return res.status(400).json({ message: "User id not provided" });

    const myStories = await Story.find({ user: userId })
      .populate({
        path: "user",
        select: "userName profilePicture isGuest avatar",
        match: { $or: [{ isGuest: false }, { isGuest: { $exists: false } }] },
      })
      .sort({ createdAt: -1 });

    const filteredStories = myStories.filter((story) => story.user);

    if (filteredStories.length === 0)
      return res.status(404).json({ message: "No story found" });

    res.status(200).json({
      message: "Story found",
      success: true,
      myStories: filteredStories,
    });
  } catch (error) {
    res.status(500).json({ message: "IGotMessage Server error", error });
  }
};

const getOtherStoryController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const otherStories = await Story.find()
    .populate({
      path: "user",
      select: "userName profilePicture isGuest avatar",
      match: { $or: [{ isGuest: false }, { isGuest: { $exists: false } }] },
    })
    .sort({ createdAt: -1 });

  const filteredStories = otherStories.filter((story) => story.user);

  if (filteredStories.length === 0)
    return res.status(404).json({ message: "No stories found" });

  res.status(200).json({
    message: "Stories found",
    success: true,
    otherStories: filteredStories,
  });
};

const getStoryByIdController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.params.id;
  try {
    if (!userId)
      return res
        .status(400)
        .json({ message: "no userId provided", success: false });
    const stories = await Story.find({ user: userId }).populate(
      "user",
      "userName profilePicture avatar"
    );
    if (!stories || stories.length === 0)
      return res
        .status(404)
        .json({ message: "stories not found", success: false });
    res.status(200).json({ message: "stories found", success: true, stories });
  } catch (error) {
    res
      .status(500)
      .json({ message: " server error on IGotMessage", success: false });
  }
};
export {
  storyUploadController,
  getMyStoryController,
  getOtherStoryController,
  getStoryByIdController,
};
