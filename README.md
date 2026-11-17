# 从前端到 Super-agent

给写过 React、还没写过模型调用的人。这是一个中文静态站，从一次 `fetch` 讲到 DeepSeek 的 Router–Worker，并标明架构文章和 2026-10-31 公开原型之间的差别。

资料核对日期：2026-11-17。价格、模型名和包版本以当天读到的文档为准，动手前请再打开链接。

## 本地运行

需要 Node.js `>=22.23.4`（与本仓库的 `astro` 声明一致）和 npm `>=9.6.5`。

```bash
npm install
npm run dev
```

开发服务器使用端口 **4477**：

```bash
npm run dev -- --host 127.0.0.1 --port 4477
```

`npm run build` 会先做 `astro check`，再把静态站点写到 `dist/`。

```bash
npm run check:examples   # 课程里的 TypeScript 示例
npm run check:machine    # 实验室的状态机
```

示例脚本需要你自己的 `DEEPSEEK_API_KEY` 才会真正请求 API。没有密钥时，类型检查和实验室页面仍然可以运行。实验室不发起网络请求。

## 部署到 Vercel

在 Vercel 里导入这个 GitHub 仓库，使用 Astro 预设。

| 项 | 值 |
| --- | --- |
| Framework | Astro |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 22.x，且满足 `package.json` 里的 `>=22.23.4` |

`vercel.json` 写了同样的构建命令和输出目录。站点是静态的，不需要 `@astrojs/vercel` 适配器。

## 目录

学习路线在首页。章节在 `src/content/docs/learn/`。可运行片段在 `examples/`。实验室的状态机在 `src/lib/routerModel.ts` 和 `src/lib/routerMachine.ts`。

未能核实的事实写在站点的「来源与核对边界」一页，不散落成肯定句。
