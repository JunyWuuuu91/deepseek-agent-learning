import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const notes: string[] = [];
const server = new McpServer({ name: "lesson-notes", version: "0.0.1" });

server.registerTool(
  "save_note",
  {
    description: "把一条笔记留在这个进程的数组里。",
    inputSchema: { text: z.string() },
  },
  async ({ text }) => {
    notes.push(text);
    return { content: [{ type: "text", text: `已记下 ${notes.length} 条` }] };
  },
);

export async function start() {
  await server.connect(new StdioServerTransport());
}
