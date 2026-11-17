---
title: "计算、状态、环境，以及 Watchdog"
description: "文章描述云端无状态循环、数据库里的状态，以及留在用户机器上的执行环境。公开原型把这三样放在同一台机器的一个进程里。"
---

文章第 5 节把本地智能体绑在一起的三样东西拆开：跑循环的计算、必须持久的会话状态、仓库和工具链这样的执行环境。

第一步，循环放进无状态的云容器，会话放进数据库。机器睡眠不再让智能体停摆。第二步，不把环境搬进云。环境留在原地，只放一个不保存会话的轻量守护进程，负责执行命令并返回结果。文章把这叫做 BYOM（Bring Your Own Machine），并引用 Anthropic 的 “Decoupling the brain from the hands”，链接是 <https://www.anthropic.com/research/managed-agents>。本课没有重读那篇文章的全文。

文章第 6 节的 Watchdog 是主系统外面的一个会话，由定时消息驱动。它处理 API 错误和状态恢复失败，也用模型判断工人是不是在实质推进、有没有偏离目标。维护者可以用自然语言问它为什么失败，也可以让它在系统运行时改提示词或触发规则。

公开原型的部署文档描述的是另一幅已经写下来的图：

- 状态在一个 SQLite 里，运行时用目录锁保证只有一个进程写它。
- 副作用先进持久队列，提交之后再做。失败按退避重试。
- 执行目录默认在状态目录下的 `work`。准备命令可以用 `git worktree` 为每张工单做一个检出。
- 执行变量里没有凭据。工人通过智能体账号的 `gh` 和飞书机器人的 `lark-cli` 接触外部。文档写明这些包装器只是默认值，不是安全边界，工人仍可以用绝对路径执行程序。
- 执行器以操作者的操作系统用户身份运行命令，并且不需要逐条批准。

006 的 hourly check 是另一个 Harness 配置文件里的每小时任务：跑 `scripts/dsh-superagent status`，退出码 0 就安静，退出码 1 才在尊重手动停止标记的前提下重启。它是进程恢复。本课没有在原型文档里看到一个用模型判断每张工单是否偏离目标的 Watchdog 会话。

007 的开放问题还留着部署隔离：希望智能体的配置钉在自己的一份 Harness 上，免得别处升级把它带崩。

## 练习

1. 画两列：文章第 5 节的三样东西各在哪里；原型的循环、SQLite、工作目录各在哪里。
2. 读 hourly check 的提示词，写出退出码 0、1、2、3 分别该做什么。
3. 写出「包装器不是安全边界」对你选择运行账号的影响。

## 延伸阅读

- [006 Deployment](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/006-deployment.md)
- [007 的 Store 与开放问题](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/007-architecture.md)
- [003 的执行变量](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md)
- [Anthropic：Managed Agents](https://www.anthropic.com/research/managed-agents)
