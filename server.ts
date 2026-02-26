import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./server/routes/authRoutes.ts";
import bankingRoutes from "./server/routes/bankingRoutes.ts";
import { errorMiddleware } from "./server/middleware/errorMiddleware.ts";
import logger from "./server/utils/logger.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

async function startServer() {
  const app = express();

  // Trust proxy for express-rate-limit (required behind nginx)
  app.set("trust proxy", 1);

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev
  }));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
  });
  app.use("/api/", limiter);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/banking", bankingRoutes);

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Error Handling (Must be last)
  app.use(errorMiddleware);

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
