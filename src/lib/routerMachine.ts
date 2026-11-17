export type SourceId = "chat" | "github" | "ci" | "email";
export type Stage = "created" | "working" | "attention" | "review" | "done" | "dropped" | "failed";
export type PathKind = "fast" | "slow";
export type AcceptMode = "observe" | "auto";
export type Choice = "approve" | "reject" | "accept" | "return" | "retry" | "stop";
export type Concept = "trigger" | "filter" | "subscription" | "router" | "hitl";

export interface IncomingEvent {
  id: string;
  source: SourceId;
  thread: string;
  text: string;
  label: string;
}

export interface ToolStep {
  id: string;
  name: string;
  detail: string;
}

export interface Ticket {
  id: string;
  title: string;
  thread: string;
  stage: Stage;
  trail: string;
  question?: string;
  steps: ToolStep[];
  subscribed: boolean;
}

export interface TimelineEntry {
  id: string;
  eventId: string;
  source: SourceId;
  thread: string;
  text: string;
  path: PathKind;
  reason: string;
  concept: Concept;
  href: string;
  lesson: string;
}

export interface PendingItem {
  id: string;
  ticketId: string;
  kind: "question" | "acceptance" | "failure";
  title: string;
  detail: string;
}

export interface LabState {
  tickets: Ticket[];
  timeline: TimelineEntry[];
  seq: number;
  mode: AcceptMode;
  lesson: TimelineEntry | null;
}

export type Action =
  | { type: "ingest"; event: IncomingEvent }
  | { type: "decide"; ticketId: string; choice: Choice }
  | { type: "mode"; mode: AcceptMode };

export const SOURCE_LABEL: Record<SourceId, string> = {
  chat: "群聊",
  github: "GitHub",
  ci: "CI",
  email: "邮件",
};

export const STAGE_LABEL: Record<Stage, string> = {
  created: "新建",
  working: "执行中",
  attention: "等待人工",
  review: "待验收",
  done: "已完成",
  dropped: "已丢弃",
  failed: "失败",
};

export const CONCEPT_LABEL: Record<Concept, string> = {
  trigger: "Trigger",
  filter: "两级过滤",
  subscription: "订阅直通",
  router: "Router–Worker",
  hitl: "人在回路",
};

const CHAPTER: Record<Concept, string> = {
  trigger: "/learn/26-triggers/",
  filter: "/learn/26-triggers/",
  subscription: "/learn/26-triggers/",
  router: "/learn/25-router-worker/",
  hitl: "/learn/32-pending/",
};

export const PRESETS: IncomingEvent[] = [
  { id: "lunch", source: "chat", thread: "群聊-闲谈", text: "今天中午吃什么", label: "群聊闲谈" },
  { id: "bug", source: "github", thread: "issue-login", text: "@agent 登录按钮在 390px 宽时溢出", label: "GitHub 点名" },
  { id: "ci", source: "ci", thread: "issue-login", text: "默认分支检查失败", label: "同一线程的 CI" },
  { id: "email", source: "email", thread: "inbox", text: "请智能体起草回复：设计评审改到周四", label: "邮件点名" },
  { id: "pr", source: "github", thread: "pr-padding", text: "这个 PR 把 padding 改成了 8px", label: "未点名的 PR 评论" },
  { id: "follow", source: "github", thread: "issue-login", text: "我试了 360px，按钮还是溢出", label: "同一线程的后续评论" },
];

export const SCRIPT_IDS = ["lunch", "bug", "ci"] as const;

const ADDRESSED = /@agent|请智能体/;
const WORK = /溢出|失败|修复|报错|评审|padding|按钮|bug/i;
const OPEN: Stage[] = ["created", "working", "attention", "review", "failed"];

export function initialState(): LabState {
  return { tickets: [], timeline: [], seq: 0, mode: "observe", lesson: null };
}

export function pendingItems(state: LabState): PendingItem[] {
  return state.tickets.flatMap((ticket): PendingItem[] => {
    if (ticket.stage === "attention" && ticket.question) {
      return [{ id: `${ticket.id}-q`, ticketId: ticket.id, kind: "question" as const, title: ticket.question, detail: ticket.title }];
    }
    if (ticket.stage === "review") {
      return [{ id: `${ticket.id}-a`, ticketId: ticket.id, kind: "acceptance" as const, title: "验收这份结果", detail: ticket.title }];
    }
    if (ticket.stage === "failed") {
      return [{ id: `${ticket.id}-f`, ticketId: ticket.id, kind: "failure" as const, title: "工人没有做完", detail: ticket.title }];
    }
    return [];
  });
}

