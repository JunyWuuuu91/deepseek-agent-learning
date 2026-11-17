import { useEffect, useState } from "react";
import { parts, totalMinutes, type Chapter } from "../data/outline";

const storageKey = "agent-learning-progress-v1";

function loadDone(): string[] {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function Roadmap() {
  const [done, setDone] = useState<string[]>([]);
  const chapters = parts.flatMap((part) => part.chapters);
  const hours = Math.round(totalMinutes / 60);

  useEffect(() => {
    setDone(loadDone());
  }, []);

  function toggle(slug: string) {
    setDone((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="roadmap">
      <section className="roadmap-lead">
        <p className="kicker">约 4 到 5 周</p>
        <p>
          各章标的是阅读时间，加起来大约 {hours} 小时（{totalMinutes} 分钟）。加上把示例跑一遍，按每周 6 到 8 小时安排，第五周可以走到实验室。资料核对日期是 2026-11-17。
        </p>
        <p>
          进度存在这台浏览器的 localStorage，键名 <code>{storageKey}</code>。已勾选 {done.length} / {chapters.length}。
        </p>
      </section>
      <div className="part-grid">
        {parts.map((part) => (
          <article className="part-card" key={part.id} id={part.id}>
            <p className="kicker">
              {part.kicker} · {part.time}
            </p>
            <h2>{part.title}</h2>
            <p>{part.summary}</p>
            <ol>
              {part.chapters.map((chapter) => (
                <li key={chapter.slug}>
                  <a href={`/${chapter.slug}/`}>{chapter.title}</a>
                  <span> · {chapter.minutes} 分钟</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <section className="check-card">
        <p className="kicker">进度清单</p>
        <h2>读完就勾上</h2>
        {parts.map((part) => (
          <div key={part.id}>
            <h3>{part.title}</h3>
            {part.chapters.map((chapter) => (
              <Check
                key={chapter.slug}
                chapter={chapter}
                checked={done.includes(chapter.slug)}
                onToggle={toggle}
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

function Check({
  chapter,
  checked,
  onToggle,
}: {
  chapter: Chapter;
  checked: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <label className="check-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(chapter.slug)}
      />
      <span>
        <a href={`/${chapter.slug}/`}>{chapter.title}</a>
      </span>
    </label>
  );
}
