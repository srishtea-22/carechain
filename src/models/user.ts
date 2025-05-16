import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  address: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: String,
});

const User = models.User || model("User", UserSchema);
export default User;
