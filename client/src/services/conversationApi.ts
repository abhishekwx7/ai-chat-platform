import { API_BASE_URL } from "../config/api";

export interface Conversation {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateConversationResponse {
    message: string;
    conversation: Conversation;
}

export async function createConversation(
    signal?: AbortSignal
): Promise<Conversation> {
    const response = await fetch(
        `${API_BASE_URL}/api/conversations`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
            signal,
        }
    );

    if (response.status === 401) {
        throw new Error("Session expired. Please sign in again.");
    }

    if (!response.ok) {
        throw new Error(
            `Failed to create conversation: ${response.status}`
        );
    }

    const data: CreateConversationResponse =
        await response.json();

    return data.conversation;
}
