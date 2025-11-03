import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.delete("/logout", logout);
authRoutes.delete("/refresh", refresh);

export default authRoutes;
