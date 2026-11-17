export interface Chapter {
  slug: string;
  title: string;
  minutes: number;
}

export interface Part {
  id: string;
  kicker: string;
  title: string;
  time: string;
  summary: string;
  chapters: Chapter[];
}

export const parts: Part[] = [
  {
    id: "part-0",
    kicker: "第 1 周 · 前半",
    title: "Part 0 · 把模型当成一个 API",
    time: "约 4 小时",
    summary: "Token、上下文窗口、无状态请求，以及你自己保管的 messages 数组。",
    chapters: [
      { slug: "learn/00-token", title: "Token、上下文窗口与无状态", minutes: 45 },
      { slug: "learn/01-first-fetch", title: "密钥与第一次 fetch", minutes: 50 },
      { slug: "learn/02-messages", title: "多轮对话由你保管", minutes: 45 },
    ],
  },
  {
    id: "part-1",
    kicker: "第 1 周 · 后半",
    title: "Part 1 · React 里的流式聊天",
    time: "约 6 小时",
    summary: "用 ReadableStream 读 SSE，把增量写进消息列表，并处理停止与失败。",
    chapters: [
      { slug: "learn/03-sse", title: "读懂 SSE", minutes: 50 },
      { slug: "learn/04-chat-ui", title: "一个会生长的消息列表", minutes: 70 },
      { slug: "learn/05-stop-errors", title: "停止、失败与空回答", minutes: 45 },
    ],
  },
  {
    id: "part-2",
    kicker: "第 2 周 · 前半",
    title: "Part 2 · 提示词与 JSON",
    time: "约 4 小时",
    summary: "系统提示、JSON Output，以及思考模式这条单独的文本流。",
    chapters: [
      { slug: "learn/06-prompts", title: "系统提示是组件的默认参数", minutes: 45 },
      { slug: "learn/07-json", title: "让模型交一份 JSON", minutes: 50 },
      { slug: "learn/08-thinking", title: "思考模式只是另一条流", minutes: 40 },
    ],
  },
  {
    id: "part-3",
    kicker: "第 2 周 · 后半",
    title: "Part 3 · 工具调用与 Agent 循环",
    time: "约 7 小时",
    summary: "模型只提出函数调用。你执行、你审批，循环是一台有预算的状态机。",
    chapters: [
      { slug: "learn/09-tools", title: "模型提出调用，你来执行", minutes: 60 },
      { slug: "learn/10-react-loop", title: "把 ReAct 写成状态机", minutes: 70 },
      { slug: "learn/11-approval", title: "先审批，再产生副作用", minutes: 50 },
    ],
  },
  {
    id: "part-4",
    kicker: "第 3 周 · 前半",
    title: "Part 4 · 官方协议与两套 SDK",
    time: "约 4 小时",
    summary: "OpenAI SDK 改 baseURL，以及与 ai@7 对齐的 @ai-sdk/deepseek。",
    chapters: [
      { slug: "learn/12-openai-sdk", title: "用 OpenAI SDK 指向 DeepSeek", minutes: 45 },
      { slug: "learn/13-ai-sdk", title: "Vercel AI SDK 的位置", minutes: 60 },
    ],
  },
  {
    id: "part-5",
    kicker: "第 3 周 · 后半",
    title: "Part 5 · MCP、检索、记忆、多会话",
    time: "约 6 小时",
    summary: "工具怎么插上宿主，检索为什么不等于记忆，多会话为什么像多个标签页。",
    chapters: [
      { slug: "learn/14-mcp", title: "MCP：工具的 USB 口", minutes: 55 },
      { slug: "learn/15-rag-memory", title: "检索、记忆和会话不是一回事", minutes: 50 },
      { slug: "learn/16-multi-agent", title: "多个会话像多个标签页", minutes: 45 },
    ],
  },
  {
    id: "part-6",
    kicker: "第 4 周 · 前半",
    title: "Part 6 · 阅读 chat-demo",
    time: "约 5 小时",
    summary: "DeepSeek 公开的静态聊天示例：浏览器直连 API，密钥留在 localStorage。",
    chapters: [
      { slug: "learn/17-chat-demo-map", title: "chat-demo 是什么", minutes: 35 },
      { slug: "learn/18-chat-demo-read", title: "顺着一次发送把源码读完", minutes: 70 },
      { slug: "learn/19-chat-demo-run", title: "在本机跑起来", minutes: 40 },
    ],
  },
  {
    id: "part-7",
    kicker: "第 4 周 · 后半",
    title: "Part 7 · DeepSeek Harness 上手",
    time: "约 5 小时",
    summary: "一切皆插件。先跑起 Web UI，再看 Session、预设和 MCP 客户端。",
    chapters: [
      { slug: "learn/20-harness-plugin", title: "一切皆插件", minutes: 45 },
      { slug: "learn/21-harness-run", title: "启动 Web UI", minutes: 40 },
      { slug: "learn/22-harness-session", title: "Session、预设与 MCP 客户端", minutes: 55 },
    ],
  },
  {
    id: "part-8",
    kicker: "第 5 周 · 前半",
    title: "Part 8 · Super-agent 架构",
    time: "约 8 小时",
    summary: "文章里的五个模块，以及 2026-10-31 公开原型实际写下的那些类。",
    chapters: [
      { slug: "learn/23-two-sources", title: "文章和原型各说什么", minutes: 35 },
      { slug: "learn/24-four-traits", title: "四个特征，五个模块", minutes: 40 },
      { slug: "learn/25-router-worker", title: "Router 不干活", minutes: 50 },
      { slug: "learn/26-triggers", title: "触发、快路径与订阅", minutes: 55 },
      { slug: "learn/27-context-cache", title: "上下文窗口是一块缓存", minutes: 45 },
      { slug: "learn/28-duplex", title: "全双工和分渠道说话", minutes: 40 },
      { slug: "learn/29-separation", title: "计算、状态、环境，以及 Watchdog", minutes: 45 },
      { slug: "learn/30-gap", title: "实验数字和公开代码的差距", minutes: 40 },
    ],
  },
  {
    id: "part-9",
    kicker: "第 5 周 · 中段",
    title: "Part 9 · 毕业设计",
    time: "约 8 小时",
    summary: "一台迷你 Router–Worker，外加一块「待人工决定」面板。浏览器里就能点。",
    chapters: [
      { slug: "learn/31-mini-router", title: "迷你 Router–Worker", minutes: 70 },
      { slug: "learn/32-pending", title: "待人工决定面板", minutes: 50 },
      { slug: "learn/lab", title: "实验室", minutes: 40 },
    ],
  },
  {
    id: "part-10",
    kicker: "第 5 周 · 收束",
    title: "Part 10 · 上线之前",
    time: "约 4 小时",
    summary: "流式体验、工具可视化、人在回路、费用、密钥和可观测性。",
    chapters: [
      { slug: "learn/33-streaming-ux", title: "流式体验和工具可视化", minutes: 45 },
      { slug: "learn/34-production", title: "密钥、费用、安全与观测", minutes: 55 },
    ],
  },
];

export const appendix = [
  { slug: "learn/glossary", title: "名词表" },
  { slug: "learn/sources", title: "来源与核对边界" },
];

export const sidebar = [
  { label: "学习路线", link: "/" },
  { label: "实验室", link: "/learn/lab/" },
  ...parts.map((part) => ({
    label: part.title,
    items: part.chapters
      .filter((chapter) => chapter.slug !== "learn/lab")
      .map((chapter) => ({ label: chapter.title, slug: chapter.slug })),
  })),
  {
    label: "附录",
    items: appendix.map((item) => ({ label: item.title, slug: item.slug })),
  },
];

export const totalMinutes = parts.reduce(
  (sum, part) => sum + part.chapters.reduce((inner, chapter) => inner + chapter.minutes, 0),
  0,
);