function addressed(text: string) {
  return ADDRESSED.test(text);
}

function looksLikeWork(text: string) {
  return WORK.test(text);
}

function subscriber(state: LabState, thread: string) {
  return state.tickets.find((ticket) => ticket.subscribed && ticket.thread === thread && OPEN.includes(ticket.stage));
}

function titleFrom(text: string) {
  const cleaned = text.replace(/@agent|请智能体/g, "").trim();
  return cleaned.length > 28 ? `${cleaned.slice(0, 28)}…` : cleaned || "未命名工单";
}

function entry(state: LabState, partial: Omit<TimelineEntry, "id" | "href"> & { concept: Concept }): TimelineEntry {
  return { ...partial, id: `log-${state.seq + 1}`, href: CHAPTER[partial.concept] };
}

function withEntry(state: LabState, item: TimelineEntry, tickets: Ticket[]): LabState {
  return { ...state, tickets, timeline: [...state.timeline, item], seq: state.seq + 1, lesson: item };
}

function makeTicket(state: LabState, event: IncomingEvent): Ticket {
  const id = `ticket-${state.tickets.length + 1}`;
  const steps: ToolStep[] = [{ id: `${id}-read`, name: "read", detail: "只把线程摘要放进工人上下文。" }];
  let stage: Stage = "working";
  let question: string | undefined;
  if (/无法复现|搞不定/.test(event.text)) {
    steps.push({ id: `${id}-fail`, name: "reproduce", detail: "试了复现，没有稳定结果。" });
    stage = "failed";
  } else if (/还是|两种/.test(event.text)) {
    steps.push({ id: `${id}-plan`, name: "plan", detail: "范围内有两种改法，先问一个问题。" });
    stage = "attention";
    question = "断点改成 480px，还是只修这一处溢出？";
  } else if (event.source === "email" || /起草|回复/.test(event.text)) {
    steps.push({ id: `${id}-draft`, name: "draft", detail: "起草好回复，等你决定发不发。" });
    stage = "review";
  } else if (/按钮|溢出/.test(event.text)) {
    steps.push({ id: `${id}-preview`, name: "preview", detail: "在 390px 宽复现：按钮溢出。" });
    stage = "working";
  } else {
    steps.push({ id: `${id}-edit`, name: "edit", detail: "改完，准备给你验收。" });
    stage = "review";
  }
  return {
    id,
    title: titleFrom(event.text),
    thread: event.thread,
    stage,
    trail: `新建 → ${STAGE_LABEL[stage]}`,
    question,
    steps,
    subscribed: true,
  };
}

function fanOut(ticket: Ticket, event: IncomingEvent): Ticket {
  const step = {
    id: `${ticket.id}-in-${event.id}`,
    name: event.source === "ci" ? "read_ci" : "read_followup",
    detail: event.source === "ci" ? "读到同一条线程上的检查失败。" : "读到订阅线程上的后续消息。",
  };
  const steps = [...ticket.steps, step];
  if (ticket.stage === "working" && (event.source === "ci" || /还是|溢出/.test(event.text))) {
    return {
      ...ticket,
      steps,
      stage: "attention",
      trail: `${ticket.trail} → 等待人工`,
      question: "断点改成 480px，还是只修这一处溢出？",
    };
  }
  return { ...ticket, steps };
}

export function apply(state: LabState, action: Action): LabState {
  if (action.type === "mode") {
    return { ...state, mode: action.mode };
  }
  if (action.type === "decide") {
    return decide(state, action.ticketId, action.choice);
  }
  return ingest(state, action.event);
}

