import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.ts";
import { isValidObjectId, Types } from "mongoose";
import { categoryInputSchema } from "./category.ts";
import { userInputSchema } from "./users.ts";

const expenseInputSchema = z.strictObject({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Maximum name length is 255 characters"),
  amount: z.number().min(0, { message: "Amount must be greater than 0" }),
  categoryId: z
    .string()
    .refine((val) => isValidObjectId(val), "Invalid Category ID"),
  date: z.date({
    error: (issue) => (issue.input === undefined ? "Required" : "Invalid date"),
  }),
  userId: z.string().refine((val) => isValidObjectId(val), "Invalid User ID"),
});

const populateCategorySchema = z.strictObject({
  ...categoryInputSchema.shape,
  _id: z.instanceof(Types.ObjectId),
});
const populateUserSchema = z.strictObject({
  ...userInputSchema.shape,
  _id: z.instanceof(Types.ObjectId),
});
const expenseSchema = z.strictObject({
  ...expenseInputSchema.shape,
  ...dbEntrySchema.shape,
  categoryId: populateCategorySchema,
  userId: populateUserSchema,
});

export {
  expenseInputSchema,
  expenseSchema,
  populateCategorySchema,
  populateUserSchema,
};
