import { Request, Response } from "express";
import { OrderRepository } from "../Repositories/Orders";

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      await OrderRepository.addOrder(req.body);
      return res.status(200).json({ message: "Order created success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async getOrder(req: Request, res: Response) {
    try {
      const data = await OrderRepository.getOrder([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            customerName: 1,
            status: 1,
            product: 1,
          },
        },
      ]);
      return res.status(200).json({ message: "fetched", data });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async updateOrder(req: Request, res: Response) {
    try {
      await OrderRepository.updateOrder(req.params.id, req.body);
      return res.status(200).json({ message: "order updated success" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async deleteOrder(req: Request, res: Response) {
    try {
      await OrderRepository.deleteOrder(req.params.id);
      return res.status(200).json({ message: "Order deleted success" });
    } catch (error) {
      return res.status(200).json(error);
    }
  }
}
