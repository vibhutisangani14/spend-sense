import express from "express";
import { categoryPredictor } from "../services/categoryPredictor";
import { validateBody } from "#middleware";
import { predictedcategoryInputSchema } from "#schemas";

const router = express.Router();

router.post(
  "/predict-category",
  validateBody(predictedcategoryInputSchema),
  async (req, res) => {
    try {
      const { text } = req.body;
      //   if (!text || typeof text !== "string") {
      //     return res.status(400).json({ error: "text is required" });
      //   }

      const prediction = await categoryPredictor(text);
      res.json(prediction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "internal error" });
    }
  }
);

export default router;
