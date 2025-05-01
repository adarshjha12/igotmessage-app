import { Request } from "express";

declare global {
  namespace Express {
    interface User{
      googleId: string | null;
      email: string | null;
      title: string | null;
      avatar: string | null;
    }

    interface Request {
      user?: User; 
    }
  }
}

export {}