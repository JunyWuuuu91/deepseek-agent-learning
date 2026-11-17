---
title: "检索、记忆和会话不是一回事"
description: "会话是这一次的 messages。检索是你在请求前查到的几段文本。本课没有找到 DeepSeek 的嵌入接口。"
---

三件容易被叫成「记忆」的事，在系统里的位置不同。

会话是 `messages` 数组。它在上下文窗口里，模型这一次能看见。窗口满了，旧内容就得被你丢掉或压缩。

检索是请求发出之前的一次查询。你从自己的笔记里找出几段，拼进 `user` 或 `system`。模型并不知道你的数据库，它只看见你拼进去的字。这就是人们说的 RAG：检索增强生成。检索失败时，模型会用它训练里的印象来补，所以界面要能看出「这段回答引用了哪条笔记」。

跨会话还在的笔记，是你的存储。它可以是一张表、一个文件，或一个 MCP 工具背后的数组。它不会因为开了新聊天就自动出现，除非有人或有代码去读它。

2026-11-17 拉取的 [api-docs 站点地图](https://api-docs.deepseek.com/sitemap.xml) 里有聊天、Responses、文件、语音、OCR 和搜索，没有名为 embeddings 的端点。所以这一课不发明一个嵌入 API，用字符串包含来做一份能跑的检索。它能教你数据怎么进提示词，不能代替向量库。

```ts
export interface Note {
  id: string;
  text: string;
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return notes
    .map((note) => ({
      note,
      score: terms.filter((term) => note.text.toLowerCase().includes(term)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.note);
}

const found = searchNotes(
  [
    { id: "a", text: "登录按钮在窄屏溢出" },
    { id: "b", text: "缓存命中要整段前缀相同" },
  ],
  "按钮 窄屏",
);
console.log(found.map((note) => note.id).join(","));
```

Harness 文档里有现成的记忆服务器接法，其中 `@modelcontextprotocol/server-memory@2026.7.4` 被写成一个本地知识图谱，搜索是大小写不敏感的子串匹配，文档明确说它没有嵌入、没有自动摘要。那和本课的 `searchNotes` 是同一类东西。

## 练习

1. 查询「缓存 前缀」，确认只返回笔记 b。
2. 把命中的笔记用固定格式拼进 `user`：`资料 a：…`。没有命中时，提示词里写「没有笔记」，不要让模型自由发挥来源。
3. 读 Harness 的记忆指南，指出哪一句说明那个参考服务器不是语义检索。

## 延伸阅读

- [Harness：接入第三方记忆 MCP](https://deepseek-harness.github.io/deepseek-harness/en/guide/mcp-memory)
- [api-docs 站点地图](https://api-docs.deepseek.com/sitemap.xml)
- [上下文缓存](https://api-docs.deepseek.com/guides/kv_cache)
