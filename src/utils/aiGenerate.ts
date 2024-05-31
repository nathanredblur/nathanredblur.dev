import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD-ay8re1F7pQZQ05F96kWamYd9fGZRQiA";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateText = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
