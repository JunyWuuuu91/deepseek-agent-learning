---
title: "迷你 Router–Worker"
description: "一份没有模型的状态机：忽略闲聊，接明确请求，把后续事件扇出给同一张工单，在具体问题上停住。"
---

毕业设计不调用 DeepSeek。密钥、计费和网络波动会挡住你观察状态机本身。`src/lib/routerModel.ts` 定义阶段，`src/lib/routerMachine.ts` 定义转移。两个文件都短于 100 行，测试是 `npm run check:machine`。

阶段对应原型里的一张缩小的表：

| 阶段 | 含义 |
| --- | --- |
| `working` | 工人正在做 |
| `attention` | 有一个具体问题，面板必须出现 |
| `review` | 人已经选择改法，等验收 |
| `closed` | 验收通过 |
| `stopped` | 人决定先不改 |

`attention` 时 `canAdvance` 为假。自动的「下一步」不能替人回答。这就是审批那一课的 `pending`。

类型和事件：

```ts
export type Who = "gate" | "router" | "worker" | "you";
export type Stage = "working" | "attention" | "review" | "closed" | "stopped";
export type Answer = "approve" | "reject";
export type Phase =
  | "idle" | "dropped" | "accepted" | "fanout" | "attention" | "review" | "closed";

export const nextPhase: Record<Phase, Phase | null> = {
  idle: "dropped",
  dropped: "accepted",
  accepted: "fanout",
  fanout: "attention",
  attention: null,
  review: "closed",
  closed: null,
};
```

`advance` 在 `src/lib/routerMachine.ts`。停住的那一支是：

```ts
if (phase === "attention") {
  const question = "断点改成 480px，还是只修这一处溢出？";
  return {
    ...state,
    phase,
    ticket: state.ticket ? { ...state.ticket, stage: "attention", question } : null,
  };
}
```

这不是完整函数。同一文件里还有闲聊被丢掉、`@agent` 创建 `ticket-1`、CI 扇出到这张工单的分支。`resolveAttention` 在同意时进入 `review`，在拒绝时直接 `stopped`。

和原型的差距要写在注释里，而不是假装已经实现：这里没有 SQLite、没有 Harness 会话、没有 GitHub。它只保留「路由不改代码、工人不直接把日志扔给人、问题一次一个」。

## 练习

1. 跑 `npm run check:machine`，读断言的顺序。
2. 加一个新阶段会怎样破坏 `nextPhase`？先写测试再改表。
3. 把「路由不改代码」写成一条你在 `advance` 里能指给人看的语句。

## 延伸阅读

- [003 的阶段表](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/003-execution.md)
- [001 的工单与派工](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/001-domain.md)
- 本站 [实验室](/learn/lab/)
