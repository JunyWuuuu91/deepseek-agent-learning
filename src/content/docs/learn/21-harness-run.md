---
title: "启动 Web UI"
description: "npx @deepseek-ai/dsh web 默认打开 127.0.0.1:3080。模型密钥在设置里保存，工作区要单独选。"
---

README 给出两条路。

从 npm 启动。2026-11-17 `npm view @deepseek-ai/dsh version` 得到 `0.2.2-rc.1`，描述是配置文件、插件管理和启动。版本还在候选阶段，以你安装时的 `npm view` 为准。

```bash
npx @deepseek-ai/dsh web
```

README 写明：默认 Web UI 在 `http://127.0.0.1:3080`，本机启动会尝试打开浏览器。SSH 会话只打印地址。`--no-open` 可以不打开浏览器。

从源码：

```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 准备仓库产物，`pnpm dsh web` 使用这些产物，不会再构建一次。

界面起来之后，[Web UI 指南](https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart) 的顺序是：

1. 设置 → 模型，填入 DeepSeek API 密钥并保存。指南写明不用重启，下一次请求就能用。
2. 选择工作区，把你启动 `dsh` 时所在的项目目录加进去。没选工作区时，会话输入不可用。
3. 发一句任务，例如指南里的 “Summarize this repository and identify its main packages.”
4. 智能体可以读改工作区、跑命令、委派、维护计划。需要批准的操作会在界面上问你。

Python SDK 是另一条入口：官方页写的安装包是 `deepseek-harness-sdk`，示例用 `DeepSeekHarness(...).run(...)`。本课没有在 PyPI 上再次查询这个包名，命令以那一页为准。Node 这条线足够把 Web UI 跑起来。

本课没有在当前环境执行 `dsh web`。端口、设置路径和批准行为来自上述官方页。

## 练习

1. 用 `--no-open` 启动，只在终端里确认 URL。
2. 不选工作区就尝试发送，确认输入不可用，而不是一个含糊的报错。
3. 读 `SAFETY.md` 里和命令执行有关的段落，再决定要不要把一个含私有密钥的目录选成工作区。

## 延伸阅读

- [从 npm 或源码运行](https://github.com/deepseek-ai/deepseek-harness/blob/master/README.md)
- [使用 Web UI](https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart)
- [配置模型](https://deepseek-harness.github.io/deepseek-harness/en/guide/providers)
- [Python SDK](https://deepseek-harness.github.io/deepseek-harness/en/guide/python-sdk)
