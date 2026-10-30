import { useRef, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { createConversation } from "../services/conversationApi";
import { streamMessage, type ChatMessage } from "../services/chatApi";

export function useChat() {
    const [conversationId, setConversationId] = useState<string | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [isStreaming, setIsStreaming] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController>(null)
    const conversationIdRef = useRef<string | null>(null);
    const isSendingRef = useRef(false);

    const sendMessage = async (content: string): Promise<void> => {
        console.log("✅ sendMessage called:", content);

        const trimmedContent = content.trim();

        console.log("Content:", trimmedContent);
        console.log("isSendingRef:", isSendingRef.current);

        if (!trimmedContent || isSendingRef.current) {
            console.log("❌ Request blocked by guard condition");
            return;
        }

        console.log("✅ Passed guard condition");

        isSendingRef.current = true;
        setIsStreaming(true);
        setError(null);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            let activeConversationId = conversationIdRef.current;

            // Create a conversation if one does not exist.
            if (!activeConversationId) {
                console.log("✅ Creating new conversation");

                const conversation = await createConversation(controller.signal);

                if (controller.signal.aborted) return;

                console.log("✅ Conversation created:", conversation);

                activeConversationId = conversation.id;
                conversationIdRef.current = conversation.id;

                setConversationId(conversation.id);
            }

            // Temporary user message for immediate UI feedback.
            const userMessageId = crypto.randomUUID();

            const userMessage: ChatMessage = {
                id: userMessageId,
                content: trimmedContent,
                role: "USER",
                conversationId: activeConversationId,
                createdAt: new Date().toISOString(),
            };

            // Temporary assistant message to accumulate streamed text.
            const assistantMessageId = crypto.randomUUID();

            const assistantMessage: ChatMessage = {
                id: assistantMessageId,
                content: "",
                role: "ASSISTANT",
                conversationId: activeConversationId,
                createdAt: new Date().toISOString(),
            };

            setMessages((previous) => [...previous, userMessage, assistantMessage]);

            const url = `${API_BASE_URL}/api/conversations/` + `${activeConversationId}/messages/stream`;

            await streamMessage({
                url, content: trimmedContent, signal: controller.signal, onUserMessage: (savedMessage) => {
                    setMessages((previous) =>
                        previous.map((message) => message.id === userMessageId ? savedMessage : message)
                    );
                },

                onDelta: (text) => {
                    if (controller.signal.aborted) return;

                    setMessages((previous) => previous.map((message) => message.id === assistantMessageId ? {
                        ...message,
                        content: message.content + text,
                    } : message));
                },

                onDone: (savedMessage) => {
                    if (controller.signal.aborted) return;

                    setMessages((previous) => previous.map((message) => message.id === assistantMessageId ? savedMessage : message));
                },
            })
        } catch (err) {
            console.log("console error:", err);
            if (controller.signal.aborted) {
                return;
            }

            const message = err instanceof Error ? err.message : "Something went wrong!";
            setError(message);
        } finally {
            if (abortControllerRef.current == controller) {
                abortControllerRef.current = null;
            }

            isSendingRef.current = false;
            setIsStreaming(false);
        }
    };

    const stopStreaming = (): void => {
        const controller = abortControllerRef.current;

        if (!controller) return;

        controller.abort();

        setMessages((previous) =>
            previous.filter(
                (message) =>
                    message.role !== "ASSISTANT" ||
                    message.content !== ""
            )
        );
    };

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return {
        conversationId,
        messages,
        isStreaming,
        error,
        sendMessage,
        stopStreaming,
    }
}
