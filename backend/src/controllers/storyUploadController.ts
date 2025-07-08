import { Request, Response } from "express";
import { Story } from "../models/storyModel";

const storUploadController = async (req: Request, res: Response) => {
  try {
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default storUploadController;
