import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { log } from "console";

const randomNumber = Math.floor(Math.random() * 100000 + 1);
const redirectUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.PROD_FRONTEND_URL}/dash/feed`
    : `${process.env.DEV_FRONTEND_URL}/dash/feed`;

async function handleGuestAuth(req: Request, res: Response): Promise<any> {
  try {
    const user = await new User({
      username: "guest" + randomNumber,
      isGuest: true,
    });
    user.save()
    const payload = {id: user._id.toString(), username: user.username}
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({success: true, message: `guest user guest${randomNumber} created successfully.`})

  } catch (error) {
    console.log(error);
    
     res.status(500).json({success: false, message: `IGotMessage server error`, error})
  }
}

export default handleGuestAuth;
