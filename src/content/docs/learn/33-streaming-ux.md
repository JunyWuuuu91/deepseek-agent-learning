---
title: "流式体验和工具可视化"
description: "增量要留在原地，工具调用显示成步骤而不是一串 JSON，需要人决定的动作从日志里抬到面板上。"
---

流式界面最容易做错的是布局跳。新字到来时，如果用户正在往上读，就不要把滚动条拽到底。只有在他本来就贴着底部时才跟随。chat-demo 把滚动上下文放在 `src/components/messages/scrollContext.ts`，阅读时可以对照，不必先重写一遍。

助手那一行在第一个字之前就占位。占位符用「…」，完成后换成正文。停止之后保留已经写出的字，并允许重试这一轮。失败用 `role="alert"`，和正文的颜色区分开。

工具调用不要把参数 JSON 直接拼进回答。官方聊天机器人指南把块分成思考、搜索步骤、打开的页面、带引用的正文，以及 `stop_reason: "refusal"`。你的界面至少给每种块一个标题：思考可折叠，搜索是一列链接，正文里的引用可以点。未知的块显示类型名，不要丢掉。

人在回路从工具日志里抬出来。`decide()` 返回 `pending` 时，主界面出现一块「待人工决定」，而不是希望人在一千行日志里找到那个问题。同意和拒绝都要写回工具结果，模型才能继续。

多会话时，正在跑的那一个用状态点标出，完成的不要闪烁通知。原型的哲学是健康状态不占注意力。一个已经成功的工具调用可以收进折叠，失败和等待人的调用保持展开。

## 练习

1. 给第 4 课的列表加上「仅在贴底时跟随」的滚动。用鼠标滚上去，确认新字不再把你拽下去。
2. 造一个假的工具调用，渲染成「正在查询天气 · 杭州」，完成后再收成一行。
3. 把 `refusal` 渲染成固定的拒绝文案，不展示模型原文。

## 延伸阅读

- [构建聊天机器人：如何渲染块](https://api-docs.deepseek.com/guides/build_a_chatbot/)
- [chat-demo 的 ReplyArea](https://github.com/deepseek-ai/chat-demo/blob/main/src/components/messages/ReplyArea.tsx)
- [005 Panel 的安静原则](https://github.com/deepseek-ai/dsh-superagent-prototype/blob/main/docs/005-panel.md)
