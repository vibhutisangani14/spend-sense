import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        _id: Types.ObjectId;
        name: string;
        email: string;
      };
    }
  }
}

export {};
