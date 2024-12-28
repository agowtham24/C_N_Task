import mongoose, { Schema, Document } from "mongoose";

interface ProductSchema extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
}

const productSchema = new Schema<ProductSchema>({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  image: { type: String },
});
const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
