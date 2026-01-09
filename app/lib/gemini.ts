import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY as string
);
//gemini-2.5-flash
export const geminiModel = genAi.getGenerativeModel({
  model: "gemini-2.5-flash",
});