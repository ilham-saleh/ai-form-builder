import { Router } from "express";

import { regsister, login, logout, me } from "./auth.controller.js";

import { requireAuth } from "../../middleware/require-auth.js";

const router = Router();

router.post("/register", regsister);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAuth, me);

export default router;
