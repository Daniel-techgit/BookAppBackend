import {Schema,model,models} from "mongoose";
const {ObjectId} = Schema

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  dateOfBirth: { type: Date },
  country: { type: String },
  state: { type: String },
  gender: { type: String },
  password: { type: String },
  role: { type: String, default: "user" }, // admin or user
  forgottenPasswordToken:{type :String},
  isVerifiedEmail: { type: Boolean},
  verifyToken: { type: String },
  forgottenPasswordOTP: { type: String },
  forgottenPasswordOTPExpires: { type: Date },
  bookId:{
    type:ObjectId, ref:"Book",
  }
});

const User = models.User || model("User", UserSchema);
export default User;

