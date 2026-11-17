---
title: "Session、预设与 MCP 客户端"
description: "会话是追加的事件日志。预设决定工具和等待时间。MCP 客户端把外部工具变成 mcp__服务器__工具名。"
---

Harness 的会话是事件溯源的。包 `@deepseek-ai/dsh-session` 的文件头写着：追加的会话日志是对话历史的唯一来源，给模型的消息由它派生，持久化交给订阅 `session/event` 的插件。你在 Part 0 自己保管的 `messages`，在这里变成一份不可变日志加上一份投影。刷新页面不应该造出第二份真相。

预设是一份插件清单，决定这个会话有哪些工具、命令最多等多久。Super-agent 原型没有发明另一套循环，它往 Harness 里插入两份预设：`dsh-superagent-router` 和 `dsh-superagent-worker`。路由预设的文件工具关掉了写和编辑，也没有子代理；工人预设保留文件、搜索、命令、任务、技能和子代理。两份预设都把前台命令的 `timeoutMs` 写成 5000，超时后命令转入后台任务。这是原型实现「下一步还能接收新消息」的具体办法。

MCP 客户端是插件 `@deepseek-ai/dsh-mcp-client`。[配置目录](https://deepseek-harness.github.io/deepseek-harness/en/reference/config-catalog) 写明两种传输：`stdio` 用 `command` 和 `args` 拉起子进程，`streamable-http` 用已经在跑的 `url`。`serverName` 必须匹配 `[A-Za-z0-9_-]{1,32}`。模型看见的工具名是 `mcp__<serverName>__<原始名>`。

记忆指南给出的参考配置使用这个插件，并说明 Harness 不负责下载服务器、初始化数据库或选择嵌入模型。stdio 的子进程随插件生命周期启动和停止；HTTP 则要求上游先跑着。发现工具是异步的，所以要等 `mcp__…` 出现再发验证提示。

创作者模式的插件管理器还可以在对话里安装一份只含配置的包。指南里的验证标准写得很具体：管理结果要看到已应用，并且一次 `mcp__demo__ping` 真的成功。写着 `restart-required` 的条目还没生效。

## 练习

1. 在原型仓库的 `cordis.patch.yml` 里找出两处 `timeoutMs: 5000`。
2. 解释 `mcp__notes__save_note` 这三个片段分别是什么。
3. 读会话包的模块注释，用一句话写出「为什么没有第二套消息类型」。

## 延伸阅读

- [dsh-session 源文件头](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/core/session/src/index.ts)
- [MCP 客户端配置](https://deepseek-harness.github.io/deepseek-harness/en/reference/config-catalog)
- [记忆服务器指南](https://deepseek-harness.github.io/deepseek-harness/en/guide/mcp-memory)
- [从提示词安装插件](https://deepseek-harness.github.io/deepseek-harness/en/develop/practice/dynamic-cordis)
