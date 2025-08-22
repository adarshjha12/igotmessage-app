import { Request, Response } from "express";

const logOut = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.authToken;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "no token provided" });
  }  

  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export default logOut;