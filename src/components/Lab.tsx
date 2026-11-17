import { useState } from "react";
import { advance, resolveAttention } from "../lib/routerMachine";
import {
  canAdvance,
  events,
  initialState,
  phaseReached,
  type State,
  type Who,
} from "../lib/routerModel";

const whoLabel: Record<Who, string> = {
  gate: "准入",
  router: "路由",
  worker: "工人",
  you: "你",
};

const stageLabel: Record<NonNullable<State["ticket"]>["stage"], string> = {
  working: "执行中",
  attention: "待人工决定",
  review: "待验收",
  closed: "已结束",
  stopped: "已停止",
};

export default function Lab() {
  const [state, setState] = useState<State>(initialState);
  const pending = state.ticket?.stage === "attention" ? state.ticket : null;

  return (
    <div className="lab">
      <div className="lab-bar">
        <div>
          <p className="kicker">本地状态机 · 不调用模型</p>
          <h2>待人工决定</h2>
        </div>
        <div className="lab-actions">
          <button type="button" onClick={() => setState(initialState())} className="secondary">
            重来
          </button>
          <button type="button" disabled={!canAdvance(state)} onClick={() => setState(advance(state))}>
            下一步
          </button>
        </div>
      </div>
      <div className="lab-columns">
        <section className="lab-col">
          <h3>进来的事件</h3>
          {events.map((event) => {
            const on = phaseReached(state, event.at);
            return (
              <article className={on ? "event is-on" : "event"} key={event.id}>
                <b>{event.source}</b>
                <p>{event.text}</p>
                {on ? <span className="fate">{event.fate}</span> : <p className="quiet">尚未到达</p>}
              </article>
            );
          })}
        </section>
        <section className="lab-col">
          <h3>路由与工人</h3>
          {state.ticket ? (
            <article className="ticket">
              <div>
                <b>{state.ticket.id}</b>
                <h3>{state.ticket.title}</h3>
                <p className="quiet">{stageLabel[state.ticket.stage]}</p>
              </div>
            </article>
          ) : (
            <p className="quiet">还没有工单。闲聊不会创建工单。</p>
          )}
          <ol className="log">
            {state.lines.map((line) => (
              <li key={line.id}>
                <span className={`who who-${line.who}`}>{whoLabel[line.who]}</span>
                <span>{line.text}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="lab-col">
          <h3>待人工决定</h3>
          {pending?.question ? (
            <article className="pending">
              <b>{pending.id}</b>
              <h3>{pending.question}</h3>
              <div className="pending-actions">
                <button type="button" onClick={() => setState(resolveAttention(state, "approve"))}>
                  改成 480px
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setState(resolveAttention(state, "reject"))}
                >
                  先不改
                </button>
              </div>
            </article>
          ) : (
            <p className="quiet">
              {state.phase === "review"
                ? "问题已经回答。点下一步完成验收。"
                : "面板只在工人提出具体问题时出现。"}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
