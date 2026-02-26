import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts";
import logger from "../utils/logger.ts";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} - ${statusCode} - ${message}`);
  } else {
    logger.warn(`${req.method} ${req.path} - ${statusCode} - ${message}`);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
