import { Request, Response } from "express";
import { Story } from "../models/storyModel";
import imagekit from "../utils/imagekitConfig";

const storyUploadController = async (req: Request, res: Response) : Promise<any> => {
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
  
  res.status(201).json({ message: "Story uploaded", success: true, story });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "IGotMessage Server error", error });
  }
};

const getMyStoryController = async (req: Request, res: Response) : Promise<any> => {
  const { userId } = req.body

  try {
    if(!userId) return res.status(400).json({ message: "User id not provided" });

    const myStories = await Story.find({ user: userId });
    if(!myStories) return res.status(404).json({ message: "No story found" });

    res.status(200).json({ message: "Story found", success: true, myStories });
  } catch (error) {
    res.status(500).json({ message: "IGotMessage Server error", error });
  }
}

const getOtherStoryController = async (req: Request, res: Response) : Promise<any> => {
  const otherStories = await Story.find().populate("user", "username profilePicture").sort({ createdAt: -1 });
  
  if(!otherStories) return res.status(404).json({ message: "No stories found" });

  res.status(200).json({ message: "Stories found", success: true, otherStories });
}
export {storyUploadController, getMyStoryController, getOtherStoryController};
