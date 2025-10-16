import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET!;
const redirectUrl =
  process.env.NODE_ENV === 'production'
    ? `${process.env.PROD_FRONTEND_URL}/dash/feed`
    : `${process.env.DEV_FRONTEND_URL}/dash/feed`;

export const handleGoogleRedirect = async (req: Request, res: Response) => {
  try {
    const userInDb = await User.findOne({ googleId: req.user?.googleId });

    const payload = {
      id: userInDb?.id,
      email: userInDb?.email,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
};
