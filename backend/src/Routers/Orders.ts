import { Router } from "express";
import { OrderController } from "../Controllers/Orders";
import { OrderValidator } from "../Validators/Orders";

const orderRouter = Router();

orderRouter.post("/", OrderValidator.createOrder, OrderController.createOrder);
orderRouter.get("/", OrderController.getOrder);
orderRouter.patch("/:id", OrderController.updateOrder);
orderRouter.delete("/:id", OrderController.deleteOrder);

export default orderRouter;
