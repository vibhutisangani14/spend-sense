import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { createTokens, setAuthCookies } from "utils";
import { RefreshToken } from "#models";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    if (err?.code === 11000)
      return res.status(409).json({ message: "Email already in use" });
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    await RefreshToken.deleteMany({ userId: user._id });

    // const token = generateToken(user);
    const [refreshToken, accessToken] = await createTokens(user);

    setAuthCookies(res, refreshToken, accessToken);

    return res.json({
      accessToken,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function refresh(req: Request, res: Response) {
  // get refreshToken from request cookies
  const { refreshToken } = req.cookies;

  // if there is no refresh token throw a 401 error with an appropriate message
  if (!refreshToken)
    throw new Error("Refresh token required", { cause: { status: 401 } });

  // query the DB for a RefreshToken that has a token property that matches the refreshToken
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
  }).lean();

  // if no storedToken is found, throw a 403 error with an appropriate message
  if (!storedToken)
    throw new Error("Refresh token not found", { cause: { status: 403 } });

  // delete the storedToken from the DB
  await RefreshToken.findByIdAndDelete(storedToken._id);

  // query the DB for the user with _id that matches the userId of the storedToken
  const user = await User.findById(storedToken.userId).lean();

  // if not user is found, throw a 403 error
  if (!user) throw new Error("User not found", { cause: { status: 403 } });
  // create new tokens with util function
  const [newRefreshToken, newAccessToken] = await createTokens(user);

  // set auth cookies with util function
  setAuthCookies(res, newRefreshToken, newAccessToken);

  // send generic success response in body of response
  res.json({ message: "Refreshed" });
}

export async function logout(req: Request, res: Response) {
  // get refreshToken from request cookies
  const { refreshToken } = req.cookies;

  // if there is a refreshToken cookie, delete corresponding RefreshToken from the DB
  if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken });
  // clear the refreshToken cookie
  res.clearCookie("refreshToken");

  // clear the accessToken cookie
  res.clearCookie("accessToken");
  // send generic success message in response body
  res.json({ message: "Successfully logged out" });
}
