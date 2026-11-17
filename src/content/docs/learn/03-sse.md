---
title: "读懂 SSE"
description: "Chat Completions 的流是 text/event-stream，以 data: [DONE] 结束。Responses API 用另一套事件名，没有 [DONE]。"
---

`stream: true` 时，Chat Completions 把增量放进 `text/event-stream`。文档写明：每个块是一条 SSE，流以 `data: [DONE]` 结束。一个块长这样：

```text
data: {"choices":[{"delta":{"content":"你"}}]}

data: [DONE]
```

前端已经会用 `response.body`。SSE 只是在这个字节流上再切一次：空行结束一个事件，`data:` 后面是载荷，以 `:` 开头的行是注释。chat-demo 的 `src/services/api/sse.ts` 按 WHATWG 的事件流规则写了一个解码器，本课用一个更短的版本，够读 Chat Completions 的 `delta.content`。

```ts
export interface SseEvent {
  event: string;
  data: string;
}

export function parseSseBlock(block: string): SseEvent | null {
  let event = "message";
  const data: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    if (line === "" || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    if (field === "data") data.push(value);
  }
  if (data.length === 0) return null;
  return { event, data: data.join("\n") };
}

export async function* readContentDeltas(response: Response): AsyncGenerator<string> {
  if (!response.body) throw new Error("响应没有 body");
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const parts = buffer.split(/\r?\n\r?\n/);
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const parsed = parseSseBlock(part);
      if (!parsed || parsed.data.trim() === "[DONE]") {
        if (parsed?.data.trim() === "[DONE]") return;
        continue;
      }
      const json = JSON.parse(parsed.data) as {
        choices?: Array<{ delta?: { content?: string | null; reasoning_content?: string | null } }>;
      };
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
```

完整文件是 `examples/03-sse.ts`。思考模式打开时，增量也可能出现在 `delta.reasoning_content`。这个生成器只产出可见的 `content`，思维链留给后面一课。

Responses API 是另一条流。[使用 Responses API](https://api-docs.deepseek.com/zh-cn/guides/responses_api) 写明：`stream: true` 时每个事件带 `event` 和递增的 `sequence_number`，流以 `response.completed`、`response.incomplete` 或 `response.failed` 结束，**没有** `data: [DONE]`。文本增量的事件名是 `response.output_text.delta`。先把 Chat Completions 读顺，再换那一套事件名。

## 练习

1. 喂给 `parseSseBlock` 一段带注释行 `: keep-alive` 的文本，确认注释被丢掉。
2. 把 `data: [DONE]` 放进 `readContentDeltas` 的上游，确认生成器在这里 return。
3. 列出 Responses API 里你已经知道的三个结束事件。

## 延伸阅读

- [Chat Completions 的流式说明](https://api-docs.deepseek.com/api/create-chat-completion)
- [Responses API](https://api-docs.deepseek.com/guides/responses_api)
- [WHATWG 事件流](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation)
- [chat-demo 的 sse.ts](https://github.com/deepseek-ai/chat-demo/blob/main/src/services/api/sse.ts)
