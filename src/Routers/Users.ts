import { Router } from "express";
import { UserController } from "../Controllers/Users";
import { UserValidator } from "../Validators/Users";
import { Jwt } from "../Utils/Jwt";
const userRouter = Router();
userRouter.post(
  "/",
  Jwt.verifyToken,
  UserValidator.createUser,
  UserController.createUser
);
userRouter.get("/", Jwt.verifyToken, UserController.getAllUsers);
userRouter.post("/login", UserValidator.login, UserController.login);
export default userRouter;
