import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.delete("/refresh", refresh);

export default router;
