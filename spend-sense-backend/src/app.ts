import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db/index";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5174", // frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const port = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
};

startServer();
