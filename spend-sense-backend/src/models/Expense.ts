import { Schema, model, Document, Types } from "mongoose";

export interface IExpense extends Document {
  title: string;
  amount: number;
  categoryId: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  paymentMethod?: string;
  notes?: string;
}

const expenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category", 
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    date: { type: Date, required: true },
    paymentMethod: { type: String, default: "Cash" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const Expense = model<IExpense>("Expense", expenseSchema);
export default Expense;
