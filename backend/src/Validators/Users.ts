import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class UserValidator {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(7).max(15).required(),
        role: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("Role must be a valid MongoDB ObjectId")
          .required(),
        ownerId: Joi.string().allow("").optional(), // comment this while adding admin
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error)
        return res
          .status(400)
          .json(error.details.map((detail) => detail.message));
      next();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(7).max(15).required(),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error)
        return res
          .status(400)
          .json(error.details.map((detail) => detail.message));
      next();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
