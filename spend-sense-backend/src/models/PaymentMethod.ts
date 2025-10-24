import { Schema, model } from "mongoose";

const paymentMethodSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const PaymentMethod = model("paymentMethod", paymentMethodSchema);

export default PaymentMethod;
