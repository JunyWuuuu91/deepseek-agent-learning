export interface SseEvent {
  event: string;
  data: string;
}

export function parseSseBlock(block: string): SseEvent | null {
  let event = "message";
  const data: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    if (line === "" || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "event") event = value;
    if (field === "data") data.push(value);
  }
  if (data.length === 0) return null;
  return { event, data: data.join("\n") };
}

export async function* readContentDeltas(response: Response): AsyncGenerator<string> {
  if (!response.body) throw new Error("响应没有 body");
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const parts = buffer.split(/\r?\n\r?\n/);
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      const parsed = parseSseBlock(part);
      if (!parsed || parsed.data.trim() === "[DONE]") {
        if (parsed?.data.trim() === "[DONE]") return;
        continue;
      }
      const json = JSON.parse(parsed.data) as {
        choices?: Array<{ delta?: { content?: string | null; reasoning_content?: string | null } }>;
      };
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}
