import mongoose, { Schema, Document } from "mongoose";

interface OrderSchema extends Document {
  customerName: string;
  productId: mongoose.Schema.Types.ObjectId;
  status: string;
}

const orderSchema = new Schema<OrderSchema>({
  customerName: { type: String },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  status: { type: String, default: "PENDING" },
});
const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
