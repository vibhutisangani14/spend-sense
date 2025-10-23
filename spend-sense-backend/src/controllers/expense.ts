import { Expense } from "#models";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import type { z } from "zod";
import type { expenseInputSchema, expenseSchema } from "#schemas";

type ExpenseInputDTO = z.infer<typeof expenseInputSchema>;
type ExpenseDTO = z.infer<typeof expenseSchema>;

export const getAllExpenses: RequestHandler = async (req, res) => {
  try {
    const allExpenses = await Expense.find()
      .populate("categoryId")
      .populate("userId")
      .lean();

    res.json(allExpenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

export const createExpense: RequestHandler = async (req, res) => {
  try {
    console.log("Received body:", req.body);

    if (!req.body.categoryId) {
      req.body.categoryId = "652f83caa8b9d0f9e9d2b001";
    }

    if (req.userId) {
      req.body.userId = req.userId;
    } else if (!req.body.userId) {
      req.body.userId = "652f83caa8b9d0f9e9d2b002";
    }

    if (!req.body.title || !req.body.amount || !req.body.date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newExpense = await Expense.create(req.body);

    const populatedExpense = await Expense.findById(newExpense._id)
      .populate("categoryId")
      .populate("userId")
      .lean();

    res.status(201).json(populatedExpense);
  } catch (err: any) {
    console.error("Error creating expense:", err.message);
    res.status(400).json({ message: err.message || "Bad Request" });
  }
};

export const getExpenseById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const expense = await Expense.findById(id)
      .populate("categoryId")
      .populate("userId")
      .lean();

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    res.json(expense);
  } catch (err) {
    console.error("Error fetching expense by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateExpenseById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("categoryId")
      .populate("userId")
      .lean();

    if (!updatedExpense)
      return res.status(404).json({ message: "Expense not found" });

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpenseById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "Invalid ID" });

    const found = await Expense.findByIdAndDelete(id);
    if (!found) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error" });
  }
};
