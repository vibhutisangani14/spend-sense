import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../models/User";

type SafeUser = { _id: Types.ObjectId; name: string; email: string };

export async function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });

  try {
    const token = h.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
    };
    req.userId = payload.sub;

    const u = await User.findById(payload.sub)
      .select("_id name email")
      .lean<SafeUser>();
    if (!u) return res.status(401).json({ message: "User not found" });

    req.user = u; // u is SafeUser, not null
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
