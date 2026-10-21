import { prisma } from "../lib/prisma.js";

export async function createMessage(conversationId: string, userId: string, content: string) {
    const conversation = await prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        },
    });

    if (!conversation) {
        return null;
    }

    const message = await prisma.message.create({
        data: {
            content,
            role: "USER",
            conversationId
        },
    });

    return message;
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