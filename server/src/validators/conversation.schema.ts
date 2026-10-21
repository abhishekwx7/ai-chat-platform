import { z } from "zod";

export const updateConversationsSchema = z.object({
    title: z.string().trim().min(1, "Title cannot be empty").max(100, "Ttile cannot exceed 100 characters"),
});