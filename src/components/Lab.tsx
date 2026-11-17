import { useEffect, useState, type FormEvent } from "react";
import {
  CONCEPT_LABEL,
  PRESETS,
  SCRIPT_IDS,
  SOURCE_LABEL,
  STAGE_LABEL,
  apply,
  initialState,
  pendingItems,
  type AcceptMode,
  type Choice,
  type IncomingEvent,
  type LabState,
  type SourceId,
} from "../lib/routerMachine";

const SPEEDS = [
  { id: "slow", label: "慢", ms: 1600 },
  { id: "mid", label: "中", ms: 1000 },
  { id: "fast", label: "快", ms: 550 },
] as const;

export default function Lab() {
  const [frames, setFrames] = useState<LabState[]>([initialState()]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]["id"]>("mid");
  const [source, setSource] = useState<SourceId>("chat");
  const [thread, setThread] = useState("新线程");
  const [text, setText] = useState("");
  const state = frames[index] ?? initialState();
  const pending = pendingItems(state);
  const ms = SPEEDS.find((item) => item.id === speed)?.ms ?? 1000;

  function commit(next: LabState) {
    const kept = frames.slice(0, index + 1);
    setFrames([...kept, next]);
    setIndex(kept.length);
  }

  function ingest(event: IncomingEvent) {
    setPlaying(false);
    commit(apply(state, { type: "ingest", event }));
  }

  function forward() {
    if (index < frames.length - 1) {
      setIndex(index + 1);
      return;
    }
    if (pending.length > 0) return;
    const seen = new Set(state.timeline.map((item) => item.eventId));
    const next = PRESETS.find((item) => (SCRIPT_IDS as readonly string[]).includes(item.id) && !seen.has(item.id));
    if (!next) {
      setPlaying(false);
      return;
    }
    commit(apply(state, { type: "ingest", event: next }));
  }

  useEffect(() => {
    if (!playing || pending.length > 0) return;
    const timer = window.setTimeout(forward, ms);
    return () => window.clearTimeout(timer);
  });

  function onCustom(event: FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;
    ingest({
      id: `custom-${state.seq + 1}`,
      source,
      thread: thread.trim() || "新线程",
      text: body,
      label: "自定义",
    });
    setText("");
  }

  function choose(ticketId: string, choice: Choice) {
    setPlaying(false);
    commit(apply(state, { type: "decide", ticketId, choice }));
  }

  return (
    <div className="lab">
      <div className="lab-bar">
        <div>
          <p className="kicker">本地状态机 · 不调用模型，不发出请求</p>
          <h2>Router–Worker 实验室</h2>
        </div>
        <div className="lab-actions">
          <label className="lab-mode">
            接受模式
            <select
              value={state.mode}
              onChange={(event) => commit(apply(state, { type: "mode", mode: event.target.value as AcceptMode }))}
            >
              <option value="observe">observe 只记录</option>
              <option value="auto">auto 接未点名的工作</option>
            </select>
          </label>
          <button type="button" className="secondary" onClick={() => index > 0 && setIndex(index - 1)} disabled={index === 0}>
            上一步
          </button>
          <button type="button" onClick={forward} disabled={pending.length > 0 && index >= frames.length - 1}>
            下一步
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => {
              setFrames([initialState()]);
              setIndex(0);
              setPlaying(false);
            }}
          >
            重来
          </button>
          <button type="button" className={playing ? "secondary" : ""} onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>
            {playing ? "暂停" : "自动播放"}
          </button>
          <label className="lab-mode">
            速度
            <select value={speed} onChange={(event) => setSpeed(event.target.value as (typeof SPEEDS)[number]["id"])}>
              {SPEEDS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {state.lesson ? (
        <aside className="lab-callout">
          <p className="kicker">{CONCEPT_LABEL[state.lesson.concept]}</p>
          <p>{state.lesson.lesson}</p>
          <a href={state.lesson.href}>看这一课</a>
        </aside>
      ) : (
        <aside className="lab-callout">
          <p className="kicker">Trigger</p>
          <p>从左边送入一条事件。快路径由代码决定，慢路径才像一次模型判断。点名用 @agent 或「请智能体」。</p>
          <a href="/learn/26-triggers/">看触发这一课</a>
        </aside>
      )}

      <div className="lab-grid">
        <section className="lab-pane">
          <header>
            <h3>事件</h3>
            <span className="lab-count">{state.timeline.length}</span>
          </header>
          <form className="lab-form" onSubmit={onCustom}>
            <div className="lab-presets">
              {PRESETS.map((item) => (
                <button key={item.id} type="button" className="secondary" onClick={() => ingest(item)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="lab-fields">
              <label>
                来源
                <select value={source} onChange={(event) => setSource(event.target.value as SourceId)}>
                  {(Object.keys(SOURCE_LABEL) as SourceId[]).map((id) => (
                    <option key={id} value={id}>
                      {SOURCE_LABEL[id]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                线程
                <input value={thread} onChange={(event) => setThread(event.target.value)} />
              </label>
            </div>
            <label>
              内容
              <input value={text} onChange={(event) => setText(event.target.value)} placeholder="@agent 描述一件工作" />
            </label>
            <button type="submit" disabled={text.trim() === ""}>
              送入
            </button>
          </form>
          {state.timeline.length === 0 ? (
            <p className="lab-empty">还没有事件。先点「群聊闲谈」，看快路径如何丢掉它。</p>
          ) : (
            <ol className="lab-feed">
              {state.timeline.map((item) => (
                <li key={item.id} className="lab-card">
                  <b>{SOURCE_LABEL[item.source]} · {item.thread}</b>
                  <p>{item.text}</p>
                  <span className={item.path === "fast" ? "lab-pill" : "lab-pill is-slow"}>{item.path === "fast" ? "快路径" : "慢路径"}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="lab-pane">
          <header>
            <h3>路由与工人</h3>
            <span className="lab-count">{state.tickets.length}</span>
          </header>
          {state.tickets.length === 0 ? (
            <p className="lab-empty">工单出现在慢路径接单之后。路由只派工，不在这里改代码。</p>
          ) : (
            state.tickets.map((ticket) => (
              <article key={`${ticket.id}-${ticket.stage}`} className="lab-card lab-ticket">
                <div className="lab-ticket-top">
                  <b>{ticket.id}</b>
                  <span className={`lab-stage is-${ticket.stage}`}>{STAGE_LABEL[ticket.stage]}</span>
                </div>
                <h3>{ticket.title}</h3>
                <p className="lab-meta">{ticket.trail} · 线程 {ticket.thread}{ticket.subscribed ? " · 已订阅" : ""}</p>
                <ol className="lab-steps">
                  {ticket.steps.map((step) => (
                    <li key={step.id}>
                      <code>{step.name}</code>
                      <span>{step.detail}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))
          )}
        </section>

        <section className="lab-pane">
          <header>
            <h3>待人工决定</h3>
            <span className="lab-count" aria-label={`${pending.length} 件待处理`}>{pending.length}</span>
          </header>
          {pending.length === 0 ? (
            <p className="lab-empty">现在没有要你处理的事。健康的时候，这一栏就该是空的。</p>
          ) : (
            pending.map((item) => (
              <article key={item.id} className={`lab-card lab-pending is-${item.kind}`}>
                <b>{item.kind === "question" ? "要一个决定" : item.kind === "acceptance" ? "等验收" : "做失败了"}</b>
                <h3>{item.title}</h3>
                <p className="lab-meta">{item.detail}</p>
                <div className="lab-actions">
                  {item.kind === "question" ? (
                    <>
                      <button type="button" onClick={() => choose(item.ticketId, "approve")}>改成 480px</button>
                      <button type="button" className="secondary" onClick={() => choose(item.ticketId, "reject")}>先不改</button>
                    </>
                  ) : null}
                  {item.kind === "acceptance" ? (
                    <>
                      <button type="button" onClick={() => choose(item.ticketId, "accept")}>验收通过</button>
                      <button type="button" className="secondary" onClick={() => choose(item.ticketId, "return")}>退回</button>
                    </>
                  ) : null}
                  {item.kind === "failure" ? (
                    <>
                      <button type="button" onClick={() => choose(item.ticketId, "retry")}>重试</button>
                      <button type="button" className="secondary" onClick={() => choose(item.ticketId, "stop")}>停止</button>
                    </>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      <section className="lab-timeline">
        <header>
          <h3>时间线</h3>
        </header>
        {state.timeline.length === 0 ? (
          <p className="lab-empty">每一步的路径和理由会记在这里。</p>
        ) : (
          <ol>
            {state.timeline.map((item, itemIndex) => (
              <li key={item.id}>
                <span className="lab-meta">{itemIndex + 1}</span>
                <span className={item.path === "fast" ? "lab-pill" : "lab-pill is-slow"}>{item.path === "fast" ? "快" : "慢"}</span>
                <span>{item.reason}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
