import { Request, Response } from "express";
import imagekit from "../utils/imagekitConfig";
import { User } from "../models/userModel";

const profileUpdateController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, userName, fullName, bio } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const profilePic = files?.profilePic?.[0];
  const coverPic = files?.coverPic?.[0];

  try {
    const [profilePicUpload, coverPicUpload] = await Promise.all([
      profilePic
        ? imagekit.upload({
            file: profilePic.buffer,
            fileName: profilePic.originalname,
          })
        : null,
      coverPic
        ? imagekit.upload({
            file: coverPic.buffer,
            fileName: coverPic.originalname,
          })
        : null,
    ]);

    const profilePicUrl = profilePicUpload?.url || null;
    const coverPicUrl = coverPicUpload?.url || null;

    const profile = await User.findByIdAndUpdate(userId, {
      ...(userName && { userName }),
      ...(fullName && { fullName }),
      ...(bio && { bio }),
      ...(profilePic && { profilePicture: profilePicUrl }),
      ...(coverPic && { coverPhoto: coverPicUrl }),
    }, {new: true});

    // console.log("profile updated successfully", profile);
    
    return res
      .status(200)
      .json({
        success: true,
        message: "profile updated successfully",
        profile,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "profile update unsuccessful" });
  }
};

export default profileUpdateController;
