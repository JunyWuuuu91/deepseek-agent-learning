---
title: "在本机跑起来"
description: "Node 22.12+ 和 pnpm。pnpm dev 后打开 8090。密钥填在设置里，会留在这个浏览器源的 localStorage。"
---

README 的步骤是：

```bash
git clone https://github.com/deepseek-ai/chat-demo.git
cd chat-demo
pnpm install
pnpm dev
```

然后打开 <http://localhost:8090>。`pnpm build` 把静态文件写到 `dist/`。也可以从 [Releases](https://github.com/deepseek-ai/chat-demo/releases) 下载压缩包，解压后双击 `index.html`。直接打开文件时，浏览器要允许 `file://` 页面的存储，API 要允许这个来源的跨域请求。

本课写作时没有在这台环境里执行 `pnpm dev`，也没有替你申请密钥。上面的命令来自仓库 README，端口来自 `rspack.config.ts` 里的 `devServer: { port: 8090 }`。

跑起来之后按这个顺序看：

1. 打开设置，填入自己的 API Key。刷新页面，密钥还在，说明 localStorage 生效。
2. 发一句不需要搜索的短消息。看回复是一段段出现的。
3. 点停止。生成中的请求应结束，已写出的字留下。
4. 打开思考和搜索再问一个需要网页的问题。界面上应出现思考区和搜索结果，而不是把工具 JSON 直接糊在正文里。
5. 再开一个会话。两个会话的历史分开，密钥仍然是同一份。

想换 API 根时，改的是 `createConfig({ apiOrigin })`，不是在组件里写死地址。README 写明：请求使用搜索、读链接、标题和 `latest_reminder` 等扩展，接入的服务要支持对应能力，否则这些功能不可用。基础聊天和这些扩展是分开的。

删除全部聊天的按钮会清会话、原始附件和未发送草稿，并停掉正在进行的回复。README 写明密钥和设置会保留，已经上传到 API 服务的文件不会被这个按钮删掉。

## 练习

1. 在开发者工具的 Application 面板找到 `chat-demo:api-key`。确认你知道它和站点源绑在一起。
2. 导出一次历史，再看压缩包里没有密钥。以 README 的描述为准，打开压缩包核对。
3. 把开发服务器停掉，列出会消失的东西（内存里的流）和还在的东西（localStorage、IndexedDB）。

## 延伸阅读

- [README 的运行一节](https://github.com/deepseek-ai/chat-demo/blob/main/README.zh-CN.md)
- [rspack.config.ts](https://github.com/deepseek-ai/chat-demo/blob/main/rspack.config.ts)
- [Releases](https://github.com/deepseek-ai/chat-demo/releases)
