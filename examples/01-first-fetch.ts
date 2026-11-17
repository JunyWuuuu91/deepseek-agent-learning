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