function ingest(state: LabState, event: IncomingEvent): LabState {
  const live = subscriber(state, event.thread);
  if (live) {
    const ticket = fanOut(live, event);
    const item = entry(state, {
      eventId: event.id,
      source: event.source,
      thread: event.thread,
      text: event.text,
      path: "fast",
      reason: "快路径：这条线程已有订阅，代码直接扇出，不再叫路由层做一次评估。",
      concept: "subscription",
      lesson: "后续事件走订阅直通。路由不转发，工人在自己的上下文里看到它。",
    });
    return withEntry(state, item, state.tickets.map((itemTicket) => (itemTicket.id === live.id ? ticket : itemTicket)));
  }
  if (!addressed(event.text) && !looksLikeWork(event.text)) {
    const item = entry(state, {
      eventId: event.id,
      source: event.source,
      thread: event.thread,
      text: event.text,
      path: "fast",
      reason: "快路径：没有点名智能体，也不像一件工作。代码直接丢掉，模型还没被叫到。",
      concept: "filter",
      lesson: "大多数群聊是噪声。确定性规则先过滤，慢路径才花钱。",
    });
    return withEntry(state, item, state.tickets);
  }
  if (!addressed(event.text)) {
    if (state.mode === "observe") {
      const item = entry(state, {
        eventId: event.id,
        source: event.source,
        thread: event.thread,
        text: event.text,
        path: "slow",
        reason: "慢路径：模型判断这像一件工作，但接受模式是 observe，只记录「本会接单」。",
        concept: "filter",
        lesson: "明确点名才会直接开工。没点名的候选先观察，避免智能体自己找活干。",
      });
      return withEntry(state, item, state.tickets);
    }
    return openTicket(state, event, "慢路径：auto 模式下，模型把未点名的工作候选接成一张工单。");
  }
  return openTicket(state, event, "慢路径：点名是明确请求。路由接单并派给工人，自己不改代码。");
}

function openTicket(state: LabState, event: IncomingEvent, reason: string): LabState {
  const ticket = makeTicket(state, event);
  const item = entry(state, {
    eventId: event.id,
    source: event.source,
    thread: event.thread,
    text: event.text,
    path: "slow",
    reason,
    concept: "router",
    lesson: "一张工单一个工人、一条线程。路由只派工，工具调用留在工人日志里。",
  });
  return withEntry(state, item, [...state.tickets, ticket]);
}

function decide(state: LabState, ticketId: string, choice: Choice): LabState {
  const current = state.tickets.find((ticket) => ticket.id === ticketId);
  if (!current) return state;
  let ticket = current;
  let reason = "";
  let lesson = "";
  if (choice === "approve" && current.stage === "attention") {
    ticket = {
      ...current,
      stage: "review",
      trail: `${current.trail} → 待验收`,
      question: undefined,
      steps: [...current.steps, { id: `${current.id}-fix`, name: "edit", detail: "按你的选择改完，并附上前后对照。" }],
    };
    reason = "你选定了改法。工人做完，工单进入待验收。";
    lesson = "问题一次一个。人拍板之后，工人才能产生那一种改动。";
  } else if (choice === "reject" && current.stage === "attention") {
    ticket = { ...current, stage: "dropped", trail: `${current.trail} → 已丢弃`, question: undefined, subscribed: false };
    reason = "你决定先不改。工单丢弃，并取消这条线程的订阅。";
    lesson = "拒绝也是一条结果。教学机在丢弃后取消订阅；公开原型会保留订阅，等人再说话时重新打开。";
  } else if (choice === "accept" && current.stage === "review") {
    ticket = { ...current, stage: "done", trail: `${current.trail} → 已完成`, subscribed: false };
    reason = "验收通过。工单完成，工人不再占用名额。";
    lesson = "待验收是人的签收，不是工人自己宣布做完。";
  } else if (choice === "return" && current.stage === "review") {
    ticket = {
      ...current,
      stage: "working",
      trail: `${current.trail} → 执行中`,
      steps: [...current.steps, { id: `${current.id}-back`, name: "revise", detail: "验收退回，继续改。" }],
    };
    reason = "验收退回。工单回到执行中。";
    lesson = "退回仍然留在同一张工单上，不新开一个会话。";
  } else if (choice === "retry" && current.stage === "failed") {
    ticket = {
      ...current,
      stage: "working",
      trail: `${current.trail} → 执行中`,
      steps: [...current.steps, { id: `${current.id}-retry`, name: "retry", detail: "按你的要求再试一次。" }],
    };
    reason = "你要求重试。同一张工单继续，不重新评估。";
    lesson = "失败要出现在待决定面板里，而不是埋在工具日志底部。";
  } else if (choice === "stop" && current.stage === "failed") {
    ticket = { ...current, stage: "dropped", trail: `${current.trail} → 已丢弃`, subscribed: false };
    reason = "你停止了这张失败的工单。";
    lesson = "停下来是人的决定。自动播放不会替你点这个按钮。";
  } else {
    return state;
  }
  const item = entry(state, {
    eventId: `decide-${ticketId}-${choice}`,
    source: "github",
    thread: current.thread,
    text: reason,
    path: "fast",
    reason,
    concept: "hitl",
    lesson,
  });
  return withEntry(state, item, state.tickets.map((itemTicket) => (itemTicket.id === ticketId ? ticket : itemTicket)));
}
