import {
  Schema,
  model,
  Document,
  CallbackWithoutResultAndOptionalError,
  Types,
} from "mongoose";
import bcrypt from "bcryptjs";

/**
 *  TypeScript interface
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  roles: string[];
  comparePassword(candidate: string): Promise<boolean>;
}

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
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
    roles: {
      type: [String],
      default: ["user"],
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook → hash password before saving
 */
userSchema.pre(
  "save",
  async function (this: IUser, next: CallbackWithoutResultAndOptionalError) {
    try {
      if (!this.isModified("password")) return next();

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err as any);
    }
  }
);

/**
 *  Password comparison method
 */
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = model<IUser>("user", userSchema);
export default User;
