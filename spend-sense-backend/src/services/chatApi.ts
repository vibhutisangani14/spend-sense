import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Expense {
  category: string;
  amount: number;
  [key: string]: any;
}

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.post("/", async (req: Request, res: Response) => {
  const { question } = req.body as { question: string };

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    // Fetch expense data
    const expenseResponse = await fetch("http://localhost:3000/api/expenses", {
      headers: {
        cookie: req.headers.cookie || "", // forward cookies from client request
      },
    });
    if (!expenseResponse.ok) {
      throw new Error(`Expense API error: ${expenseResponse.statusText}`);
    }
    const expenses: Expense[] = await expenseResponse.json();

    // Generate Gemini response
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a personal finance assistant.
      Here are the user's recent expenses:
      ${JSON.stringify(expenses, null, 2)}

      The user asks: "${question}"

      Provide a short, clear, actionable answer.
    `;

    const result = await model.generateContent(prompt);
    const output = await result.response.text();

    res.json({ response: output });
  } catch (err) {
    console.error("Gemini or Expense API error:", err);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

export default router;
