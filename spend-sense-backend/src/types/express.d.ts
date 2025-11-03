import { Expense } from "#models";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
      expense?: InstanceType<typeof Expense>;
    }
  }
}

export {};
