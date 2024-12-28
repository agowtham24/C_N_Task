import mongoose, { Schema, Document } from "mongoose";

interface UserSchema extends Document {
  name: string;
  email: string;
  password: string;
  loginCount?: number;
  role: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
}

const userSchema = new Schema<UserSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginCount: { type: Number, default: 0 },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId },
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
