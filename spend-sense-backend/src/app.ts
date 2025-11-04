import "#db";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "#middleware";
import cookieParser from "cookie-parser";
import { router } from "services";

import {
  categoryRouter,
  userRouter,
  expenseRouter,
  paymentMethodRouter,
  predictRouter,
} from "#routers";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(express.json(), cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
// Routes
app.use("/api", predictRouter);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/paymentMethods", paymentMethodRouter);
app.use("/api/chat", router);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
