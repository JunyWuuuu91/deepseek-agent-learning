---
title: "MCP：工具的 USB 口"
description: "MCP 是宿主和工具服务器之间的协议。本课核对的是 @modelcontextprotocol/sdk 1.32.2 的 registerTool。"
---

模型上下文协议（MCP）解决的是「工具怎么插到宿主上」，不是「模型怎么思考」。宿主发现工具、调用工具、拿回文本；服务器提供工具。DeepSeek 的聊天接口不认识 MCP 这两个字。Harness 这样的宿主认识。

2026-11-17 安装的 `@modelcontextprotocol/sdk@1.32.2` 是 v1 维护线。它的 README 写明：这一行实现到 2025-11-25 的规范；2026-07-28 规范在 v2，包名换成 `@modelcontextprotocol/server` 和 `@modelcontextprotocol/client`。本课的代码只针对已安装的 v1，没有跑过 v2 的 API。

v1 用 `McpServer.registerTool`。旧的 `tool()` 在类型上标了 deprecated。`inputSchema` 要的是 Zod 字段表，不是 `z.object(...)`。传输可以是 stdio，也可以是 Streamable HTTP。

```ts
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
```

这个数组死在进程里，重启就没了。它用来看清「工具在服务器里执行」。DeepSeek Harness 通过插件 `@deepseek-ai/dsh-mcp-client` 去连这样的服务器，工具名会变成 `mcp__<serverName>__<原始名>`。那一课在 Part 7。

## 练习

1. 读安装包里的 `README.md`，确认你装到的是 v1 还是 v2。
2. 给 `save_note` 加一个 `list_notes`，让它返回目前的条数。
3. 写出 stdio 和 Streamable HTTP 各适合什么：本机子进程，还是已经跑着的远程服务。

## 延伸阅读

- [MCP 规范](https://modelcontextprotocol.io)
- [TypeScript SDK v1 文档](https://ts.sdk.modelcontextprotocol.io/)
- [v2 迁移说明](https://ts.sdk.modelcontextprotocol.io/v2/migration/upgrade-to-v2)
- [示例服务器仓库](https://github.com/modelcontextprotocol/servers)
