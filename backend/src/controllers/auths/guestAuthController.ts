import { Request, Response } from "express";
import { User } from "../../models/userModel";
import jwt from "jsonwebtoken";

let randomNumber: number;
let randomAvatarNums: number;

const interval = setInterval(() => {
  randomNumber = Math.floor(Math.random() * 100000 + 1);
  randomAvatarNums = Math.floor(Math.random() * 1000 + 1);
}, 3000);


async function handleGuestAuth(req: Request, res: Response): Promise<void> {
  try {
    const user = await new User({
      userName: "guest" + randomNumber,
      isGuest: true,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=boy${randomAvatarNums}&mouth=smile&eyes=happy`,
    });
    user.save();
    const payload = { id: user._id.toString(), username: user.userName };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      message: `guest user guest${randomNumber} created successfully.`,
    });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ success: false, message: `IGotMessage server error`, error });
  }
}

export default handleGuestAuth;
