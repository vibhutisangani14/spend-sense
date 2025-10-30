import "#db";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "#middleware";
import cookieParser from "cookie-parser";
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
    origin: process.env.CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ["WWW-Authenticate"], // needed to send the 'refresh trigger''
  })
);
app.use(express.json(), cookieParser());
// Routes
app.use("/api", predictRouter);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/paymentMethods", paymentMethodRouter);

// ✅ Fallback route for unknown paths
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

export default app;
