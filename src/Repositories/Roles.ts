import RolesModel from "../Models/Roles";
import { PipelineStage } from "mongoose";
import { AddRole, UpdateRole } from "../Dtos/Roles";

export class RoleRepository {
  static async addRole(data: AddRole) {
    const role = new RolesModel(data);
    await role.save();
    return role;
  }
  static async getRole<T extends PipelineStage[]>(query: T) {
    const data = await RolesModel.aggregate(query);
    return data;
  }
  static async updateRole(id: string, data: UpdateRole) {
    const editRole = await RolesModel.findByIdAndUpdate(id, data);
    return editRole;
  }
  static async deleteRole(id: string) {
    const removeRole = await RolesModel.findByIdAndDelete(id);
    return removeRole;
  }
}
