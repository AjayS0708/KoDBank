import dotenv from "dotenv";
import logger from "../utils/logger.ts";

dotenv.config();

const requiredEnv = ["JWT_SECRET", "JWT_REFRESH_SECRET"];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    logger.error(`FATAL: Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

export const CONFIG = {
  PORT: 3000,
  JWT: {
    ACCESS_SECRET: process.env.JWT_SECRET!,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_EXPIRY: "15m",
    REFRESH_EXPIRY: "7d",
  },
  COOKIE: {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const, // Required for iframe preview
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  SECURITY: {
    BCRYPT_ROUNDS: 12,
    RATE_LIMIT_WINDOW: 15 * 60 * 1000,
    RATE_LIMIT_MAX: 100,
  }
};
