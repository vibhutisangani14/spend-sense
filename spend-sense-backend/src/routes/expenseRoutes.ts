import { Router } from "express";
import {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpenseById,
  deleteExpenseById,
} from "../controllers/expense";
import { auth } from "../middleware/authMiddleware"; 

const router = Router();

router.use(auth);

router.get("/", getAllExpenses);
router.post("/", createExpense);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

export default router;
