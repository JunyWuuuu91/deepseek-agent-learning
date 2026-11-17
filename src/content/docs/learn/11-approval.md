---
title: "先审批，再产生副作用"
description: "读数据的工具可以自动跑。写文件、合并、发消息要停在 pending，等人点头。"
---

上一台状态机里，`runTool` 立刻产生结果。查询天气可以这样。写入仓库、合并拉取请求、给群聊发消息，应该先停住。这和表单里的「确认提交」一样：点击本身还不是请求，确认之后才是。

把决定收成三种结果。`pending` 时界面渲染按钮，循环先不要把 tool 结果送回模型。人点了以后，再补上 `allowed` 或 `denied` 的文本。拒绝也是一条观察，模型可以据此改口，而不是卡住。

```ts
export interface PendingCall {
  id: string;
  name: string;
  arguments: string;
}

export type Decision =
  | { status: "pending"; call: PendingCall }
  | { status: "allowed"; result: string }
  | { status: "denied"; result: string };

const needsPerson = new Set(["write_file", "merge_pull_request"]);

export function decide(call: PendingCall, approved: boolean | null): Decision {
  if (!needsPerson.has(call.name)) {
    return { status: "allowed", result: `已执行 ${call.name}` };
  }
  if (approved === null) return { status: "pending", call };
  if (!approved) return { status: "denied", result: "人拒绝了这次调用" };
  return { status: "allowed", result: `人同意后执行 ${call.name}` };
}
```

公开原型把这件事做成了领域概念：工人用结构化字段提问，面板上的标签是「待人工决定」。问题一次只问一个，已经授权的工作可以继续。你现在的 `pending` 就是那个面板的最小版，实验室里能点。

名单要写在代码里。写在系统提示里的「请先问我」会被一段用户粘贴的文本动摇。宿主强制的工具检查，才是原型文档里排在最前面的那一层。

## 练习

1. 对 `get_weather` 调用 `decide`，确认它直接是 `allowed`。
2. 对 `merge_pull_request` 先传 `null`，再传 `false`。确认拒绝的文案可以放进 `role: "tool"`。
3. 在聊天界面里，`pending` 时禁用「下一步」，只留两个按钮。这就是实验室的交互。

## 延伸阅读

- [dsh-superagent 005 Panel](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/005-panel.md)
- [004 Prompts 里的 human_action](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/004-prompts.md)
- 本站 [实验室](/learn/lab/)
