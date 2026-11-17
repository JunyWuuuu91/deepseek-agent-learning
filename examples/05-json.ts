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
      {
        role: "system",
        content: [
          "把用户的话拆成 JSON。",
          '示例：{"title":"登录按钮溢出","area":"移动端"}',
        ].join("\n"),
      },
      { role: "user", content: "手机上的登录按钮超出屏幕了。" },
    ],
    response_format: { type: "json_object" },
    max_tokens: 400,
    thinking: { type: "disabled" },
    stream: false,
  }),
});

if (!response.ok) throw new Error(await response.text());
const data = (await response.json()) as {
  choices: Array<{ finish_reason: string | null; message: { content: string | null } }>;
};
const content = data.choices[0]?.message.content ?? "";
if (content.trim() === "") {
  throw new Error(`内容为空，finish_reason=${data.choices[0]?.finish_reason ?? "unknown"}`);
}
const parsed: unknown = JSON.parse(content);
console.log(parsed);
