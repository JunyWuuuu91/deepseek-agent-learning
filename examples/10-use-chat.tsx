import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, type FormEvent } from "react";

export function SdkChat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [draft, setDraft] = useState("");
  const busy = status === "submitted" || status === "streaming";

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    void sendMessage({ text });
    setDraft("");
  }

  return (
    <form onSubmit={onSubmit}>
      <ol>
        {messages.map((message) => (
          <li key={message.id}>
            {message.role}：
            {message.parts.map((part, index) =>
              part.type === "text" ? <span key={index}>{part.text}</span> : null,
            )}
          </li>
        ))}
      </ol>
      {error ? <p role="alert">{error.message}</p> : null}
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit" disabled={busy}>
        发送
      </button>
      <button type="button" onClick={() => stop()}>
        停止
      </button>
    </form>
  );
}
