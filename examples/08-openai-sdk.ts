import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

const body = {
  model: "deepseek-flash",
  messages: [{ role: "user" as const, content: "你好" }],
  reasoning_effort: "high" as const,
  stream: false as const,
  thinking: { type: "enabled" as const },
};

export async function sayHello() {
  return client.chat.completions.create(
    body as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  );
}
