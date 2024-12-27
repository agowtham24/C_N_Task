import { Request, Response } from "express";
import { RoleRepository } from "../Repositories/Roles";

export class RoleController {
  static async CreateRole(req: Request, res: Response) {
    try {
      await RoleRepository.addRole(req.body);
      return res.status(200).json({ message: "Role Created Successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async getAllRoles(req: Request, res: Response) {
    try {
      const data = await RoleRepository.getRole([
        {
          $project: {
            role: 1,
            pagePermissions: 1,
          },
        },
      ]);
      return res.status(200).json({ message: "Fetched roles", data });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
