import { Router } from "express";
import { validateBody } from "#middleware";
import { paymentMethodInputSchema } from "#schemas";
import {
  getAllPaymentMethods,
  createPaymentMethod,
  getPaymentMethodById,
  updatePaymentMethodById,
  deletePaymentMethodById,
} from "#controllers";

const paymentMethodRouter = Router();

paymentMethodRouter
  .route("/")
  .get(getAllPaymentMethods)
  .post(validateBody(paymentMethodInputSchema), createPaymentMethod);
paymentMethodRouter
  .route("/:id")
  .get(getPaymentMethodById)
  .put(validateBody(paymentMethodInputSchema), updatePaymentMethodById)
  .delete(deletePaymentMethodById);

export default paymentMethodRouter;
