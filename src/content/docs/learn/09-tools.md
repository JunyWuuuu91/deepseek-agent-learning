---
title: "模型提出调用，你来执行"
description: "工具描述是一份 JSON Schema。模型返回 tool_calls，函数本身要由你的进程提供。"
---

工具调用让模型提出「请用这些参数调用这个函数」。官方文档把流程写成四步，用的例子是杭州的天气：

1. 用户问天气。
2. 模型返回 `get_weather`，参数里带地点。
3. 你的程序真正去查，再把结果以 `role: "tool"` 放回 `messages`。
4. 模型用自然语言说出结果。

文档写得很直：`get_weather` 的功能要由用户提供，模型自己不执行函数。这和前端里「按钮的 `onClick` 只是一个名字，请求得你发」是同一件事。

非思考模式的官方示例把 `thinking` 设为 `disabled`。思考模式从 DeepSeek-V3.2 起也能带工具，细节在思考模式那一页。本课的循环在下一章，这里先把协议看清。

还有一条和 Agent 有关的差异：想在对话中途插入不是模型生成的工具调用时，Chat Completions 不支持，Anthropic 格式的 `/messages` 和 Responses API 支持。DeepSeek 的说明写在[工具调用](https://api-docs.deepseek.com/guides/tool_calls)末尾。

`strict: true` 会让参数服从你给的 JSON Schema，需要 `base_url` 换成 `https://api.deepseek.com/beta`，并且每个 function 都打开 `strict`。对象的每个属性都要放进 `required`，`additionalProperties` 设为 `false`。支持的类型包括 object、string、number、integer、boolean、array、enum、anyOf，也可以用 `$def` 和 `$ref`。字符串的 `minLength` / `maxLength`，数组的 `minItems` / `maxItems`，文档写明不支持。

## 练习

1. 照官方例子定义 `get_weather`，让参数只有 `location`。
2. 写一个本地函数，对「杭州」返回 `24℃`。先不要接循环，手动把这条 tool 消息推进数组。
3. 读 strict 模式的对象规则，改一版 `additionalProperties: false` 的 schema。确认你知道它要打到 `/beta`。

## 延伸阅读

- [工具调用](https://api-docs.deepseek.com/guides/tool_calls)
- [思考模式](https://api-docs.deepseek.com/guides/thinking_mode)
- [Responses API](https://api-docs.deepseek.com/guides/responses_api)
