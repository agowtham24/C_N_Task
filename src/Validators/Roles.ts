import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class RoleValidator {
  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        role: Joi.string().required(),
        pagePermissions: Joi.array().items(Joi.string().required()).required(),
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
