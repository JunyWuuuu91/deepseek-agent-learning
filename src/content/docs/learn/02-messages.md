---
title: "多轮对话由你保管"
description: "messages 是你自己的数组。每一轮都把系统消息、用户消息和上一次的助手消息原样再送回去。"
---

多轮对话在协议上就是一个数组。角色用过的有 `system`、`user`、`assistant`，后面工具章节还会加上 `tool`。官方多轮文档的形状是：第一轮只有用户的话；第二轮把助手刚才的 `content` 追加进去，再追加新的用户消息。

这和 React 里把列表放进 state 再渲染是同一件事。服务器收到的是这一次的完整数组，它不会去翻你上一笔请求的内存。你把数组放在组件 state、放进数据库，或者像 chat-demo 那样放进 IndexedDB，都是你的存储，不是模型的存储。

缓存也跟着这个数组走。上下文缓存文档的例子是：第二轮的前缀如果完整等于第一轮的输入，这段前缀可以记成缓存命中。你在数组中间插入一条新的系统消息，前缀就变了，命中会从那一段断开。

```ts
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function createThread(system: string): ChatMessage[] {
  return [{ role: "system", content: system }];
}

export function pushTurn(messages: ChatMessage[], user: string, assistant: string): ChatMessage[] {
  return [
    ...messages,
    { role: "user", content: user },
    { role: "assistant", content: assistant },
  ];
}

const first = createThread("你是一位前端导师，回答短于 80 字。");
const second = pushTurn(first, "上下文窗口是什么？", "它是这一次请求能放进模型的文本预算。");
console.log(second.length);
```

思考模式打开时，流里还会出现 `reasoning_content`。官方思考模式示例在第二轮把 `reasoning_content` 放回助手消息，并注明这段会被 API 忽略。可见的 `content` 才是要继续往下传的回答。不要把思维链当成必须保存的业务数据。

## 练习

1. 用 `pushTurn` 接三轮，打印每一轮数组的长度。它应该是 1、3、5、7。
2. 故意丢掉上一轮的 `assistant`，只保留新的 `user`。写一句这对模型意味着什么。
3. 读一遍[多轮对话](https://api-docs.deepseek.com/guides/multi_round_chat)，对照你拼出来的数组。

## 延伸阅读

- [多轮对话](https://api-docs.deepseek.com/guides/multi_round_chat)
- [思考模式](https://api-docs.deepseek.com/guides/thinking_mode)
- [上下文缓存](https://api-docs.deepseek.com/guides/kv_cache)
