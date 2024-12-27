import UserModel from "../Models/Users";
import { AddUser, UpdateUser } from "../Dtos/Users";
import { PipelineStage } from "mongoose";

export class UserRepository {
  static async addUser(data: AddUser) {
    const user = new UserModel(data);
    await user.save();
    return user;
  }
  static async getUser<T extends PipelineStage[]>(query: T) {
    const data = await UserModel.aggregate(query);
    return data;
  }
  static async updateUser(id: string, data: UpdateUser) {
    const editUser = await UserModel.findByIdAndUpdate(id, data);
    return editUser;
  }
  static async deleteUser(id: string) {
    const removeUser = await UserModel.findByIdAndDelete(id);
    return removeUser;
  }
}
