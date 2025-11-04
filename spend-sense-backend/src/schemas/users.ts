import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.js";

const userInputSchema = z.strictObject({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Maximum name length is 255 characters"),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 6 characters long"),
});

const userSchema = z.strictObject({
  ...userInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { userInputSchema, userSchema };
