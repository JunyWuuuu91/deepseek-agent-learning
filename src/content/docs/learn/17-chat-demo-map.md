---
title: "chat-demo 是什么"
description: "deepseek-ai/chat-demo 是 2026-11-12 创建的 MIT 静态聊天示例。浏览器直连 API，没有应用后端。"
---

这个仓库是真实存在的。2026-11-17 核对到：

| 项 | 值 |
| --- | --- |
| 仓库 | [deepseek-ai/chat-demo](https://github.com/deepseek-ai/chat-demo) |
| 创建时间 | 2026-11-12T08:08:19Z |
| 许可证 | MIT |
| 默认分支上的版本 | 0.1.1 |
| 线上体验 | [deepseek-ai.github.io/chat-demo](https://deepseek-ai.github.io/chat-demo/) |
| 文档里的另一处体验 | [cdn.deepseek.com/chat-demo](https://cdn.deepseek.com/chat-demo) |
| 英文 README 里的 Releases 链接 | `deepseek-ai/deepseek-chat-demo`，访问时 301 到 `chat-demo` |

[构建聊天机器人](https://api-docs.deepseek.com/guides/build_a_chatbot/) 把这个仓库写成官方示例，并写明：密钥、会话和上传的图片只存在你的浏览器里，演示仅供演示。

它不是 DeepSeek App 的服务端源码。README 写的是静态站点：没有应用后端，浏览器直接请求配置好的 API。构建工具是 Rspack，界面是 React 18.3.1，状态用 zustand 4.4.7。`package.json` 没有 `engines` 字段；README 要求 Node.js 22.12+ 和 pnpm。开发服务器端口是 **8090**。

功能以 README 和那篇指南为准：多会话和分支、流式回答、深度思考、搜索、读链接、附件、语音、Markdown / KaTeX / Mermaid、中英文和明暗主题、历史导入导出。搜索和读链接由服务端执行，客户端要做的是把返回的块展示出来，下一轮原样送回。

默认 API 根是 `https://api.deepseek.com`，由 `rspack.config.ts` 的 `createConfig({ apiOrigin })` 注入成 `__API_ORIGIN__`。聊天默认模型是 `deepseek-flash`，走 Anthropic 兼容的 Messages / Files API。

## 练习

1. 打开 GitHub 仓库，核对 `package.json` 的 `version` 是不是仍然 0.1.1。
2. 读中英文 README 的「数据与存储」一节，写出三样留在浏览器里的东西，和一样会送到 API 的东西。
3. 确认你没有把它当成可以免密钥、免计费的托管聊天。密钥仍然是你自己的。

## 延伸阅读

- [仓库 README](https://github.com/deepseek-ai/chat-demo/blob/main/README.md)
- [简体中文 README](https://github.com/deepseek-ai/chat-demo/blob/main/README.zh-CN.md)
- [构建聊天机器人](https://api-docs.deepseek.com/guides/build_a_chatbot/)
- [应用 API 更新说明](https://api-docs.deepseek.com/news/news261113/)
