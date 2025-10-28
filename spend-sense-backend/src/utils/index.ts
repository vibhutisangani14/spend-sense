import type { Response, CookieOptions } from "express";
import type { Types } from "mongoose";
import { RefreshToken } from "#models";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

type UserData = {
  roles: string[];
  _id: Types.ObjectId;
};

const createTokens = async (userData: UserData): Promise<[string, string]> => {
  //refresh token
  const refreshToken = randomUUID();

  await RefreshToken.create({ token: refreshToken, userId: userData._id });

  //sign the token
  const payload = { roles: userData.roles };
  const secret = process.env.JWT_SECRET!;
  const tokenOptions = {
    expiresIn: 15 * 60,
    subject: userData._id.toString(),
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  return [refreshToken, accessToken];
};

const setAuthCookies = (
  res: Response,
  refreshToken: string,
  accessToken: string
) => {
  // add access token to cookie
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    secure: isProduction,
  };

  // could work if using a private subdomain (one you registered on cloudflare or a similar service)
  // if (isProduction) cookieOptions.domain = '.onrender.com';

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, cookieOptions);
};

export { createTokens, setAuthCookies };
