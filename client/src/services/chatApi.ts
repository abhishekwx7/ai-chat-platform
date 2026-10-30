// Types matching your backend response

export interface ChatMessage {
    id: string;
    content: string;
    role: "USER" | "ASSISTANT";
    conversationId: string;
    createdAt: string;
}

interface StreamMessageOptions {
    url: string;
    content: string;
    onUserMessage?: (message: ChatMessage) => void;
    onDelta?: (text: string) => void;
    onDone?: (message: ChatMessage) => void;
    onError?: (message: string) => void;
    signal?: AbortSignal;
}

export async function streamMessage({
    url,
    content,
    onUserMessage,
    onDelta,
    onDone,
    onError,
    signal,
}: StreamMessageOptions): Promise<void> {
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        },
        body: JSON.stringify({ content }),
        signal,
    });

    if (response.status === 401) {
        throw new Error("Session expired. Please sign in again.");
    }

    if (response.status === 403) {
        throw new Error("You don't have access to this conversation.");
    }

    if (!response.ok) {
        throw new Error(`Streaming request failed: ${response.status}`);
    }

    if (!response.body) {
        throw new Error("Reponse body is missing");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let completed = false;

    const handleEvent = (rawEvent: string): void => {
        let eventName = "message";
        const dataLines: string[] = [];

        for (const line of rawEvent.split("\n")) {
            if (line.startsWith("event:")) {
                eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trimStart());
            }
        }

        if (dataLines.length === 0) return;

        const data: unknown = JSON.parse(dataLines.join("\n"));

        switch (eventName) {
            case "user_message": {
                onUserMessage?.(data as ChatMessage);
                break;
            }

            case "delta": {
                const payload = data as { text: string };
                onDelta?.(payload.text);
                break;
            }

            case "done": {
                const payload = data as {
                    assistantMessage: ChatMessage;
                };

                completed = true;
                onDone?.(payload.assistantMessage);
                break;
            }

            case "error": {
                const paylaod = data as { message: string };
                onError?.(paylaod.message);
                throw new Error(paylaod.message);
            }
        }
    };

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Support CRLF and LF, even across network chunks.
            buffer = buffer.replace(/\r\n/g, "\n");

            let separatorIndex: number;

            while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
                const rawEvent = buffer.slice(0, separatorIndex);

                buffer = buffer.slice(separatorIndex + 2);

                handleEvent(rawEvent);
            }
        }

        buffer += decoder.decode();

        if (buffer.trim()) {
            handleEvent(buffer);
        }

        if (!completed) {
            throw new Error("Stream ended before completion")
        }
    } finally {
        reader.releaseLock();
    }
}