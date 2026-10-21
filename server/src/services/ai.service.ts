import { openai } from "../lib/openai.js";

export async function generateAIResponse(prompt: string): Promise<string> {
    const response = await openai.responses.create({
        model: process.env.OPENAIMODEL || "gpt-6-luna",
        input: prompt,
        max_output_tokens: 300,
        store: false,
    });

    const text = response.output_text;

    if (!text) {
        throw new Error("AI returned an empty response");
    }

    return text;
}