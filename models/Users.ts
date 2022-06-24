import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../interfaces";
import { allowedRoles } from "../database/constant";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false, minlength: 6 },
    image: { type: String },
    role: {
      type: String,
      default: "client",
      emum: {
        values: allowedRoles,
        message: "{VALUE} no es un rol válido",
      },
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const UserModel: Model<IUser> = mongoose.models?.User || mongoose.model("User", UserSchema);

export default UserModel;
