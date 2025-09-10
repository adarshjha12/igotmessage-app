import { Request, Response } from "express";
import { User } from "../models/userModel";

export async function getAllPeople(
  req: Request,
  res: Response
): Promise<any> {
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

export async function searchAllPeople(
  req: Request,
  res: Response
): Promise<any> {
  const { q } = req.query;
  const {type, userId} = req.body

  try {
    const qStr = String(q || "");

    const escaped = qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp("^" + escaped, "i");

    let users = await User.find({ userName: prefixRegex })
      .select("userName _id profilePicture avatar")
      .limit(10)
      .lean();

    if (users.length < 10) {
      const remaining = 10 - users.length;

      const fallback = await User.find(
        { $text: { $search: qStr } },
        { score: { $meta: "textScore" } } // include score
      )
        .sort({ score: { $meta: "textScore" } })
        .select("userName _id profilePicture avatar")
        .limit(remaining)
        .lean();

      // merge while removing duplicates
      const ids = new Set(users.map((u) => String(u._id)));
      for (const f of fallback) {
        if (!ids.has(String(f._id))) {
          users.push(f);
          ids.add(String(f._id));
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Users found", users });
  } catch (err) {
    console.error("Search error:", err);
    return res
      .status(500)
      .json({ success: true, message: "IGotMessage server error" });
  }
}

export async function searchFollowers(
  req: Request,
  res: Response
): Promise<any> {
  const { q } = req.query;
  const {type, userId} = req.body

  try {
    const qStr = String(q || "");

    const escaped = qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp("^" + escaped, "i");

    let users = await User.find({ userName: prefixRegex })
      .select("userName _id profilePicture avatar")
      .limit(10)
      .lean();

    if (users.length < 10) {
      const remaining = 10 - users.length;

      const fallback = await User.find(
        { $text: { $search: qStr } },
        { score: { $meta: "textScore" } } // include score
      )
        .sort({ score: { $meta: "textScore" } })
        .select("userName _id profilePicture avatar")
        .limit(remaining)
        .lean();

      // merge while removing duplicates
      const ids = new Set(users.map((u) => String(u._id)));
      for (const f of fallback) {
        if (!ids.has(String(f._id))) {
          users.push(f);
          ids.add(String(f._id));
        }
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Users found", users });
  } catch (err) {
    console.error("Search error:", err);
    return res
      .status(500)
      .json({ success: true, message: "IGotMessage server error" });
  }
}
