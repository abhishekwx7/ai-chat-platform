import { Request, Response } from "express";
import { createConversation, getConversations } from "../services/conversation.service.js";

export async function createConversationController(_req: Request, res: Response) {
    const userId = res.locals.user.id;

    const conversation = await createConversation(userId);

    res.status(201).json({
        message: "Conversation created successfully!",
        conversation,
    })
}

export async function getConversationsController(_req: Request, res: Response) {
    const userId = res.locals.user.id;

    const conversations = await getConversations(userId);

    res.status(201).json({
        conversations,
    })
}