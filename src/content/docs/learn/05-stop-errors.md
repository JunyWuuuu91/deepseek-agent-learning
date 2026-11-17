---
title: "停止、失败与空回答"
description: "把 HTTP 错误、用户停止、空的 JSON 内容和被截断的回答分成四种不同的界面状态。"
---

上一课的组件已经有四条路：成功写完、用户停止、请求失败、还在写。把它们画成状态，和表单提交是一样的。

| 状态 | 用户看见什么 | 下一步 |
| --- | --- | --- |
| 空闲 | 可以发送 | 等输入 |
| 进行中 | 助手那一行是「…」，停止可用 | 等增量或 abort |
| 失败 | `role="alert"` 里是状态码或网络错误 | 保留用户的话，允许重试 |
| 完成 | 助手消息有正文 | 可以再发 |

失败时不要把用户刚发的那句从列表里删掉。重试就是用同一份 `messages` 再请求一次。网络错误和 429、5xx 值得重试；401 说明密钥错了，重试同样的请求没有意义，要把人带到设置。

还有一种看起来像成功、内容却是空的情况。JSON Output 文档写着：模型输出无法识别成 JSON 时，API 会把非 JSON 内容换成空格，于是 `content` 可能只剩空格，同时 `finish_reason` 仍是 `stop`。`finish_reason` 为 `length` 时，输出是被 `max_tokens` 或上下文长度截断的。这两种都要在界面上说人话，不能渲染成一个空白气泡。

流在 `[DONE]` 之前断开，也是失败。chat-demo 把这种情况收成自己的 `interrupted`。你的读取器如果在 `done === true` 时缓冲区里还有半个事件，就把这半个事件丢掉，并告诉界面「回答没有收完」。

## 练习

1. 在 `streamReply` 里抛出一个普通 `Error`。确认警报出现，已有的半段文字还在。
2. 造一个 `finish_reason: "length"` 的假响应，给气泡加上「回答被截断」而不是再请求一次把账单打满。
3. 列出你不会自动重试的状态码。至少包括 401。

## 延伸阅读

- [错误码](https://api-docs.deepseek.com/quick_start/error_codes)
- [JSON Output 对空内容的说明](https://api-docs.deepseek.com/guides/json_mode)
- [chat-demo 的错误种类](https://github.com/deepseek-ai/chat-demo/blob/main/src/services/api/client.ts)
