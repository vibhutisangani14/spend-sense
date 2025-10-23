import "#db";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "#middleware";
import {
  categoryRouter,
  userRouter,
  expenseRouter,
  paymentMethodRouter,
} from "#routers";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/paymentMethods", paymentMethodRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

export default app;
