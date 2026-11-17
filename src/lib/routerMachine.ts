import { nextPhase, say, type Answer, type State } from "./routerModel.ts";

export function advance(state: State): State {
  const phase = nextPhase[state.phase];
  if (!phase) return state;
  if (phase === "dropped") {
    return {
      ...state,
      phase,
      lines: [...state.lines, say("g1", "gate", "这条没有点名智能体，准入结果是忽略。模型还没被叫到。")],
    };
  }
  if (phase === "accepted") {
    return {
      ...state,
      phase,
      ticket: { id: "ticket-1", title: "修好移动端登录按钮", stage: "working" },
      lines: [
        ...state.lines,
        say("r1", "router", "这是明确请求。创建 ticket-1 并派工。主会话不改代码。"),
        say("w1", "worker", "在自己的目录里复现：390px 时按钮溢出。"),
      ],
    };
  }
  if (phase === "fanout") {
    return {
      ...state,
      phase,
      lines: [...state.lines, say("g2", "gate", "订阅线程上的后续事件直接交给 ticket-1，不再开一次评估。")],
    };
  }
  if (phase === "attention") {
    const question = "断点改成 480px，还是只修这一处溢出？";
    return {
      ...state,
      phase,
      ticket: state.ticket ? { ...state.ticket, stage: "attention", question } : null,
      lines: [...state.lines, say("w2", "worker", "两种改法都在授权范围内。我先问一个具体问题。")],
    };
  }
  return {
    ...state,
    phase,
    ticket: state.ticket ? { ...state.ticket, stage: "closed", question: undefined } : null,
    lines: [
      ...state.lines,
      say("y1", "you", "验收通过。工单结束。之后若有人在原线程说话，同一张工单还能再打开。"),
    ],
  };
}

export function resolveAttention(state: State, answer: Answer): State {
  if (state.phase !== "attention" || !state.ticket) return state;
  if (answer === "reject") {
    return {
      phase: "closed",
      answer,
      ticket: { ...state.ticket, stage: "stopped", question: undefined },
      lines: [
        ...state.lines,
        say("y2", "you", "先不改。"),
        say("w3", "worker", "按决定停止，没有打开拉取请求。"),
      ],
    };
  }
  return {
    phase: "review",
    answer,
    ticket: { ...state.ticket, stage: "review", question: undefined },
    lines: [
      ...state.lines,
      say("y3", "you", "改成 480px。"),
      say("w4", "worker", "改完并附上前后截图。报告 ready，等你验收。"),
    ],
  };
}
