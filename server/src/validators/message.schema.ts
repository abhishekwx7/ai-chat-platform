import { z } from "zod";

export const createMessageSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(10000, "Message is too long"),
});