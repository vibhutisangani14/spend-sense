import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

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

    const token = generateToken(user);
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}
