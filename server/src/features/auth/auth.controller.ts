import type { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../../lib/prisma.js";
import { createToken } from "../../lib/jwt.js";
import { resgisterSchema, loginSchema } from "./auth.schema.js";

const COOKIE_NAME = "auth_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const regsister = async (req: Request, res: Response) => {
  try {
    const result = resgisterSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid registration details",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { name, email: rawEmail, password } = result.data;

    const email = rawEmail.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = createToken(user.id);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.log("Register error", error);

    return res.status(500).json({
      message: "Unable to create account",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid login details",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const email = result.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createToken(user.id);

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      message: "Unable to login",
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.json({
    message: "Logged out successfully",
  });
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "Authentication is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "User no longer exists",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Unable to retrieve user",
    });
  }
};
