---
title: "迷你 Router–Worker"
description: "一份没有模型的状态机：忽略闲聊，接明确请求，把后续事件扇出给同一张工单，在具体问题上停住。"
---

毕业设计不调用 DeepSeek。规则写在 `src/lib/routerMachine.ts` 的 `apply` 里，测试是 `npm run check:machine`。页面只负责把每一次 `apply` 画出来。

阶段用中文标在工单上：新建之后进入执行中，需要拍板时是等待人工，做完是待验收，结束是已完成或已丢弃。失败会单独停住，等你重试或停止。

判定是两组看得见的规则，不是一次真实的模型调用：

- 快路径：没有 `@agent` 或「请智能体」，也不像一件工作，代码直接丢掉。线程上已经有订阅时，后续事件直接扇出给那张工单。
- 慢路径：点名就是明确请求，路由建工单并派给工人。没点名但像工作的文本，在 `observe` 里只记录「本会接单」；切到 `auto` 才会真的接。

工人的工具调用是写死的步骤名，例如 `read`、`preview`、`edit`。它们说明「工具留在工人日志里」，并不会去读你的仓库。

和公开原型的差别：这里没有 SQLite，没有 Harness 会话。丢弃或完成后，教学机会取消订阅；原型会把订阅留着，等人再说话时重新打开同一张工单。

## 练习

1. 跑 `npm run check:machine`。指出哪一条断言保证「同一条线程的 CI 不会新建第二张工单」。
2. 在实验室把接受模式改成 `auto`，再送入「未点名的 PR 评论」。对比 `observe` 下的时间线。
3. 在 `apply` 里指出路由自己不调用 `edit` 的那一支。

## 延伸阅读

- [003 的阶段表](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md)
- [001 的工单与派工](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/001-domain.md)
- 本站 [实验室](/learn/lab/)
