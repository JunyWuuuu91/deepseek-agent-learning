---
title: "一切皆插件"
description: "DeepSeek Harness 的插件导出 name 和 apply(ctx)。官方教程用 cordis.yml 把它插进 Web UI。"
---

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 是 DeepSeek 开源的智能体框架，README 的原话是 everything-is-a-plugin。它建在 [Cordis](https://github.com/cordiverse/cordis) 上。文档站在 [deepseek-harness.github.io/deepseek-harness](https://deepseek-harness.github.io/deepseek-harness/)。README 标明它处于开发者预览，会有不兼容改动，运行前要看仓库里的 `SAFETY.md`。

官方「你的第一个插件」把插件定义成一个 TypeScript 模块：导出 `name`，导出 `apply(ctx)`。框架加载时调用 `apply`，把上下文传进来。下面的代码来自该教程，依赖类型 `@deepseek-ai/cordis`。2026-11-17 `npm view @deepseek-ai/cordis version` 得到 4.1.0。教程本身要求你在已经能从源码跑起来的 Harness 仓库里写，而不是单独起一个空项目。

```ts
import type { Context } from "@deepseek-ai/cordis";

export const name = "hello-plugin";

export function apply(ctx: Context) {
  console.log("[hello-plugin] plugin loaded!");
}
```

教程接着写一份覆盖配置。路径必须是绝对路径：

```yaml
- insert:
    - id: hello
      name: "/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts"
```

然后：

```bash
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

打开 `http://127.0.0.1:3080`，终端里应出现 `[hello-plugin] plugin loaded!`。

通过 `ctx` 注册的监听、工具和定时器，在插件卸下时由框架清理。需要你自己关闭的资源，用 `ctx.effect()` 交回一个清理函数，和 React 的 `useEffect` 返回清理函数是同一形状。插件如果要用 `tools` 或 `llm`，在 `inject` 数组里声明，框架会等这些服务就绪再调用 `apply`。

教程还给出对象形式和类形式。类形式在插件要向别人提供服务时使用，大多数时候函数形式就够。

## 练习

1. 读教程全文，把 `apply`、`inject`、`ctx.effect` 各用一句话解释。
2. 对照 React：`inject` 像什么？像组件声明自己要的 context，而不是在渲染中途去找一个可能还不存在的全局变量。
3. 先不要在不看 `SAFETY.md` 的情况下把 Harness 接到一个有真实密钥的仓库。

## 延伸阅读

- [Harness README](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md)
- [你的第一个插件](https://deepseek-harness.github.io/deepseek-harness/en/develop/basic/)
- [Cordis 仓库](https://github.com/cordiverse/cordis)
- [论文：A Programming Paradigm for Spatiotemporal Composability](https://arxiv.org/abs/2608.25512)
