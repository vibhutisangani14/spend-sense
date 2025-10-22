import { Expense } from "#models";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import type { z } from "zod";
import type {
  expenseInputSchema,
  expenseSchema,
  populateCategorySchema,
  populateUserSchema,
} from "#schemas";

type ExpenseInputDTO = z.infer<typeof expenseInputSchema>;
type ExpenseDTO = z.infer<typeof expenseSchema>;
type PopulatedUserDTO = z.infer<typeof populateUserSchema>;
type PopulatedCategoryDTO = z.infer<typeof populateCategorySchema>;

export const getAllExpenses: RequestHandler<{}, ExpenseDTO[]> = async (
  req,
  res
) => {
  const allExpenses = await Expense.find()
    .populate<{ categoryId: PopulatedCategoryDTO }>("categoryId")
    .populate<{ userId: PopulatedUserDTO }>("userId")
    .lean();
  res.json(allExpenses);
};

export const createExpense: RequestHandler<
  {},
  ExpenseDTO,
  ExpenseInputDTO
> = async (req, res) => {
  const newExpense = await Expense.create<ExpenseInputDTO>(req.body);
  const populatedExpense = await Expense.findById(newExpense._id)
    .populate<{ categoryId: PopulatedCategoryDTO }>("categoryId")
    .populate<{ userId: PopulatedUserDTO }>("userId")
    .lean<ExpenseDTO>();
  res.json(populatedExpense!);
};

export const getExpenseById: RequestHandler<
  { id: string },
  ExpenseDTO
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const expense = await Expense.findById(id)
    .populate<{ categoryId: PopulatedCategoryDTO }>("categoryId")
    .populate<{ userId: PopulatedUserDTO }>("userId");
  if (!expense)
    throw new Error("Expense not found", { cause: { status: 404 } });
  res.json(expense);
};

export const updateExpenseById: RequestHandler<
  { id: string },
  ExpenseDTO,
  ExpenseInputDTO
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
    new: true,
  })
    .populate<{ categoryId: PopulatedCategoryDTO }>("categoryId")
    .populate<{ userId: PopulatedUserDTO }>("userId");
  if (!updatedExpense)
    throw new Error("Expense not found!", { cause: { status: 404 } });
  res.json(updatedExpense);
};

export const deleteExpenseById: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const found = await Expense.findByIdAndDelete(id);

  if (!found) throw new Error("Expense Not Found", { cause: { status: 404 } });

  res.json({ message: "Expense deleted successfully" });
};
