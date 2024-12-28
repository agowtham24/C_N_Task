import OrderModel from "../Models/Orders";
import { PipelineStage } from "mongoose";
import { AddOrder, UpdateOrder } from "../Dtos/Orders";

export class OrderRepository {
  static async addOrder(data: AddOrder) {
    const order = new OrderModel(data);
    await order.save();
    return order;
  }
  static async getOrder<T extends PipelineStage[]>(query: T) {
    const data = await OrderModel.aggregate(query);
    return data;
  }
  static async updateOrder(id: string, data: UpdateOrder) {
    const editOrder = await OrderModel.findByIdAndUpdate(id, data);
    return editOrder;
  }
  static async deleteOrder(id: string) {
    const removeOrder = await OrderModel.findByIdAndDelete(id);
    return removeOrder;
  }
}
