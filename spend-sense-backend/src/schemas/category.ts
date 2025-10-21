import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.ts";

const categoryInputSchema = z.strictObject({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Maximum name length is 255 characters"),
});

const categorySchema = z.strictObject({
  ...categoryInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { categoryInputSchema, categorySchema };
