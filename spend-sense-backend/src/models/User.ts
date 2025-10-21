import {
  Schema,
  model,
  Document,
  CallbackWithoutResultAndOptionalError,
  Types,
} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId; // ← add this
  name: string;
  email: string;
  password: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true }
);

// userSchema.index({ email: 1 }, { unique: true });

userSchema.pre(
  "save",
  async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
);

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = model<IUser>("user", userSchema);
export default User;
