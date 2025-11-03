import jwt from "jsonwebtoken";
import { IUser } from "../models/User.js";
import { getRandomValues } from "crypto";
import { createTokens, setAuthCookies } from "../utils/index.js";

export function generateToken(user: IUser): string {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) throw new Error("JWT_SECRET is missing");
  return jwt.sign({ sub: user._id.toString() }, secret, { expiresIn: "7d" });
}
export { createTokens, setAuthCookies };
