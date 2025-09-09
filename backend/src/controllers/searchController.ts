import { Request, Response } from "express";
import { User } from "../models/userModel";

export default async function getAllPeople(req: Request, res: Response): Promise<any> {
  try {
    const user = await User.find();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Users found", users: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


// export async function searchAllPeople(req: Request, res: Response) {
    
//     try {
//         const 
//     } catch (error) {
        
//     }
// }