import { GoogleGenAI, Type } from "@google/genai";
import { MatrixQuestion } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const matrixQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation of the logic behind the matrix pattern in Uzbek."
    },
    grid: {
      type: Type.ARRAY,
      description: "A 9-element array representing the 3x3 grid. The last element should be '?' representing the missing piece.",
      items: { type: Type.STRING }
    },
    options: {
      type: Type.ARRAY,
      description: "An array of 6 possible answers as strings. One of them is correct.",
      items: { type: Type.STRING }
    },
    correctOptionIndex: {
      type: Type.INTEGER,
      description: "The 0-based index of the correct answer in the 'options' array."
    }
  },
  required: ["reasoning", "grid", "options", "correctOptionIndex"]
};


export const generateMatrixQuestion = async (difficulty: number): Promise<MatrixQuestion> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    return Promise.resolve({
        reasoning: "Namunaviy Savol: Shakl har bir qadamda soat mili bo'yicha 90 darajaga aylanadi.",
        grid: ["↑", "→", "↓", "←", "↑", "→", "↓", "←", "?"],
        options: ["↑", "→", "↓", "←", "↖", "↘"],
        correctOptionIndex: 0
    });
  }
  
  try {
    const prompt = `
      Generate a 3x3 matrix reasoning problem with a difficulty level of ${difficulty}/10.
      The problem should consist of simple geometric shapes, patterns, or logical progressions.
      The last cell (bottom right) must be the missing element, represented by '?'.
      Provide a brief explanation of the underlying logic in the Uzbek language.
      The output must be a JSON object adhering to the provided schema.
      The grid items and options can be simple characters or emojis that represent shapes or patterns.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: matrixQuestionSchema
      },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);

    // Basic validation
    if (
      !parsedJson.grid || parsedJson.grid.length !== 9 ||
      !parsedJson.options || parsedJson.options.length !== 6 ||
      typeof parsedJson.correctOptionIndex !== 'number'
    ) {
      throw new Error("Invalid question format received from API.");
    }

    return parsedJson as MatrixQuestion;

  } catch (error) {
    console.error("Error generating matrix question:", error);
    // Fallback to a mock question on API error
    return {
      reasoning: "API Xatoligi: Har bir qadamda soat mili bo'yicha harakatlanib, yangi chorakka doira qo'shiladi.",
      grid: ["⚫️", "⚪️", "⚪️", "⚫️", "⚫️", "⚪️", "⚫️", "⚫️", "?"],
      options: ["⚫️", "⚪️", "🔵", "🔴", "⚫️⚫️⚫️⚫️", "⚪️⚪️⚪️⚪️"],
      correctOptionIndex: 4,
    };
  }
};