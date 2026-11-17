---
title: "把 ReAct 写成状态机"
description: "思考、调用工具、观察结果、再思考。循环必须有步数上限，停在没有 tool_calls 的那一条助手消息。"
---

ReAct 这个名字来自 Reason + Act：模型先决定下一步，你执行，再把观察放回去。对前端来说它就是一台小状态机，不是一个 `while (true)`。

状态只有几个：`thinking`（在等模型）、`calling`（在跑你的函数）、`done`（助手消息没有工具调用）、`failed`（步数用尽或 HTTP 失败）。每走一步都改一份不可变的 `messages`。步数上限是这台机器的熔断，相当于请求超时。下面的例子把上限写成 4。

```ts
type ToolCall = { id: string; function: { name: string; arguments: string } };
type Message =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_weather",
      description: "查询城市天气。调用方必须先知道城市。",
      parameters: {
        type: "object",
        properties: { location: { type: "string" } },
        required: ["location"],
      },
    },
  },
];

function runTool(name: string, args: { location?: string }): string {
  if (name !== "get_weather") return "未知工具";
  return `${args.location ?? "未知地点"}：24℃`;
}

export async function agentTurn(messages: Message[], apiKey: string): Promise<Message[]> {
  for (let step = 0; step < 4; step += 1) {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-flash",
        messages,
        tools,
        thinking: { type: "disabled" },
        stream: false,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    const data = (await response.json()) as {
      choices: Array<{ message: { content: string | null; tool_calls?: ToolCall[] } }>;
    };
    const message = data.choices[0]?.message;
    if (!message) throw new Error("没有 message");
    messages.push({ role: "assistant", content: message.content, tool_calls: message.tool_calls });
    const calls = message.tool_calls ?? [];
    if (calls.length === 0) return messages;
    for (const call of calls) {
      const args = JSON.parse(call.function.arguments) as { location?: string };
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: runTool(call.function.name, args),
      });
    }
  }
  throw new Error("超过 4 步仍未结束");
}
```

`JSON.parse` 可能失败，参数也可能缺字段。生产里要把这一步收进 `failed`，把错误文本作为 tool 结果送回，而不是让整个进程崩掉。文件在 `examples/06-tool-loop.ts`。

文章里的 Super-agent 认为一个同步的 ReAct 循环做不到「边干活边听新消息」。那是第 8 部分的题目。先把这台同步机器写对。

## 练习

1. 用「杭州天气」跑通。数一数 `messages` 里有几次 `assistant`、几次 `tool`。
2. 把上限改成 1。如果模型先调用工具，确认函数抛出「超过 4 步」以外的、你改过的错误。
3. 给 `runTool` 加一个未知工具的分支，让模型收到「未知工具」而不是异常。

## 延伸阅读

- [工具调用](https://api-docs.deepseek.com/guides/tool_calls)
- [Yao 等人的 ReAct 论文](https://arxiv.org/abs/2210.03629)
- 本站 [先审批，再产生副作用](/learn/11-approval/)
