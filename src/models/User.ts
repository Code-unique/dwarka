import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, default: "" },
    address: { type: String, required: false, default: "" },
    phone: { type: String, required: false, default: "" },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String, default: '' }

  },
  { timestamps: true }
);

export default models.User || model("User", userSchema);
