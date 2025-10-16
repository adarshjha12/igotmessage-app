import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/userModel';

interface UserPayload {
  id?: number;
  email?: string;
}

export const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.authToken;  

  if (!token) {
    console.log('no token provided');
    return res.status(401).json({ success: false, message: 'no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    const verifiedUser = await User.findOne({_id: decoded.id});

    if (!verifiedUser) {
      return res.status(401).json({ success: false, message: 'invalid token provided' });
    }

    console.log('user is authorized');
    return res.status(200).json({ success: true, message: 'user verified successfully', userData: verifiedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'server side error' });
  }
};
