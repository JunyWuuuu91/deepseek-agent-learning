import { createDeepSeek } from "@ai-sdk/deepseek";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export async function POST(request: Request): Promise<Response> {
  const { messages } = (await request.json()) as { messages: UIMessage[] };
  const result = streamText({
    model: deepseek("deepseek-flash"),
    messages: await convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
