export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function createThread(system: string): ChatMessage[] {
  return [{ role: "system", content: system }];
}

export function pushTurn(messages: ChatMessage[], user: string, assistant: string): ChatMessage[] {
  return [
    ...messages,
    { role: "user", content: user },
    { role: "assistant", content: assistant },
  ];
}

const first = createThread("你是一位前端导师，回答短于 80 字。");
const second = pushTurn(first, "上下文窗口是什么？", "它是这一次请求能放进模型的文本预算。");
console.log(second.length);
