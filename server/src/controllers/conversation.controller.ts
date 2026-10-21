import { Request, Response } from "express";
import { createConversation, getConversationById, getConversations, updateConversation, deleteConversation } from "../services/conversation.service.js";
import { updateConversationsSchema } from "../validators/conversation.schema.js"

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

export async function getConversationByIdController(
    req: Request<{ id: string }>,
    res: Response
) {
    const userId = res.locals.user.id;
    const conversationId = req.params.id;

    const conversation = await getConversationById(
        conversationId,
        userId
    );

    if (!conversation) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }

    return res.status(200).json({ conversation });
}

export async function updateConversationController(req: Request<{ id: string }>, res: Response) {
    const userId = res.locals.user.id;
    const conversationId = req.params.id;

    const validation = updateConversationsSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid conversation data",
            errors: validation.error.flatten(),
        });
    }

    const { title } = validation.data;

    const conversation = await updateConversation(conversationId, userId, title);

    if (!conversation) {
        return res.status(404).json({
            message: "Conversation not found!",
        })
    }

    return res.status(200).json({
        message: "Conversation updated successfully!",
        conversation,
    })
}

export async function deleteConversationController(
    req: Request<{ id: string }>,
    res: Response
) {
    const userId = res.locals.user.id;
    const conversationId = req.params.id;

    const conversation = await deleteConversation(
        conversationId,
        userId
    );

    if (!conversation) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }

    return res.status(200).json({
        message: "Conversation deleted successfully!",
    });
}