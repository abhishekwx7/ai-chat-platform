import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

export async function createConversation(userId: string) {
    return prisma.conversation.create({
        data: {
            title: "New Chat",
            userId,
        }
    })
}

export async function getConversations(userId: string) {
    return prisma.conversation.findMany({
        where: {
            userId,
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
}

export async function getConversationById(conversationId: string, userId: string) {
    return prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        }
    })
}

export async function updateConversation(conversationId: string, userId: string, title: string) {
    const result = await prisma.conversation.updateMany({
        where: {
            id: conversationId,
            userId,
        },
        data: {
            title,
        },
    });

    if (result.count == 0) {
        return null;
    }

    return prisma.conversation.findFirst({
        where: {
            id: conversationId,
            userId,
        }
    })
}

export async function deleteConversation(conversationId: string, userId: string) {
    try {
        return await prisma.conversation.delete({
            where: {
                id: conversationId,
                userId,
            }
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
            return null;
        }

        throw error;
    }
}