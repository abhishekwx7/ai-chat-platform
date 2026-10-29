import { useState, type SubmitEvent } from "react";
import { useChat } from "../hooks/useChat";
import "../App.css";

function Chat() {
  const [input, setInput] = useState("");

  const {
    conversationId,
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
  } = useChat();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("✅ Form submitted");

    const content = input.trim();

    console.log("Message:", content);
    console.log("Streaming status:", isStreaming);

    if (!content || isStreaming) return;

    setInput("");

    console.log("✅ Calling sendMessage");

    void sendMessage(content);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#191C22] text-white">
      {/* Header */}
      <header className="border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold">AI Chat Platform</h1>
        {conversationId && (
          <p className="mt-1 text-xs text-gray-400">
            Conversation: {conversationId}
          </p>
        )}
      </header>

      {/* Chat Messages */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-8">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <h2 className="text-2xl font-medium text-gray-400">
              Hello, how can i help you today?
            </h2>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap 
                break-words rounded-2xl px-4 py-3 ${message.role === "USER" ? "bg-[#30343D]" : "bg-[#242830]"}`}
            >
              {message.content || (
                <span className="animate-pulse text-gray-400">Thinking...</span>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Error Message */}
      {error && (
        <div className="mx-auto w-full max-w-3xl">
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Message Input */}
      <footer className="border-t border-gray-400 p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Anything..."
            disabled={isStreaming}
            className="flex-1 rounded-xl border border-gray-700 bg-[#242830] 
            px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-500"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="rounded-xl bg-red-500 px-5 py-3 font-medium text-white transition hover:bg-red-600"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-white px-5 py-3 font-medium text-black 
              transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}

export default Chat;
