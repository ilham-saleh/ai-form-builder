import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../lib/jwt.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const userId = verifyToken(token);

    req.userId = userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired authentication",
    });
  }
};
