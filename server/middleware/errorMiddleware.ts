import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts";
import logger from "../utils/logger.ts";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} - ${statusCode} - ${message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.path} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
