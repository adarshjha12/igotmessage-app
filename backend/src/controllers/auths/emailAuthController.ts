import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getOtpEmailHtml } from "../../utils/loadTemplate";
import { User } from "../../models/userModel";
import client from "../../services/redisClient";
import apiInstance from "../../services/brevoClient";

const generateOTP = (): string =>
  Math.floor(1000 + Math.random() * 9000).toString();

const randomNumber = Math.floor(Math.random() * 100000 + 1);
const randomAvatarNums = Math.floor(Math.random() * 1000 + 1);

export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const otp = generateOTP();
  await client.set(`otp:${email}`, otp, {
    "EX": 300,
  }); // expire in 5 min

  const htmlContent = getOtpEmailHtml({ otp });
  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: process.env.EMAIL_FROM!, name: "igotmessage" },
    subject: "Your verification code",
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP email" });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }

  const storedOtp = await client.get(`otp:${email}`);
  if (!storedOtp) {
    return res
      .status(400)
      .json({
        success: false,
        expired: true,
        message: "OTP expired. Please resend.",
      });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  let user = await User.findOne({ email });
  if (!user) {
    // Create new user
    user = new User({
      email,
      verified: true,
      title: "",
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=boy${randomAvatarNums}&mouth=smile&eyes=happy`,
      followers: [],
      following: [],
      fullName: "",
      userName: "user" + randomNumber,
      profilePicture: "",
      coverPhoto: "",
      bio: "",
    });
    await user.save();
  }

  const payload = { id: user._id.toString(), email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res
    .status(200)
    .json({
      success: true,
      message: "OTP verification successful",
      userData: user,
    });
};

export const testRedis = async (req: Request, res: Response): Promise<void> => {
  await client.set("hello", "adarsh");
  const value = await client.get("hello");
  console.log("Redis test value:", value);
  res.send(value || "No value");
};
