import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface User {
      _id?: Types.ObjectId | string;  
      googleId?: string | null;
      email?: string | null;
      phoneNo?: number | null;
      title?: string | null;
      avatar?: string | null;
      verified?: boolean;
      followers?: Types.ObjectId[];
      following?: Types.ObjectId[];
      posts?: Types.ObjectId[];
      stories?: Types.ObjectId[];
      reels?: Types.ObjectId[];
      chats?: Types.ObjectId[];
      calls?: Types.ObjectId[];
      username?: string | null;
      profilePicture?: string | null;
      bio?: string | null;
    }
  }
}

export {};
