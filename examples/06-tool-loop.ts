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
