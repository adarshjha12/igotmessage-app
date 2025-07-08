import { Request, Response } from "express";
import { Story } from "../models/storyModel";
import imagekit from "../utils/imagekitConfig";

const storUploadController = async (req: Request, res: Response) : Promise<any> => {
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
    musicData: JSON.parse(musicData),
  });
  
  res.status(201).json({ message: "Story uploaded", success: true, story });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "IGotMessage Server error", error });
  }
};

export default storUploadController;
