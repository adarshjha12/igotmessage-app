import { Request, Response } from "express";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { Post } from "../models/postModel";

async function handleGuestAuth(req: Request, res: Response): Promise<void> {
  const randomNumber = Math.floor(Math.random() * 100000 + 1);

  try {
    // const post = await new Post({
    //   user: "687116cd65b342f8f49ac114",
    //   mediaUrls: [
    //     "https://images.unsplash.com/photo-1516900557549-41557d405adf?w=600&aut…",
    //   ],
    //   templateImage:
    //     "https://images.unsplash.com/photo-1516900557549-41557d405adf?w=600&aut…",
    //   postType: "normal",
    //   poll: null, // no poll given
    //   text: "first post.",
    //   musicData: {}, // empty object, no need to JSON.parse
    //   privacy: "public",
    // });
    // post.save();
    const user = await new User({
      userName: "guest" + randomNumber,
      isGuest: true,
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
