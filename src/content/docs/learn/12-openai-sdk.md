---
title: "用 OpenAI SDK 指向 DeepSeek"
description: "官方示例使用 openai 包，把 baseURL 指到 https://api.deepseek.com。2026-11-17 核对的版本是 7.57.0。"
---

DeepSeek 文档写明 API 与 OpenAI、Anthropic 的格式兼容，改配置就能用对应的 SDK。官方 JavaScript 示例是：

```js
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const completion = await openai.chat.completions.create({
  messages: [{ role: "system", content: "You are a helpful assistant." }],
  model: "deepseek-flash",
  thinking: { type: "enabled" },
  reasoning_effort: "high",
  stream: false,
});
```

2026-11-17 用 `npm view openai version` 看到的版本是 **7.57.0**。这个版本的 `ChatCompletionCreateParamsBase` 有 `reasoning_effort`，类型定义里没有找到 `thinking` 字段。官方示例仍然在传递 `thinking`。运行时 SDK 会把请求体序列化发出去，类型系统则需要一次断言，否则 TypeScript 会拒绝多出来的字段。

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const body = {
  model: "deepseek-flash",
  messages: [{ role: "user" as const, content: "你好" }],
  reasoning_effort: "high" as const,
  stream: false as const,
  thinking: { type: "enabled" as const },
};

export async function sayHello() {
  return client.chat.completions.create(
    body as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  );
}
```

断言只解决编译。字段名以 DeepSeek 文档为准。SDK 升级后如果类型补上了 `thinking`，把断言删掉。

Anthropic 格式的 base URL 是 `https://api.deepseek.com/anthropic`。chat-demo 走的是这条，后面读源码时会看到。

## 练习

1. 安装 `openai@7.57.0`，跑通 `examples/08-openai-sdk.ts`。
2. 去掉断言，看 TypeScript 报的是哪个字段。
3. 把 `stream` 改成 `true`，用 SDK 的异步迭代器打印 `delta.content`。流的结束条件对照 Chat Completions 文档。

## 延伸阅读

- [第一次调用里的 JavaScript 示例](https://api-docs.deepseek.com/)
- [openai 包](https://www.npmjs.com/package/openai)
- [Anthropic 格式说明](https://api-docs.deepseek.com/guides/anthropic_api)
