import { Request, Response } from "express";
import { Story } from "../models/storyModel";

const storUploadController = async (req: Request, res: Response) => {
  try {
    const { userId, imageUrl, musicUrl } = req.body;

    const story = new Story({ user: userId, imageUrl, musicUrl });
    await story.save();
    res.status(201).json({ message: "Story created", story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default storUploadController;
