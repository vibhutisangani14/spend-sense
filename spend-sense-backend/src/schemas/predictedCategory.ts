import { z } from "zod/v4";
import { dbEntrySchema } from "./shared";

const predictedcategoryInputSchema = z.strictObject({
  text: z.string().min(1, "text is required"),
});

const predictedCategorySchema = z.strictObject({
  ...predictedcategoryInputSchema.shape,
  ...dbEntrySchema.shape,
});

export { predictedcategoryInputSchema, predictedCategorySchema };
