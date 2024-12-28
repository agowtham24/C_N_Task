import ProductModel from "../Models/Products";
import { PipelineStage } from "mongoose";
import { AddProduct, UpdateProduct } from "../Dtos/Products";

export class ProductRepository {
  static async addProduct(data: AddProduct) {
    const product = new ProductModel(data);
    await product.save();
    return product;
  }
  static async getProduct<T extends PipelineStage[]>(query: T) {
    const data = await ProductModel.aggregate(query);
    return data;
  }
  static async updateProduct(id: string, data: UpdateProduct) {
    const editProduct = await ProductModel.findByIdAndUpdate(id, data);
    return editProduct;
  }
  static async deleteProduct(id: string) {
    const removeProduct = await ProductModel.findByIdAndDelete(id);
    return removeProduct;
  }
}
