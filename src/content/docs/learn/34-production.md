---
title: "密钥、费用、安全与观测"
description: "密钥留在服务端。费用看 usage 里的缓存命中。公开服务要打开安全检查。执行环境的包装器不是安全边界。"
---

**密钥。** 生产应用的 `DEEPSEEK_API_KEY` 放在服务端环境变量或密钥管理里，浏览器只调用你自己的路由。chat-demo 把密钥放进 localStorage，是官方写明的演示方式：没有应用后端，数据留在这一个浏览器源里。把它抄进一个有账号体系的产品，等于把密钥交给每一个打开devtools的人。

**费用和延迟。** 价格以[定价页](https://api-docs.deepseek.com/quick_start/pricing)为准，本站[第 0 课](/learn/00-token/)抄过 2026-11-17 的 Flash 数字。每次响应看 `usage`：`prompt_tokens`、`completion_tokens`，以及缓存的 `prompt_cache_hit_tokens` 和 `prompt_cache_miss_tokens`。缓存要整段前缀一致，系统提示不稳定、或在数组中间插入消息，都会让命中下降。思考模式和工具循环会把输出 token 和等待叠上去。给循环一个步数上限，给界面一个停止按钮。

搜索、读网页还有按次的费用。定价页写明这些费用和 token 分开扣。打开 `deepseek_web_search` 或 `deepseek_read_url` 之后，一批采样参数会被忽略，`max_tokens` 仍然限制每一步的输出。

**公开服务。** [构建聊天机器人](https://api-docs.deepseek.com/guides/build_a_chatbot/) 写明：对公众提供服务时打开安全检查，并自行完成内容安全、模型备案和 AI 标识等义务。示例里的字段是 `safety_check: { level: "high" }`。`stop_reason` 为 `refusal` 时用你自己的拒绝文案替换回答。

**人在回路。** 写文件、合并、对外发消息进入待决定状态。名单写在代码里。原型还要求执行器以团队看得见的账号行动，操作者对它发出的每句话负责，从短的允许名单和只记录的主动模式开始。

**执行隔离。** 原型文档写明：工人命令不需要逐条批准，以操作者的系统用户运行；`gh` 包装器只建立默认凭据，工人可以用绝对路径执行程序；执行变量里不放凭据。文章把「模型碰不到凭据本身」列为未解问题。你在自己的产品里要假定工具结果和网页正文都是不可信输入。

**观测。** 至少记录请求 id、模型名、`finish_reason`、token 用量、工具名和这一步的耗时。不要记录完整密钥，也不要把思维链当成业务日志长期保存。原型的面板在同一类副作用连续失败三次后才把它显示成系统问题，单次网络抖动不占人的注意力。这个阈值可以作为你告警的起点，再按自己的错误预算调整。

## 练习

1. 在你的练习仓库里搜 `DEEPSEEK_API_KEY`，确认它没有出现在任何 `src/components` 里。
2. 给工具循环打一行日志：步数、工具名、这一步的 `prompt_cache_hit_tokens`。
3. 读 000 的 Responsibility 一节，写出三条你愿意贴在自己项目 README 里的操作者规则。

## 延伸阅读

- [定价](https://api-docs.deepseek.com/quick_start/pricing)
- [上下文缓存](https://api-docs.deepseek.com/guides/kv_cache)
- [模型内容安全](https://api-docs.deepseek.com/guides/safety)
- [开放平台条款（文档页所链的英文文本）](https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html)
- [000 Philosophy 的责任一节](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/000-philosophy.md)
