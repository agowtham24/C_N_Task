import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class ProductValidator {
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Joi.object({
        name: Joi.string().required().messages({
          "string.empty": "Name is required.",
        }),
        description: Joi.string().required().messages({
          "string.empty": "Description is required.",
        }),
        price: Joi.number().required().messages({
          "number.base": "Price must be a number.",
          "any.required": "Price is required.",
        }),
      });
      const { error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ errors: error.details.map((detail) => detail.message) });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required." });
      }
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: `Invalid image type. Allowed types: ${allowedMimeTypes.join(
            ", "
          )}`,
        });
      }

      if (req.file.size > maxSizeInBytes) {
        return res.status(400).json({
          message: "Image size must not exceed 5 MB.",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
