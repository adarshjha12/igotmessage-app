import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId | string;  
      googleId?: string | null;
      isGuest?: boolean
      email?: string | null;
      phoneNo?: number | null;
      title?: string | null;
      avatar?: string | null;
      verified?: boolean;
      followers?: Types.ObjectId[];
      following?: Types.ObjectId[];
      fullName?: string | null;
      userName?: string | null;
      profilePicture?: string | null;
      coverPhoto?: string | null;
      bio?: string | null;
    }
  }
}

export {};
