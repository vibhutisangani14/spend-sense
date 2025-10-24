import { Router } from "express";
import { validateBody } from "#middleware";
import { expenseInputSchema } from "#schemas";
import {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpenseById,
  deleteExpenseById,
} from "#controllers";

const expenseRouter = Router();

expenseRouter
  .route("/")
  .get(getAllExpenses)
  .post(validateBody(expenseInputSchema), createExpense);
expenseRouter
  .route("/:id")
  .get(getExpenseById)
  .put(validateBody(expenseInputSchema), updateExpenseById)
  .delete(deleteExpenseById);

export default expenseRouter;
