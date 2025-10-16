import { Request, Response } from "express";
import { User } from "../../models/userModel";

export default async function followerController(
  req: Request,
  res: Response
): Promise<any> {
  const { userId, type } = req.query;
  

  if (!userId || !type) {
    return res
      .status(400)
      .json({ success: false, message: "userId or type missing" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid userId" });
    }

    let result;
    if (type === "followers") {
      result = await User.find({ _id: { $in: user.followers } }).select(
        "_id userName profilePicture avatar following followers"
      );
    } else if (type === "following") {
      result = await User.find({ _id: { $in: user.following } }).select(
        "_id userName profilePicture avatar following followers"
      );
    } else {
      return res.status(400).json({ success: false, message: "invalid type" });
    }

    res.status(200).json({
      success: true,
      message: `${type} found successfully`,
      total: result,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "igotmessage server error" });
  }
}
