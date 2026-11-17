---
title: "密钥与第一次 fetch"
description: "用浏览器自带的 fetch 调用 DeepSeek Chat Completions。密钥放在环境变量里，思考模式先显式关掉。"
---

第一次调用保持和官方 [Your First API Call](https://api-docs.deepseek.com/) 同一套地址：

| 项 | 值 |
| --- | --- |
| OpenAI 格式的 base URL | `https://api.deepseek.com` |
| Anthropic 格式的 base URL | `https://api.deepseek.com/anthropic` |
| 聊天端点 | `POST /chat/completions` |
| 模型名 | `deepseek-flash` 或 `deepseek-v4-pro` |

文档写明：请求 `deepseek-flash` 时，实际服务的是 DeepSeek-V4.1-Flash-1017，调用方式不变。旧名 `deepseek-v4-flash` 和 `deepseek-v4-flash-vision-exp` 仍会被接受，对应模型已经退役，请求由 V4.1-Flash-1017 响应，按 Flash 价格计费。

密钥在 [platform.deepseek.com](https://platform.deepseek.com/api_keys) 申请。把它放进环境变量 `DEEPSEEK_API_KEY`，用 `Authorization: Bearer …` 带上。密钥和数据库密码一样：放在服务器或你自己的终端里。下面的脚本是给 Node 跑的，不是给打包进前端的。

Chat Completions 的字段说明写着：省略 `thinking`，并且也省略 `reasoning_effort` 时，思考模式是打开的。第一课把 `thinking.type` 设成 `disabled`，是为了先拿到一条短的 `content`。

```ts
export {};

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) throw new Error("缺少 DEEPSEEK_API_KEY");

const response = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "deepseek-flash",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "用一句话解释 token。" },
    ],
    thinking: { type: "disabled" },
    stream: false,
  }),
});

if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${await response.text()}`);
}

const data = (await response.json()) as {
  choices: Array<{ message: { content: string | null } }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    prompt_cache_hit_tokens?: number;
    prompt_cache_miss_tokens?: number;
  };
};

console.log(data.choices[0]?.message.content);
console.log(data.usage);
```

可运行文件是 `examples/01-first-fetch.ts`。在仓库根目录：

```bash
export DEEPSEEK_API_KEY=你的密钥
npx tsx examples/01-first-fetch.ts
```

本站没有把 `tsx` 装进依赖。没有它时，用任何能跑 TypeScript 的方式执行这份文件即可。没有密钥就不要发请求，先把非 2xx 的分支读懂。

`usage` 里的 `prompt_cache_hit_tokens` 和 `prompt_cache_miss_tokens` 来自[上下文缓存](https://api-docs.deepseek.com/guides/kv_cache)。缓存默认开启，不需要你改代码。命中的条件是后一次请求完整对上某一段已经落下的前缀，只重合开头的一部分并不够。

## 练习

1. 把 `thinking` 整段删掉再请求一次，比较两次 `content` 的长度和 `usage`。
2. 故意写错密钥，确认你的错误分支能看到 HTTP 状态，而不是一个空白页面。
3. 把同一段 `messages` 连发两次，看第二次的 `prompt_cache_hit_tokens` 有没有变化。缓存是尽力而为，允许第二次仍然是 0。

## 延伸阅读

- [第一次调用](https://api-docs.deepseek.com/)
- [Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion)
- [错误码](https://api-docs.deepseek.com/quick_start/error_codes)
- [限流](https://api-docs.deepseek.com/quick_start/rate_limit)
