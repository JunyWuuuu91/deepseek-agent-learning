export type Who = "gate" | "router" | "worker" | "you";
export type Stage = "working" | "attention" | "review" | "closed" | "stopped";
export type Answer = "approve" | "reject";
export type Phase =
  | "idle"
  | "dropped"
  | "accepted"
  | "fanout"
  | "attention"
  | "review"
  | "closed";

export interface Line {
  id: string;
  who: Who;
  text: string;
}

export interface Ticket {
  id: string;
  title: string;
  stage: Stage;
  question?: string;
}

export interface State {
  phase: Phase;
  answer: Answer | null;
  lines: Line[];
  ticket: Ticket | null;
}

export const nextPhase: Record<Phase, Phase | null> = {
  idle: "dropped",
  dropped: "accepted",
  accepted: "fanout",
  fanout: "attention",
  attention: null,
  review: "closed",
  closed: null,
};

const phaseOrder: Phase[] = [
  "idle",
  "dropped",
  "accepted",
  "fanout",
  "attention",
  "review",
  "closed",
];

export const events = [
  { id: "chat", at: "dropped" as const, source: "群聊", text: "今天中午吃什么", fate: "忽略" },
  { id: "bug", at: "accepted" as const, source: "GitHub", text: "@agent 登录按钮在 390px 宽时溢出", fate: "接单" },
  { id: "ci", at: "fanout" as const, source: "CI", text: "同一条讨论里的检查失败了", fate: "扇出" },
];

export function say(id: string, who: Who, text: string): Line {
  return { id, who, text };
}

export function initialState(): State {
  return { phase: "idle", answer: null, lines: [], ticket: null };
}

export function phaseReached(state: State, phase: Phase): boolean {
  return phaseOrder.indexOf(state.phase) >= phaseOrder.indexOf(phase);
}

export function canAdvance(state: State): boolean {
  return nextPhase[state.phase] !== null;
}
