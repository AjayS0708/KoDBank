import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.ts";

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const firstError = errors.array()[0].msg;
    next(new ApiError(400, firstError));
  };
};

export const registerValidation = [
  body("username").isString().isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  body("phone").optional({ checkFalsy: true }).isMobilePhone("any").withMessage("Invalid phone number"),
];

export const loginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const transferValidation = [
  body("receiverUsername").notEmpty().withMessage("Receiver username is required"),
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
  body("description").optional().isString().isLength({ max: 255 }).withMessage("Description too long"),
];
