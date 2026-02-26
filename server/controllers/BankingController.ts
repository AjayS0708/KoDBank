import { Response, NextFunction } from "express";
import { BankingService } from "../services/BankingService.ts";

export class BankingController {
  static async transfer(req: any, res: Response, next: NextFunction) {
    try {
      const { receiverUsername, amount, description } = req.body;
      const result = await BankingService.transfer(req.user.id, receiverUsername, amount, description);
      res.json({ status: "success", message: "Transfer completed", data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req: any, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await BankingService.getHistory(req.user.id, page, limit);
      res.json({ status: "success", data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getBalance(req: any, res: Response, next: NextFunction) {
    try {
      const balance = await BankingService.getBalance(req.user.id);
      res.json({ status: "success", data: { balance } });
    } catch (err) {
      next(err);
    }
  }
}
