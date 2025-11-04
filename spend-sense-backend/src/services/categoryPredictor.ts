import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

type Category = { _id: string; name: string };
type Prediction = {
  categoryId: string;
  categoryName: string;
  confidence: number;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const BASE_API_URL = process.env.BASE_API_URL!;

/** Fetch all categories from your existing API */
let cachedCategories: Category[] | null = null;
async function getCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  const res = await fetch(`${BASE_API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  cachedCategories = (await res.json()) as Category[];
  return cachedCategories;
}

/** Predict category using Gemini */
export async function categoryPredictor(text: string): Promise<Prediction> {
  const categories = await getCategories();
  const categoryList = categories
    .map((c) => `- ${c.name} (ID: ${c._id})`)
    .join("\n");

  const prompt = `
You are a financial assistant that classifies expense descriptions.
Choose ONE category from the list below.

List of categories:
${categoryList}

If the description does not fit any category, choose "Other".

Return JSON ONLY in this exact format:
{
  "categoryId": "<use the ID from the list above>",
  "categoryName": "<use the corresponding category name>",
  "confidence": 0.0-1.0
}

Description: "${text}"
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);

  let raw = result.response.text().trim();

  // Remove markdown fences if present
  raw = raw
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(raw);

    const match = categories.find((c) => c._id === parsed.categoryId);

    if (!match) {
      return {
        categoryId: "uncategorized",
        categoryName: "Uncategorized",
        confidence: 0,
      };
    }

    return {
      categoryId: match._id,
      categoryName: match.name,
      confidence: parsed.confidence ?? 0.8,
    };
  } catch (err) {
    console.error("Failed to parse AI output:", raw);
    return {
      categoryId: "uncategorized",
      categoryName: "Uncategorized",
      confidence: 0,
    };
  }
}
