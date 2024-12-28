import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class OrderValidator {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        customerName: Joi.string().required(),
        productId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message("ProductId must be a valid MongoDB ObjectId")
          .required(),
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
