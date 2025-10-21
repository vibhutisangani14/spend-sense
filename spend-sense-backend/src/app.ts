import "#db";
import express from "express";
import { errorHandler } from "#middleware";
import { categoryRouter, userRouter, expenseRouter } from "#routers";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/expenses", expenseRouter);

app.use("*splat", (req, res) => {
  throw new Error("Not found", { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
