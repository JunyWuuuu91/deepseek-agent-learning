import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { sidebar } from "./src/data/outline";

export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: "从前端到 Super-agent",
      description:
        "给写过 React、还没写过模型调用的人。从一次 fetch 读到 DeepSeek Super-agent。",
      defaultLocale: "root",
      locales: {
        root: { label: "简体中文", lang: "zh-CN" },
      },
      customCss: ["./src/styles/custom.css"],
      favicon: "/favicon.svg",
      lastUpdated: true,
      editLink: {
        baseUrl: "https://github.com/JunyWuuuu91/deepseek-agent-learning/edit/master/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/JunyWuuuu91/deepseek-agent-learning",
        },
      ],
      sidebar,
    }),
  ],
});
