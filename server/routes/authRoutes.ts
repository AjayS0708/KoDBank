import { Router } from "express";
import { AuthController } from "../controllers/AuthController.ts";
import { validate, registerValidation, loginValidation } from "../middleware/validationMiddleware.ts";

const router = Router();

router.post("/register", validate(registerValidation), AuthController.register);
router.post("/login", validate(loginValidation), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
