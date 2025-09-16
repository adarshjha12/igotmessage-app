import { Request, Response } from "express";
import { User } from "../models/userModel";

export async function getAllPeople(req: Request, res: Response): Promise<any> {
  const userId = req.query.userId;
  try {
    const users = await User.find({
      _id: { $ne: userId }, // exclude self
      $or: [{ isGuest: false }, { isGuest: { $exists: false } }],
    });

    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Users found", users: users });
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
  const { type, userId } = req.body;

  try {
    const qStr = String(q || "");

    const escaped = qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp("^" + escaped, "i");

    let users = await User.find({ userName: prefixRegex })
      .select("userName _id profilePicture avatar fullName followers following")
      .limit(10)
      .lean();

    if (users.length < 10) {
      const remaining = 10 - users.length;

      const fallback = await User.find(
        { $text: { $search: qStr } },
        { score: { $meta: "textScore" } } // include score
      )
        .sort({ score: { $meta: "textScore" } })
        .select("userName _id profilePicture avatar fullName followers following")
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
    const filterMyself = users.filter((user) => user._id !== userId);

    return res
      .status(200)
      .json({ success: true, message: "Users found", users: filterMyself });
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
  const { userId } = req.body;

  try {
    const qStr = String(q || "");
    const escaped = qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp("^" + escaped, "i");

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    // main search (prefix match within followers)
    let users = await User.find({
      _id: { $in: user.followers },
      userName: prefixRegex,
    })
      .select("userName _id profilePicture avatar fullName followers following")
      .limit(10)
      .lean();

    // fallback (text search if less than 10 results)
    if (users.length < 10 && qStr) {
      const remaining = 10 - users.length;

      const fallback = await User.find(
        {
          _id: { $in: user.followers },
          $text: { $search: qStr },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .select("userName _id profilePicture avatar fullName followers following")
        .limit(remaining)
        .lean();

      // merge without duplicates
      const ids = new Set(users.map((u) => String(u._id)));
      for (const f of fallback) {
        if (!ids.has(String(f._id))) {
          users.push(f);
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Users found", users });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
export async function searchFollowing(
  req: Request,
  res: Response
): Promise<any> {
  const { q } = req.query;
  const { userId } = req.body;

  try {
    const qStr = String(q || "");
    const escaped = qStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp("^" + escaped, "i");

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId" });
    }

    // main search (prefix match within following)
    let users = await User.find({
      _id: { $in: user.following },
      userName: prefixRegex,
    })
      .select("userName _id profilePicture avatar fullName followers following")
      .limit(10)
      .lean();

    // fallback (text search if less than 10 results)
    if (users.length < 10 && qStr) {
      const remaining = 10 - users.length;

      const fallback = await User.find(
        {
          _id: { $in: user.following },
          $text: { $search: qStr },
        },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .select("userName _id profilePicture avatar fullName followers following")
        .limit(remaining)
        .lean();

      // merge without duplicates
      const ids = new Set(users.map((u) => String(u._id)));
      for (const f of fallback) {
        if (!ids.has(String(f._id))) {
          users.push(f);
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Users found", users });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
