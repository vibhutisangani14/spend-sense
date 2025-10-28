import { Router } from "express";
import { validateBody } from "#middleware";
import { expenseInputSchema } from "#schemas";
import { authenticate, hasRole } from "#middleware";
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
  .get(authenticate, getAllExpenses)
  .post(authenticate, validateBody(expenseInputSchema), createExpense);
expenseRouter
  .route("/:id")
  .get(authenticate, getExpenseById)
  .put(authenticate, validateBody(expenseInputSchema), updateExpenseById)
  .delete(authenticate, deleteExpenseById);

export default expenseRouter;
