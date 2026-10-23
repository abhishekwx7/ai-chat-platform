import { prisma } from "../lib/prisma.js";
import { generateAIResponse } from "./ai.service.js";
import { streamAIResponse } from "./ai.service.js";
import type { Response } from "express";

export async function createMessage(conversationId: string, userId: string, content: string) {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
        select: {
            id: true,
        }
    });

    if (!conversation) {
        return null;
    }

    // 2. Save the new user message
    const userMessage = await prisma.message.create({
        data: {
            content,
            role: "USER",
            conversationId
        },
    });

    // 3. Fetch the conversation history
    const history = await prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: [
            { createdAt: "asc" },
            { id: "asc" },
        ],
    });

    // 4. Convert database messages into OpenAI format
    const messages = history.map((message) => ({
        role: message.role == "USER" ? "user" as const : "assistant" as const,
        content: message.content,
    }));

    // 5. Generate response using conversation history
    const aiResponse = await generateAIResponse(messages);

    // 6. Save assistant response
    const assistantMessage = await prisma.message.create({
        data: {
            content: aiResponse,
            role: "ASSISTANT",
            conversationId,
        },
    });

    return {
        userMessage,
        assistantMessage,
    }
}

export async function getMessages(conversationId: string, userId: string) {

    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
        select: {
            id: true,
        },
    });

    if (!conversation) {
        return null;
    }

    const messages = await prisma.message.findMany({
        where: {
            conversationId,
        },
        orderBy: [
            { createdAt: "asc" },
            { id: 'asc' },
        ],
    });

    return messages;
}

export async function streamMessages(conversationId: string, userId: string, content: string, res: Response) {
    // 1. Verify conversation ownership 
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
        select: {
            id: true
        }
    });

    if (!conversation) {
        return false;
    }

    // 2. Save user message
    const userMessage = await prisma.message.create({
        data: {
            content,
            role: "USER",
            conversationId,
        },
    });

    // 3. Fetch conversation history
    const history = await prisma.message.findMany({
        where: { conversationId },
        orderBy: [
            { createdAt: "asc" },
            { id: "asc" },
        ],
    });

    const messages = history.map((messages) => ({
        role: messages.role === "USER" ? "user" as const : "assistant" as const,
        content: messages.content,
    }));

    // 4. Start streaming response to clinet
    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendEvent = (event: string, data: unknown) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent("user_message", userMessage);

    let fullResponse = "";

    try {
        // 5. Stream text chunks
        for await (const chunk of streamAIResponse(messages)) {
            if (res.destroyed) {
                break;
            }

            fullResponse += chunk;
            sendEvent("delta", { text: chunk })
        }

        if (res.destroyed) {
            return true;
        }

        // 6. Save assistant response
        if (!fullResponse) {
            throw new Error("AI returned an empty response");
        }

        const assistantMessage = await prisma.message.create({
            data: {
                content: fullResponse,
                role: "ASSISTANT",
                conversationId,
            },
        });

        // 7. Notify client of completion
        sendEvent("done", { assistantMessage });
    } catch (error) {
        console.error("Streaming failed: ", error);

        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
        }

        if (!res.destroyed) {
            sendEvent("error", {
                message: "Failed to generate AI response",
            });
        }
    } finally {
        if (!res.destroyed) {
            res.end();
        }
    }

    return true;
}
