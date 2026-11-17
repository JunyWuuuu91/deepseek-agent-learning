---
title: "Vercel AI SDK 的位置"
description: "2026-11-17 的 ai@7.0.173 与 @ai-sdk/deepseek@3.0.87 使用 createDeepSeek 和 streamText。密钥留在服务端路由。"
---

Vercel AI SDK 把「调用模型」和「在 React 里消费流」拆开。模型供应商是 `@ai-sdk/deepseek`，对话钩子在 `@ai-sdk/react`，核心类型在 `ai`。

2026-11-17 核对的 dist-tag `latest` 是：

| 包 | 版本 |
| --- | --- |
| `ai` | 7.0.173 |
| `@ai-sdk/deepseek` | 3.0.87 |
| `@ai-sdk/react` | 4.0.177 |

这三个版本在依赖上对齐到 `@ai-sdk/provider@4.0.38`。`@ai-sdk/deepseek` 还有 `ai-v6`、`ai-v5` 这些 dist-tag。装错主版本时，类型会对不上。以锁文件为准，不要只抄旧文章里的 `import { deepseek } from "@ai-sdk/deepseek"`。当前包同时导出 `deepSeek`、`deepseek` 和 `createDeepSeek`。

服务端这一小段把 UI 消息转成模型消息再流回去。它必须跑在有密钥的进程里。

```ts
import { createDeepSeek } from "@ai-sdk/deepseek";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export async function POST(request: Request): Promise<Response> {
  const { messages } = (await request.json()) as { messages: UIMessage[] };
  const result = streamText({
    model: deepseek("deepseek-flash"),
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

浏览器侧用 `useChat`。`@ai-sdk/react@4.0.177` 的返回值里有 `sendMessage`、`messages`、`status`、`stop` 和 `error`。默认传输是 `DefaultChatTransport`，`api` 默认是 `/api/chat`。

```tsx
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
```

消息正文在 `parts` 里，`type === "text"` 的那一段才是字。工具调用会以别的 part 出现，第 10 部分再画出来。

供应商文档的能力表把 `deepseek-flash` 的图像输入标成不支持。DeepSeek 定价页则把 `deepseek-flash` 的 Vision 标成支持。两页都是 2026-11-17 读到的，本课没有发一张真实图片去裁决。做图像功能时以 [Vision 指南](https://api-docs.deepseek.com/guides/vision) 和一次真实请求为准，不要只看 SDK 表格。

同一份 SDK 文档还写着：`deepseek-chat` 和 `deepseek-reasoner` 在 2026-07-24 退役。这个日期来自 AI SDK 文档，本课没有在 api-docs.deepseek.com 上独立核对到同一句话。当前官方第一课列出的模型名是 `deepseek-flash` 和 `deepseek-v4-pro`。

## 练习

1. 用上面三个精确版本装一套练习项目，确认 `createDeepSeek` 能被导入。
2. 把 `DEEPSEEK_API_KEY` 只放在服务端。在浏览器源码里搜这个变量，结果应该是空的。
3. 读供应商文档的模型表，把和定价页不一致的那一格记在你自己的笔记里。

## 延伸阅读

- [AI SDK 的 DeepSeek 供应商](https://ai-sdk.dev/providers/ai-sdk-providers/deepseek)
- [DeepSeek 定价页的能力表](https://api-docs.deepseek.com/quick_start/pricing)
- [Vision](https://api-docs.deepseek.com/guides/vision)
