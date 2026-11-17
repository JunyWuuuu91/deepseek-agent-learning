---
title: "Token、上下文窗口与无状态"
description: "把一次模型调用看成纯函数：输入是这次的消息，输出是下一条消息，服务器不替你记历史。"
---

DeepSeek 的 [Token 说明](https://api-docs.deepseek.com/quick_start/token_usage) 把 token 定义成模型表示文本、也用来计费的基本单位。同一页给的直觉是：一个中文词、一个英文词、一个数字或一个符号，通常算一个 token。粗算比例写在那里：1 个英文字符大约 0.3 个 token，1 个汉字大约 0.6 个 token。切分方式会随模型变，所以估算只用来心里有数，账单以响应里的 `usage` 为准。

[定价页](https://api-docs.deepseek.com/quick_start/pricing) 写着当前 `deepseek-flash` 与 `deepseek-v4-pro` 的上下文长度都是 **1M**，单次最大输出 **384K**。上下文窗口是这一次请求的总预算：已经放进去的消息，加上模型正在往外写的内容，一起受它约束。它不是你的数据库，也不是浏览器的 localStorage。

聊天接口不替你记住上一轮。官方多轮文档的做法是把到目前为止的 `messages` 整包再发一次。这和没有内部状态的函数一样：上次的返回值要由调用方收下来，放进下一次参数。

## 和前端的对应

| 你已经会的 | 这次调用里 |
| --- | --- |
| 函数参数 | `model`、`messages`、`tools` |
| 返回值 | `choices[0].message`，流式时是一段段 delta |
| 组件自己的 state | 你保存在内存或浏览器里的历史 |
| 包体积预算 | 上下文窗口。塞太满，请求会在长度上停住 |

定价按 100 万 token 计。2026-11-17 读到的 `deepseek-flash` 价格是：缓存命中的输入，非高峰 0.003 美元、高峰 0.006 美元；缓存未命中的输入，非高峰 0.15 美元、高峰 0.3 美元；输出，非高峰 0.6 美元、高峰 1.2 美元。高峰时段是周一到周五的 01:00–04:00 和 06:00–10:00 UTC，中国法定节假日除外。`deepseek-v4-pro` 更贵，并发上限在同一页写成 Flash 2500、Pro 500。价格会变，以那一页为准。

## 练习

1. 用上面的汉字比例，估算「用一句话解释 token。」大约多少 token。
2. 写出你为什么不能拿这个估算去对账。
3. 打开定价页，记下 Flash 和 Pro 的上下文长度是不是仍然都是 1M。

## 延伸阅读

- [Token 与用量](https://api-docs.deepseek.com/quick_start/token_usage)
- [模型与价格](https://api-docs.deepseek.com/quick_start/pricing)
- [多轮对话](https://api-docs.deepseek.com/guides/multi_round_chat)
- [上下文缓存](https://api-docs.deepseek.com/guides/kv_cache)
