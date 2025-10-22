import { Router } from "express";
import { validateBody } from "#middleware";
import { categoryInputSchema } from "#schemas";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "#controllers";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getAllCategories)
  .post(validateBody(categoryInputSchema), createCategory);
categoryRouter
  .route("/:id")
  .get(getCategoryById)
  .put(validateBody(categoryInputSchema), updateCategoryById)
  .delete(deleteCategoryById);

export default categoryRouter;
