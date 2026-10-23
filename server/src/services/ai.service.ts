import { openai } from "../lib/openai.js";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
}

export async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
    const response = await openai.responses.create({
        model: process.env.OPENAIMODEL || "gpt-6-luna",
        input: messages,
        reasoning: { effort: "low" },
        max_output_tokens: 300,
        store: false,
    });

    const text = response.output_text;

    if (!text) {
        throw new Error("AI returned an empty response");
    }

    return text;
}