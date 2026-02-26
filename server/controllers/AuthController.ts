import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService.ts";
import logger from "../utils/logger.ts";
import { CONFIG } from "../config/constants.ts";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      logger.info(`User registered: ${user.username}`);
      res.status(201).json({ status: "success", message: "User registered successfully", data: user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req.body.username, req.body.password);
      
      // Set cookies
      res.cookie("accessToken", accessToken, {
        ...CONFIG.COOKIE,
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie("refreshToken", refreshToken, CONFIG.COOKIE);

      logger.info(`User logged in: ${user.username}`);
      res.json({ status: "success", message: "Login successful", data: { user, accessToken, refreshToken } });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);
      
      res.cookie("accessToken", accessToken, {
        ...CONFIG.COOKIE,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, CONFIG.COOKIE);

      res.json({ status: "success", data: { accessToken, refreshToken: newRefreshToken } });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (refreshToken) await AuthService.logout(refreshToken);
      
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ status: "success", message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  }
}
