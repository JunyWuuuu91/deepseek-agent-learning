---
title: "思考模式只是另一条流"
description: "thinking 与 reasoning_effort 决定要不要思维链。reasoning_content 和 content 分两条显示，思维链不是事实来源。"
---

Chat Completions 用 `thinking` 在思考和非思考之间切换。文档的字段说明是：省略 `thinking` 或把它设为 `null` 时，模式跟着 `reasoning_effort`；`reasoning_effort` 也省略时，思考是打开的。对象里的 `type` 一旦给出，就压过 `reasoning_effort` 对开关的选择。`reasoning_effort` 的取值在接口说明里是 `none`、`low`、`high`、`max`。

官方第一课的 JavaScript 示例同时传了 `thinking: { type: "enabled" }` 和 `reasoning_effort: "high"`。流式时，思维链增量在 `delta.reasoning_content`，可见回答在 `delta.content`。界面上做成可折叠的一块，不要和回答混成一段。

`max_tokens` 的默认值也跟着模式走：不设置时，非思考默认 8K，思考默认 64K，`reasoning_effort` 为 `max` 时默认 128K。上限仍是 384K。思考会把输出 token 和等待时间一起拉长，所以第一课才先关掉它。

多轮时，官方示例把上一轮的 `reasoning_content` 放回助手消息，并写明 API 会忽略它。你要保存并送回的是 `content`。思维链可以展示给调试的人，不要当成可以引用的事实，也不要写进审计日志以外的业务字段。

## 练习

1. 同一道算术题，分别用 `thinking.type = "disabled"` 和 `"enabled"` 请求。比较首字时间和 `completion_tokens`。
2. 在流式解析里把 `reasoning_content` 和 `content` 收进两个字符串，界面上分两栏。
3. 第二轮只回传 `content`。确认对话仍然能接上。

## 延伸阅读

- [思考模式](https://api-docs.deepseek.com/guides/thinking_mode)
- [Chat Completions 的 thinking 字段](https://api-docs.deepseek.com/api/create-chat-completion)
- [构建聊天机器人里的 thinking 块](https://api-docs.deepseek.com/guides/build_a_chatbot/)
