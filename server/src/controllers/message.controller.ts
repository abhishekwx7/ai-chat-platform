import { Request, Response } from "express";
import { createMessageSchema } from "../validators/message.schema.js";
import { createMessage, getMessages, streamMessages } from "../services/message.service.js";


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

    const result = await createMessage(
        conversationId,
        userId,
        parsed.data.content
    );

    if (!result) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }

    return res.status(201).json({
        message: "Message created and AI response generated",
        data: result,
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

export async function streamMessageController(req: Request, res: Response) {
    const userId = res.locals.user.id;
    const conversationId = req.params.conversationId as string;

    const parsed = createMessageSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Invalid message data",
            errors: parsed.error.flatten(),
        });
    }

    const result = await streamMessages(conversationId, userId, parsed.data.content, res);

    if (!result && !res.headersSent) {
        return res.status(404).json({
            message: "Conversation not found",
        });
    }
}