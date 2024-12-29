import { Request, Response } from "express";
import { ProductRepository } from "../Repositories/Products";
import Config from "../config";

export class ProductController {
  static async addProduct(req: Request, res: Response) {
    try {
      const data = {
        ...req.body,
        image: req.file?.filename,
      };
      await ProductRepository.addProduct(data);
      return res.status(200).json({ message: "Product added" });
    } catch (error) {
      return res.status(200).json(error);
    }
  }
  static async getProduct(req: Request, res: Response) {
    try {
      const data = await ProductRepository.getProduct([
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            image: { $concat: [Config.PRODUCT_IMAGE, "$image"] },
          },
        },
      ]);
      return res.status(200).json({ message: "Fetched", data });
    } catch (error) {
      return res.status(200).json(error);
    }
  }
  static async updateProduct(req: Request, res: Response) {
    try {
      let data = {
        ...req.body,
      };
      if (req.file) {
        data.image = req.file?.filename;
      }
      console.log(data,"data")
      await ProductRepository.updateProduct(req.params.id, data);
      return res.status(200).json({ message: "Product updated" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async deleteProduct(req: Request, res: Response) {
    try {
      await ProductRepository.deleteProduct(req.params.id);
      return res.status(200).json({ message: "product deleted success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
