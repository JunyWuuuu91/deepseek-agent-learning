---
title: "一个会生长的消息列表"
description: "助手消息先占一个空位，然后把 SSE 的增量追加进去。发送中的按钮要禁用。"
---

聊天界面是一份列表加一个输入框。发送时做三件事：把用户的话推进列表，立刻放一条空的助手消息，然后把增量写进最后一条。空的助手消息就是加载态，列表不会在第一个字到来之前停在旧状态。

停止按钮拿着这一次的 `AbortController`。组件卸载或用户点停止时 abort，`for await` 会抛出 `AbortError`。这个错误是用户的操作，不要把它显示成红色警报。

```tsx
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
```

`streamReply` 由调用方注入。测试时让它产出两个字；接上节的 `readContentDeltas` 时，它才去打 API。密钥仍然留在发请求的那一层，这个组件不读 `process.env`。

每次 `setMessages` 都复制数组，再替换最后一条。直接改 `last.content += delta` 会绕过 React 的更新。字很多时可以再加一帧合并，那是体验课的事，先把正确的状态写对。

## 练习

1. 写一个 `streamReply`，依次 yield「你」「好」。确认列表里先出现空助手消息，再变成「你好」。
2. 在第一个字之前点停止。确认没有 `role="alert"` 的错误，输入框可以再次发送。
3. 连点两次发送。第二次应该被 `pending` 挡住。

## 延伸阅读

- [MDN：ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
- [MDN：AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)
- [chat-demo 的回复区](https://github.com/deepseek-ai/chat-demo/blob/main/src/components/messages/ReplyArea.tsx)
