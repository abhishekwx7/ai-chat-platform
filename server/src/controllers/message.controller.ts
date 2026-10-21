import { Request, Response } from "express";
import { createMessageSchema } from "../validators/message.schema.js";
import { createMessage, getMessages } from "../services/message.service.js";

export async function createMessageController(
    req: Request,
    res: Response
) {
    const userId = res.locals.user.id;
    const conversationId = req.params.conversationId as string;

    const parsed = createMessageSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid message data",
            errors: parsed.error.flatten(),
        });
    }

    const message = await createMessage(
        conversationId,
        userId,
        parsed.data.content
    );

    if (!message) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }

    return res.status(201).json({
        message: "Message created successfully",
        data: message,
    });
}

export async function getMessagesController(
    req: Request,
    res: Response
) {
    const userId = res.locals.user.id;
    const conversationId = req.params.conversationId as string;

    const messages = await getMessages(conversationId, userId);

    if (messages === null) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }

    return res.status(200).json({
        message: "Messages fetched successfully!",
        messages,
    });
}