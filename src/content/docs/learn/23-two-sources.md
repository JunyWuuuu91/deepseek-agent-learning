---
title: "文章和原型各说什么"
description: "2026-10-31 的仓库是研究原型。架构文章描述的设计更宽，README 写明有些设计没有实现。"
---

先把两份材料分开，后面每一课都沿用这个区分。

**仓库。** [github.com/deepseek-ai/dsh-superagent](https://github.com/deepseek-ai/dsh-superagent) 会 301 到 [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)。仓库创建时间是 2026-10-31。许可证 MIT。`package.json` 的名字是 `dsh-superagent`，版本 0.1.0，要求 Node `^22.19.0 || >=24`，以及 `dsh` `^0.2.1-alpha.2`。`pnpm check` 会跑类型检查、测试和构建。

README 的原话需要整段记住：这是研究原型，不是 DeepSeek 的官方产品；代码从团队日常开发里长出来，大量工程由编程智能体完成；它可能有缺陷，风格也不一致。为了发表做过改编，所以它和内部版本、以及和文章《Exploring Super-agent Design: Towards a More Autonomous Agent System》里的实现不完全相同。文章里的一些设计是未来方向，没有在这个原型里实现。

它在产品形态上是 DeepSeek Harness 的一个包：监听一个 GitHub 仓库，可选飞书。被允许的人提出工作后，它开一张工单，在自己的会话和目录里做，再回到原来的对话里回答，例如带一个拉取请求。网页面板只把需要人处理的东西放在前面。

**文章。** [这篇 X 文章](https://x.com/DeepSeekHarness/article/2116857257245987236) 开头写明：原文是中文，正文是机器翻译；文章讨论的是架构想法，不是 DeepSeek Harness 现有功能的介绍。本课读到了文章从第 1 节到第 8 节前半的正文。第 8.3 节、第 8.4 节和结论在 X 接口的返回里被截断，后文依据一份与前文吻合的[英文全文翻译](https://chinamodelapi.com/super-agent-design-deepseek)补齐，并在[来源页](/learn/sources/)标明。

编号文档要按顺序读：000 哲学、001 领域模型、002 授权、003 执行、004 提示词、005 面板、006 部署、007 架构、008 食谱。每一篇只使用前面已经定义的概念。

## 练习

1. 打开 README，把「不是官方产品」和「有些设计没有实现」两句用自己的话写下来。
2. 记下 `engines.dsh` 的范围。安装 Harness 时用 `dsh --version` 对照，不要假设 npm 上当天的 latest 一定落在这个范围里。
3. 从 000 读到 001 的术语表，先别跳到 007。

## 延伸阅读

- [原型 README](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/README.md)
- [000 Philosophy](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/000-philosophy.md)
- [架构文章](https://x.com/DeepSeekHarness/article/2116857257245987236)
