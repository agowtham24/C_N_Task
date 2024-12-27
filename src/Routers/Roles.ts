import { Router } from "express";
import { RoleController } from "../Controllers/Roles";
import { RoleValidator } from "../Validators/Roles";

const roleRouter = Router();
roleRouter.post("/", RoleValidator.createRole, RoleController.CreateRole);
roleRouter.get("/", RoleController.getAllRoles);
export default roleRouter;
