import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

type Category = { id: string; name: string };
type Prediction = {
  categoryId: string;
  categoryName: string;
  confidence: number;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/** Fetch all categories from your existing API */
let cachedCategories: Category[] | null = null;
async function getCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  const res = await fetch("http://localhost:3000/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  cachedCategories = (await res.json()) as Category[];
  return cachedCategories;
}

/** Predict category using Gemini */
export async function categoryPredictor(text: string): Promise<Prediction> {
  const categories = await getCategories();
  const categoryList = categories.map((c) => c.name).join(", ");

  const prompt = `
You are a financial assistant that classifies expense descriptions.
Choose ONE category name from this list only:
${categoryList}

Return JSON ONLY like this:
{"category":"<category name>","confidence":0.0-1.0}

Description: "${text}"
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);

  const raw = result.response.text();
  console.log("Gemini raw:", raw);

  try {
    const parsed = JSON.parse(raw.trim());
    const match = categories.find(
      (c) => c.name.toLowerCase() === parsed.category.toLowerCase()
    );

    if (!match)
      return {
        categoryId: "uncategorized",
        categoryName: "Uncategorized",
        confidence: 0,
      };

    return {
      categoryId: match.id,
      categoryName: match.name,
      confidence: parsed.confidence ?? 0.8,
    };
  } catch {
    // If Gemini output is not valid JSON, fallback
    return {
      categoryId: "uncategorized",
      categoryName: "Uncategorized",
      confidence: 0,
    };
  }
}
