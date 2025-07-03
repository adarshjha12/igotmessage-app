import { Request, Response } from "express";

const storUploadController = async (req: Request, res: Response) => {
    res.status(200).json({ message: "success" });
    console.log(req);
    
};

export default storUploadController;