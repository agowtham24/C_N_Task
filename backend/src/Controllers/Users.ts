import { Request, Response } from "express";
import { UserRepository } from "../Repositories/Users";
import { RoleRepository } from "../Repositories/Roles";
import { MongoDB } from "../mongoDB-setup";
import { Bcrypt } from "../Utils/Bcrypt";
import { Jwt } from "../Utils/Jwt";

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const isExistingRole = await RoleRepository.getRole([
        {
          $match: { _id: await MongoDB.convertToObjectId(req.body.role) },
        },
        {
          $project: {
            role: 1,
          },
        },
      ]);
      if (isExistingRole.length === 0)
        return res.status(404).json({ message: "Role not found" });
      req.body.password = await Bcrypt.hashPassword(req.body.password);
      if (req.body.ownerId === "") {
        delete req.body.ownerId;
      }
      console.log(req.body, "req.body");
      await UserRepository.addUser(req.body);
      return res.status(200).json({ message: "User added successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async getAllUsers(req: Request, res: Response) {
    try {
      const { role, uoid } = req.user as any;
      let data;
      const roleData = await RoleRepository.getRole([
        {
          $match: { _id: await MongoDB.convertToObjectId(role) },
        },
        {
          $project: {
            role: 1,
          },
        },
      ]);
      if (roleData[0].role === "Admin") {
        data = await UserRepository.getUser([
          {
            $lookup: {
              from: "roles",
              localField: "role",
              foreignField: "_id",
              as: "userRole",
            },
          },
          { $unwind: "$userRole" },
          {
            $project: {
              name: 1,
              email: 1,
              role: 1,
              roleName: "$userRole.role",
              pagePermissions: "$userRole.pagePermissions",
            },
          },
        ]);
      } else if (roleData[0].role === "Manager") {
        data = await UserRepository.getUser([
          {
            $match: { ownerId: await MongoDB.convertToObjectId(uoid) },
          },
          {
            $lookup: {
              from: "roles",
              localField: "role",
              foreignField: "_id",
              as: "userRole",
            },
          },
          { $unwind: "$userRole" },
          {
            $project: {
              name: 1,
              email: 1,
              roleName: "$userRole.role",
              pagePermissions: "$userRole.pagePermissions",
            },
          },
        ]);
      }
      // console.log(data,"data")
      return res.status(200).json({ message: "Users Fetched", data });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const isExistingUser = await UserRepository.getUser([
        {
          $match: { email },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "Role",
          },
        },
        { $unwind: "$Role" },
        {
          $project: {
            permissions: "$Role.pagePermissions",
            password: 1,
            loginCount: 1,
            name: 1,
            email: 1,
            role: 1,
            roleName: "$Role.role",
          },
        },
      ]);
      if (isExistingUser.length === 0)
        return res.status(404).json({ message: "No user found on that email" });
      const isPasswordMatched = await Bcrypt.comparePassword(
        password,
        isExistingUser[0].password
      );
      if (!isPasswordMatched)
        return res.status(404).json({ message: "Password mismatched" });

      const loginCount = isExistingUser[0].loginCount + 1;
      await UserRepository.updateUser(isExistingUser[0]._id, { loginCount });
      const token = await Jwt.generateToken({
        email: isExistingUser[0].email,
        role: isExistingUser[0].role,
        uoid: isExistingUser[0]._id,
      });
      return res.status(200).json({
        message: "Login Successful",
        token,
        role: isExistingUser[0].roleName,
        permissions: isExistingUser[0].permissions,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  static async deleteUser(req: Request, res: Response) {
    try {
      await UserRepository.deleteUser(req.params.id);
      return res.status(200).json({ message: "User deleted Success" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
