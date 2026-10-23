import { prisma } from "../lib/prisma.js";
import { generateAIResponse } from "./ai.service.js";

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