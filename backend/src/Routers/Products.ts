import { Router } from "express";
import { ProductController } from "../Controllers/Products";
import multer from "multer";
import { ProductValidator } from "../Validators/Products";

const productRouter = Router();
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/products");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const upload = multer({
  storage: Storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5 MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
});
productRouter.post("/", upload.single("image"), ProductController.addProduct);
productRouter.get("/", ProductController.getProduct);
productRouter.patch(
  "/:id",
  upload.single("image"),
  ProductController.updateProduct
);
productRouter.delete("/:id", ProductController.deleteProduct);
export default productRouter;
