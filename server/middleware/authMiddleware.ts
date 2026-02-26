import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.ts";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access-secret-123";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired access token"));
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied: Insufficient permissions"));
    }
    next();
  };
};
