---
title: "全双工和分渠道说话"
description: "文章用异步的 start() 和 stop() 描述全双工。原型把前台命令的等待上限写成 5 秒，聊天回复有 100 词的硬限制。"
---

经典 ReAct 在同步工具返回之前，会话不能接新话。文章把这叫做半双工，并把耗时的命令换成异步的 `start()` 和 `stop()`：`start()` 立刻返回已开始，工具结束后把结果当成新的事件送回；`stop()` 用来停掉跑太久的命令。文章还写了一句：DeepSeek Harness 已经实现这套异步任务机制，但默认没有打开。

本课在原型文档和 `cordis.patch.yml` 里核对到的是另一层具体设置，没有在这些文件里找到名为 `start` / `stop` 的工具：

- 路由和工人预设的前台命令等待 5 秒，然后转入后台任务。
- 等待任务结果的上限也是 5 秒。
- 主会话还有一道守卫：拒绝命令位置上的 `sleep`、拒绝超过 30 秒的 shell 超时、拒绝超过 5 秒的 `job_output` 等待。
- 工人侧，一轮结束时如果还有后台任务，工单继续占用名额，不向主会话报「等待」。后台工作最多再给 30 分钟，到点杀掉 shell 任务。子代理使用 `standard` 预设，那份预设要 60 秒才把命令转入后台。

多渠道是提示词约束。004 写明：聊天默认一句，硬限制 100 词；GitHub 上要按项目习惯写完整的背景、变更和验证。确认一次，说清对象和预期结果。提问走结构化的 `human_action`，主会话原样转发。打开拉取请求不等于做完，没有真实截图的界面改动不能报 ready。

这些句子约束模型。字数和工具参数检查由宿主执行，提示词改不了它们。

## 练习

1. 在 `cordis.patch.yml` 搜索 `5000`，列出它约束的两件事。
2. 写一条 100 词以内的中文进度，和一条适合放进拉取请求正文的结构化说明。感受两种渠道的密度。
3. 把文章里的 `start()` / `stop()` 和原型里的 5 秒后台分开记。后者是本课在公开文件里看见的实现。

## 延伸阅读

- [004 Prompts](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/004-prompts.md)
- [003 的后台与名额](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md)
- [007 的预设与等待上限](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/007-architecture.md)
