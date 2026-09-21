import jwt, { type JwtPayload } from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

export const createToken = (userId: string) => {
  return jwt.sign(
    {
      sub: userId,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

  if (!decoded.sub || typeof decoded.sub !== "string") {
    throw new Error("Invalid token");
  }

  return decoded.sub;
};
