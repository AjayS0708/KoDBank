import { Router } from "express";
import { BankingController } from "../controllers/BankingController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { validate, transferValidation } from "../middleware/validationMiddleware.ts";

const router = Router();

router.use(authMiddleware);

router.get("/balance", BankingController.getBalance);
router.get("/history", BankingController.getHistory);
router.post("/transfer", validate(transferValidation), BankingController.transfer);

export default router;
