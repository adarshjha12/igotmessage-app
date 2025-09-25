import { Request, Response } from "express";
import imagekit from "../utils/imagekitConfig";

const uploadReel = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.body;

  try {
    const video = req.file;
    if (!video) return res.status(400).json({success: false, message: "No file uploaded" });

    const uploadVideo = await imagekit.upload({
      file: video.buffer,
      fileName: video.originalname,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: "IGotMessage Server error", error });
  }
};
