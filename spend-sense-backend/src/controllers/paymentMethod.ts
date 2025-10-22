import { PaymentMethod } from "#models";
import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import type { z } from "zod";
import type { paymentMethodInputSchema, paymentMethodSchema } from "#schemas";

type paymentMethodInputDTO = z.infer<typeof paymentMethodInputSchema>;
type paymentMethodDTO = z.infer<typeof paymentMethodSchema>;

export const getAllPaymentMethods: RequestHandler<
  {},
  paymentMethodDTO[]
> = async (req, res) => {
  const paymentMethods = await PaymentMethod.find().lean();
  res.json(paymentMethods);
};

export const createPaymentMethod: RequestHandler<
  {},
  paymentMethodDTO,
  paymentMethodInputDTO
> = async (req, res) => {
  const newPaymentMethod = await PaymentMethod.create<paymentMethodInputDTO>(
    req.body
  );
  res.json(newPaymentMethod);
};

export const getPaymentMethodById: RequestHandler<
  { id: string },
  paymentMethodDTO
> = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const paymentMethod = await PaymentMethod.findById(id);
  if (!paymentMethod)
    throw new Error("Payment method not found", { cause: { status: 404 } });

  res.json(paymentMethod);
};

export const updatePaymentMethodById: RequestHandler<
  { id: string },
  paymentMethodDTO,
  paymentMethodInputDTO
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const paymentMethod = await PaymentMethod.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!paymentMethod)
    throw new Error("Payment method not found!", { cause: { status: 404 } });
  res.json(paymentMethod);
};

export const deletePaymentMethodById: RequestHandler<
  { id: string },
  { message: string }
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    throw new Error("Invalid ID", { cause: { status: 400 } });

  const found = await PaymentMethod.findByIdAndDelete(id);

  if (!found)
    throw new Error("Payment method Not Found", { cause: { status: 404 } });

  res.json({ message: "Payment method deleted successfully" });
};
