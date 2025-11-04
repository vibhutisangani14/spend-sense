import { z } from "zod/v4";
import { dbEntrySchema } from "./shared.js";
import { isValidObjectId, Types } from "mongoose";
import { categoryInputSchema } from "./category.js";
import { userInputSchema } from "./users.js";
import { paymentMethodInputSchema } from "./paymentMethod.js";

const expenseInputSchema = z.strictObject({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Maximum name length is 255 characters"),
  amount: z.number().min(0, { message: "Amount must be greater than 0" }),
  categoryId: z
    .string()
    .refine((val) => isValidObjectId(val), "Invalid Category ID"),
  date: z
    .any()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .transform((val) => new Date(val)),
  paymentMethodId: z
    .string()
    .refine((val) => isValidObjectId(val), "Invalid Payment method ID")
    .optional(),
  receipt: z.string().optional(),
  notes: z.string().optional(),
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
const populatePaymentMethodSchema = z.strictObject({
  ...paymentMethodInputSchema.shape,
  _id: z.instanceof(Types.ObjectId),
});

const expenseSchema = z.strictObject({
  ...expenseInputSchema.shape,
  ...dbEntrySchema.shape,
  categoryId: populateCategorySchema,
  userId: populateUserSchema,
  paymentMethodId: populatePaymentMethodSchema,
});

export {
  expenseInputSchema,
  expenseSchema,
  populateCategorySchema,
  populateUserSchema,
  populatePaymentMethodSchema,
};
