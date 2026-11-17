---
title: "Router 不干活"
description: "主会话只接人、派工和回复。每张工单有自己的执行器会话和目录。原型的预设名字是 dsh-superagent-router 与 dsh-superagent-worker。"
---

文章的两层是职责划分，不是要求每一层永远只有一个会话。路由层是长期的全局节点：所有入口的人话都到这里，它做全局顺序、协调和记忆。为了不成为瓶颈，它自己不执行任务，甚至可以不带 Bash。工人层的每个会话上下文隔离，工具齐全，只做一件任务，不直接对人说话。状态汇报给路由层，由路由层回复。

文章把这和 Agent Team 分开：团队领队常常要拆解一个紧耦合任务；路由层只做跨任务的高层分派。文章还写到，路由层的工作往往比想象中轻，较轻的模型常常就够。工人决定单次任务的质量，所以要用更强的模型。

原型的对应物写在文档和 `cordis.patch.yml` 里。

| 文章 | 原型 |
| --- | --- |
| Router | 主会话，代码和提示词里叫 orchestrator。预设 `dsh-superagent-router` |
| Worker | 执行器会话，叫 worker，会话名 `worker-<工单 id>`。预设 `dsh-superagent-worker` |
| 不执行任务 | 路由预设关掉文件写入和编辑，没有子代理、网页抓取和待办 |
| 工人报告、路由回复 | 执行器用 `orchestrator_report` 等工具，回复经 Outbox 回到来源 |

主会话有 14 个应用工具，包括 `orchestrator_read`、`orchestrator_route`、评估三件套和提示词保存。`orchestrator_route` 一次可以带 1 到 20 个决定，每一项单独执行。执行器有 6 个应用工具：读、确认、报告、标记线程无关、为了上下文而关注、交还。

工人子代理使用 Harness 的 `standard` 预设。会话在创建时记住预设。

路由层在文章里还可以不是一个会话：事件在一次推理期间排队，下一轮合并处理，于是形成批处理。原型的线程保证同一条线程上同时只有一个评估，评估期间到来的触发并进下一批。这是同一思想在工单系统里的落地。文章第 7.2 节的压测数字见[实验那一课](/learn/30-gap/)。

## 练习

1. 在 `cordis.patch.yml` 里对比两份预设的插件列表，圈出只出现在工人侧的工具。
2. 解释为什么路由会话仍有 `bash`，同时提示词又要求它不读代码。007 写明「避免读代码」是提示规则，不是工具禁用。
3. 画出一次明确请求：触发 → 路由接单 → 工单 → 执行器。不要把执行器画成会直接给用户发长日志的人。

## 延伸阅读

- [003 Execution](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md)
- [007 Architecture 的工具表](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/007-architecture.md)
- [cordis.patch.yml](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/cordis.patch.yml)
