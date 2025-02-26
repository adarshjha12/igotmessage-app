import { Request } from "express";
import { IUser } from "../models/userModel";

declare global {
  namespace Express {
    interface User extends IUser{}

    interface Request {
      user?: User; 
    }
  }
}

export {}