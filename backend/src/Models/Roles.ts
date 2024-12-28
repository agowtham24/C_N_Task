import mongoose, { Schema, Document } from "mongoose";

interface RoleSchema extends Document {
  role: string;
  pagePermissions: string[];
}

const roleSchema = new Schema<RoleSchema>({
  role: { type: String, required: true },
  pagePermissions: { type: [String], required: true },
});
const RolesModel = mongoose.model("Role", roleSchema);
export default RolesModel;
