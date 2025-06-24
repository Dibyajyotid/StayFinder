import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateAvatar,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.patch("/avatar", protectRoute, updateAvatar);

router.get("/check", protectRoute, checkAuth);

export default router;
