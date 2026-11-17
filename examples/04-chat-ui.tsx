import { useRef, useState, type FormEvent } from "react";
import type { ChatMessage } from "./02-messages";

export function ChatPane({
  streamReply,
}: {
  streamReply: (messages: ChatMessage[], signal: AbortSignal) => AsyncGenerator<string>;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || pending) return;
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setDraft("");
    setPending(true);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      for await (const delta of streamReply(history, controller.signal)) {
        setMessages((current) => {
          const copy = [...current];
          const last = copy.at(-1);
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { ...last, content: last.content + delta };
          }
          return copy;
        });
      }
    } catch (caught) {
      if (!(caught instanceof DOMException && caught.name === "AbortError")) {
        setError(caught instanceof Error ? caught.message : "请求失败");
      }
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)}>
      <ol>
        {messages.map((message, index) => (
          <li key={`${message.role}-${index}`}>
            {message.role === "user" ? "你" : "模型"}：{message.content || (pending ? "…" : "")}
          </li>
        ))}
      </ol>
      {error ? <p role="alert">{error}</p> : null}
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
      <button type="submit" disabled={pending || draft.trim() === ""}>
        发送
      </button>
      <button type="button" disabled={!pending} onClick={() => abortRef.current?.abort()}>
        停止
      </button>
    </form>
  );
}
