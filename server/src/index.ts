import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { prisma } from "./lib/prisma.js";
import authRouter from "./features/auth/auth.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      status: "ok",
      message: "Connected",
      userCount,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.get("/api/health/db", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      status: "ok",
      database: "connected",
      userCount,
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
