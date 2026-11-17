---
title: "顺着一次发送把源码读完"
description: "从输入框到 Anthropic Messages 流：设置在 localStorage，会话在 IndexedDB，SSE 在 services/api。"
---

仓库大约 150 个 `src` 文件。第一次阅读只追一条线：设置里的密钥，到一次发送，再到流式解析。

| 你想知道的 | 文件 |
| --- | --- |
| 入口 | `src/main.tsx`、`src/app/App.tsx` |
| 输入框 | `src/components/chatInput/ChatInput.tsx` |
| 会话视图 | `src/components/session/SessionView.tsx` |
| 助手消息 | `src/components/messages/AssistantMessage.tsx`、`ReplyArea.tsx` |
| 设置弹窗 | `src/components/settings/SettingsDialog.tsx` |
| 密钥和开关 | `src/services/settings.ts` |
| 会话状态 | `src/services/chat/store.ts`、`db.ts` |
| 发消息 | `src/services/chat/reply.ts` |
| HTTP 与流 | `src/services/api/client.ts`、`sse.ts`、`parseEvent.ts` |
| 构建 | `rspack.config.ts` |

`settings.ts` 用 zustand。密钥存在 `localStorage` 的键 `chat-demo:api-key`。语言、主题、位置、朗读音色、思考和搜索开关也在 localStorage。读不到存储时，设置只留在内存里。会话和原始附件在 IndexedDB，README 写明按浏览器配置和站点源隔离。

`client.ts` 把 API 根拼成 `${API_ORIGIN}/anthropic/v1`。引用 Files API 时带上 beta 头 `files-api-2025-04-14`。错误分成五类：`http`、`stream`、`network`、`interrupted`、`protocol`。`sse.ts` 顶部注释写着它按 WHATWG 解释事件流，忽略以 `:` 开头的保活注释。

界面上的块和[构建聊天机器人](https://api-docs.deepseek.com/guides/build_a_chatbot/)的表对应：`thinking` 是可折叠的思考，`server_tool_use` 加搜索结果是搜索步骤，`text` 带引用是回答，`stop_reason: "refusal"` 要换成你的拒绝文案。chat-demo 的消息组件就是这张表的一种实现。

历史导入导出在 `src/services/chat/history/`。README 写明导入会在确认和校验成功后替换本地会话；导出包含会话和本地仍在的原始图片，不包含密钥、设置和非图片附件的原件。

## 练习

1. 从 `ChatInput` 的提交处理跳到 `reply.ts`，再跳到 `client.ts`。把函数名按调用顺序列出来。
2. 在 `settings.ts` 里列出所有 `chat-demo:` 键。
3. 找出思考开关如何进入请求体。不要改代码，只在笔记里写文件名和字段名。

## 延伸阅读

- [src 目录](https://github.com/deepseek-ai/chat-demo/tree/main/src)
- [client.ts](https://github.com/deepseek-ai/chat-demo/blob/main/src/services/api/client.ts)
- [settings.ts](https://github.com/deepseek-ai/chat-demo/blob/main/src/services/settings.ts)
- [历史格式说明（中文，README 所链）](https://github.com/deepseek-ai/chat-demo/blob/main/src/services/chat/history/README.md)
