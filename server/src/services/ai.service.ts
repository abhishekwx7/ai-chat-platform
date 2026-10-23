import { openai } from "../lib/openai.js";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
}

const MODEL = process.env.OPEN_MODEL;

if (!MODEL) {
    throw new Error("OPEN_MODEL is missing from .env")
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

export async function* streamAIResponse(
    messages: ChatMessage[]
): AsyncGenerator<string> {
    const stream = await openai.responses.create({
        model: MODEL,
        input: messages,
        max_output_tokens: 300,
        store: false,
        stream: true,
    });

    for await (const event of stream) {
        if (event.type === "response.output_text.delta") {
            yield event.delta;
        }

        if (event.type === "response.failed") {
            throw new Error(
                event.response.error?.message ??
                "AI response generation failed"
            );
        }

        if (event.type === "response.incomplete") {
            throw new Error(
                `AI response incomplete: ${event.response.incomplete_details?.reason ?? "unknown"
                }`
            );
        }
    }
}