import { Category } from "#models";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import type { z } from "zod";
import type { categoryInputSchema, categorySchema } from "#schemas";

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryDTO = z.infer<typeof categorySchema>;

export const getAllCategories: RequestHandler<{}, categoryDTO[]> = async (
  req,
  res
) => {
  const categories = await Category.find().lean();
  res.json(categories);
};

export const createCategory: RequestHandler<
  {},
  categoryDTO,
  categoryInputDTO
> = async (req, res) => {
  const newCategory = await Category.create<categoryInputDTO>(req.body);
  res.json(newCategory);
};

export const getCategoryById: RequestHandler<
  { id: string },
  categoryDTO
> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const category = await Category.findById(id);
  if (!category)
    throw new Error("Category not found", { cause: { status: 404 } });

  res.json(category);
};

export const updateCategoryById: RequestHandler<
  { id: string },
  categoryDTO,
  categoryInputDTO
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!category)
    throw new Error("Category not found!", { cause: { status: 404 } });
  res.json(category);
};

export const deleteCategoryById: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const found = await Category.findByIdAndDelete(id);

  if (!found) throw new Error("Category Not Found", { cause: { status: 404 } });

  res.json({ message: "Category deleted successfully" });
};
