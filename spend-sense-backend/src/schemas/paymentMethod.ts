import { z } from "zod/v4";
import { dbEntrySchema } from "./shared";

const paymentMethodInputSchema = z.strictObject({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Maximum name length is 255 characters"),
});

const paymentMethodSchema = z.strictObject({
  ...paymentMethodInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { paymentMethodInputSchema, paymentMethodSchema };
