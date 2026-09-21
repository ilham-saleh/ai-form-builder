import { z } from "zod";

export const resgisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  password: z.string().min(8, "Password must be at leaast 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});
