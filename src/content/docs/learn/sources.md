---
title: "来源与核对边界"
description: "2026-11-17 读过的原始材料，以及本站故意没有写成事实的部分。"
---

核对日期是 2026-11-17。模型名、价格、包版本和仓库文件都会变。动手之前打开链接再看一次。

## 读过的原始材料

- DeepSeek API：<https://api-docs.deepseek.com/> 以及站点地图里的 Chat Completions、Responses、JSON Output、工具调用、思考模式、多轮、上下文缓存、Token、定价、构建聊天机器人、Vision、安全。
- 架构文章正文：<https://x.com/DeepSeekHarness/article/2116857257245987236>。接口返回包含第 1 节到第 8 节前半，以及实验表。
- 原型仓库与 `docs/000` 到 `docs/008`、`README.md`、`SETUP.md`、`package.json`、`cordis.patch.yml`：<https://github.com/deepseek-ai/dsh-superagent-prototype>。短链接 `dsh-superagent` 会 301 到这里。仓库创建时间取自 GitHub 上的 2026-10-31。
- Harness README、第一个插件、Web UI、模型配置、MCP 记忆、配置目录、Python SDK 页，以及 `@deepseek-ai/dsh-session` 的文件头。
- chat-demo 的 README、`package.json`、`rspack.config.ts`、`src/services/api/client.ts`、`sse.ts`、`settings.ts`，以及 GitHub API 给出的创建时间 2026-11-12。
- npm 上当天的版本：`openai@7.57.0`、`ai@7.0.173`、`@ai-sdk/deepseek@3.0.87`、`@ai-sdk/react@4.0.177`、`@modelcontextprotocol/sdk@1.32.2`、`@deepseek-ai/dsh@0.2.2-rc.1`、`@deepseek-ai/cordis@4.1.0`。本站示例按这些版本做了类型检查。

## 没有当成已核实事实的部分

- X 接口的返回在第 8 节后部被截断。第 8.3 节（上下文边界与一般意义上的 A2A）、第 8.4 节（安全与隐私）和结论，依据 <https://chinamodelapi.com/super-agent-design-deepseek> 的英文全文翻译补齐。该译文的前半与 X 正文一致，包括实验叙事。译文把缓存读取印成 23.23M 与 31.77M；本站采用 X 正文里的 23.2M 与 31.8M。译文所称的微信发布日期和作者名单，本站没有独立核对，因此没有写进课程。
- 没有运行 chat-demo、Harness 或 dsh-superagent 的安装流程，也没有用真实密钥打模型。命令和端口来自上述文件。
- 没有在原型文档中找到名为 `start` / `stop` 的工具、投机执行后丢弃结果的模块、云端计算与状态分离、BYOM 守护进程，或用模型判断工人是否偏离目标的 Watchdog 会话。课程把这些标成文章中的设计。
- api-docs 站点地图里没有找到 embeddings 端点，所以检索一课用的是本地字符串匹配。
- AI SDK 文档把 `deepseek-flash` 的图像输入标为不支持，定价页把 Vision 标为支持。两页当天都读了，没有用图片请求裁决。
- AI SDK 文档写 `deepseek-chat` 与 `deepseek-reasoner` 于 2026-07-24 退役。这个日期没有在当天打开的 api-docs 页面上再次看到。
- `openai@7.57.0` 的类型有 `reasoning_effort`，没有 `thinking`。官方 JavaScript 示例仍然传递 `thinking`。
- 文章里「一个人通常跟得住 3 到 5 个会话」是作者的经验，不是本站的测量。
- 原型 `engines.dsh` 是 `^0.2.1-alpha.2`。当天 npm 上的 `@deepseek-ai/dsh` 是 `0.2.2-rc.1`。本站没有断言后者满足前者的范围。

## 延伸阅读

- [架构文章](https://x.com/DeepSeekHarness/article/2116857257245987236)
- [原型文档目录](https://github.com/deepseek-ai/dsh-superagent-prototype/tree/main/docs)
- [DeepSeek API 更新日志](https://api-docs.deepseek.com/updates)
