import OpenAI from "openai";

const { OPEN_AI_API_KEY } = process.env;

export const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
