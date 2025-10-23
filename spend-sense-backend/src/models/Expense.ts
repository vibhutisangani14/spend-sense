import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category Id is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Category Id is required"],
    },
    paymentMethodId: {
      type: Schema.Types.ObjectId,
      ref: "paymentMethod",
      required: false,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const Expense = model("expense", expenseSchema);

export default Expense;
