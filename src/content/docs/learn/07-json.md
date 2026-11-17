---
title: "让模型交一份 JSON"
description: "response_format 设为 json_object，提示词里写上 json 和例子，并处理空白 content。"
---

很多前端任务要的不是一段散文，而是一份能 `JSON.parse` 的对象：工单标题、分类、下一步按钮的文案。DeepSeek 的 JSON Output 用 `response_format: { type: "json_object" }` 约束输出是合法的 JSON 字符串。

文档要求同时做四件事：

1. 设置 `response_format`。
2. 在系统或用户消息里出现单词 json，并给出一份例子。
3. 把 `max_tokens` 留够，避免 JSON 写到一半被截断。
4. 如果输出认不出 JSON，API 会把非 JSON 换成空格。`content` 可能看起来是空的，`finish_reason` 仍可能是 `stop`。空内容要重试或改提示，不能当成解析成功。

这和工具调用的 strict 模式不是同一个开关。strict 约束的是函数参数的 JSON Schema，而且要走 `https://api.deepseek.com/beta`。这一课先拿到一个 JSON 对象。

```ts
export {};

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error("缺少 DEEPSEEK_API_KEY");

const response = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "deepseek-flash",
    messages: [
      {
        role: "system",
        content: [
          "把用户的话拆成 JSON。",
          '示例：{"title":"登录按钮溢出","area":"移动端"}',
        ].join("\n"),
      },
      { role: "user", content: "手机上的登录按钮超出屏幕了。" },
    ],
    response_format: { type: "json_object" },
    max_tokens: 400,
    thinking: { type: "disabled" },
    stream: false,
  }),
});

if (!response.ok) throw new Error(await response.text());
const data = (await response.json()) as {
  choices: Array<{ finish_reason: string | null; message: { content: string | null } }>;
};
const content = data.choices[0]?.message.content ?? "";
if (content.trim() === "") {
  throw new Error(`内容为空，finish_reason=${data.choices[0]?.finish_reason ?? "unknown"}`);
}
const parsed: unknown = JSON.parse(content);
console.log(parsed);
```

`JSON.parse` 只保证语法。字段在不在，用你自己的类型守卫再看一遍，就像对待任何接口响应。

## 练习

1. 删掉提示词里的例子再请求一次，看解析还稳不稳。
2. 把 `max_tokens` 改成 16，观察 `finish_reason`。
3. 给解析结果写一个守卫：`title` 和 `area` 都必须是字符串，否则当成失败。

## 延伸阅读

- [JSON Output](https://api-docs.deepseek.com/guides/json_mode)
- [官方 Python 示例](https://api-docs.deepseek.com/guides/json_mode) 与本课的 TypeScript 对照
- [工具调用的 strict 模式](https://api-docs.deepseek.com/guides/tool_calls)
