import { Request } from "express";

declare global {
  namespace Express {
    interface User{
      googleId?: string
      email?: string
      title?: string
      avatar?: string
    }

    interface Request {
      user?: User; 
    }
  }
}

export {}