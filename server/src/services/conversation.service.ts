import { prisma } from "../lib/prisma.js";

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