---
title: "名词表"
description: "课程里用到的词。原型术语的中英对照以 001 文档的表为准。"
---

原型的术语表在 [001 Domain model](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/001-domain.md)。下表只收本站反复用到的词，中文名沿用那一页。

| 词 | 中文 | 在本站里的意思 |
| --- | --- | --- |
| token | 词元 | 计费和上下文预算的单位。以响应里的 usage 为准 |
| context window | 上下文窗口 | 一次请求能放进模型的总预算。当前定价页写的是 1M |
| message | 消息 | 你自己保管的数组元素，角色有 system、user、assistant、tool |
| tool call | 工具调用 | 模型提出的函数名和参数。函数由你的进程执行 |
| ReAct | 推理加行动 | 模型决定、你执行、结果送回。要有步数上限 |
| MCP | 模型上下文协议 | 宿主和工具服务器之间的协议，不是 DeepSeek 的聊天字段 |
| Session | 会话 | 一份上下文。在 Harness 里是追加的事件日志 |
| Source | 来源 | 事件流。原型里有 GitHub，可选飞书 |
| Trigger | 触发 | 来源上的一条不可变事件 |
| Thread | 线程 | 按时间排好的一组触发。评估在其中串行 |
| Eval | 评估 | 把一批触发变成决定。先准入，再研判 |
| Mandate | 授权 | 接单时写下的范围、强度和策略版本 |
| Ticket | 工单 | 一份被授权的工作 |
| Assignment | 派工 | 工单和某一个执行器实例的绑定 |
| Subscription | 订阅 | 工单和线程的多对多关系。后续事件由此扇出 |
| Attention | 待人工决定 | 工单上一个等着人回答的具体问题 |
| Router | 路由 | 文章里的全局层。原型里是主会话 orchestrator |
| Worker | 工人 | 文章里的执行层。原型里是每张工单一个执行器会话 |
| Watchdog | 看门狗 | 文章里主系统之外的监督会话。原型公开的是每小时进程检查 |

强度有两种：explicit 明确，inferred 推断。决定有 accept 接单、stop 停止、ignore 忽略、unavailable 未完成。报告有 progress 进展、waiting 等待、ready 就绪、blocked 受阻、failed 失败、dropped 无需处理。
