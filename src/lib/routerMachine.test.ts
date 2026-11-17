import assert from "node:assert/strict";
import { PRESETS, apply, initialState, pendingItems, type LabState } from "./routerMachine.ts";

const preset = (id: string) => {
  const event = PRESETS.find((item) => item.id === id);
  if (!event) throw new Error(id);
  return event;
};

function send(state: LabState, id: string) {
  return apply(state, { type: "ingest", event: preset(id) });
}

let state = initialState();
state = send(state, "lunch");
assert.equal(state.tickets.length, 0);
assert.equal(state.timeline[0]?.path, "fast");
assert.match(state.timeline[0]?.reason ?? "", /快路径/);

state = send(state, "bug");
assert.equal(state.tickets.length, 1);
assert.equal(state.tickets[0]?.stage, "working");
assert.equal(state.tickets[0]?.thread, "issue-login");
assert.equal(state.tickets[0]?.steps.length, 2);
assert.match(state.tickets[0]?.trail ?? "", /新建 → 执行中/);

state = send(state, "ci");
assert.equal(state.tickets.length, 1);
assert.equal(state.tickets[0]?.stage, "attention");
assert.match(state.tickets[0]?.question ?? "", /480px/);
assert.equal(pendingItems(state).length, 1);
assert.equal(pendingItems(state)[0]?.kind, "question");

const rejected = apply(state, { type: "decide", ticketId: "ticket-1", choice: "reject" });
assert.equal(rejected.tickets[0]?.stage, "dropped");
assert.equal(rejected.tickets[0]?.subscribed, false);
assert.equal(pendingItems(rejected).length, 0);

const approved = apply(state, { type: "decide", ticketId: "ticket-1", choice: "approve" });
assert.equal(approved.tickets[0]?.stage, "review");
assert.equal(approved.tickets[0]?.question, undefined);
assert.equal(pendingItems(approved)[0]?.kind, "acceptance");
const done = apply(approved, { type: "decide", ticketId: "ticket-1", choice: "accept" });
assert.equal(done.tickets[0]?.stage, "done");

const observed = send(initialState(), "pr");
assert.equal(observed.tickets.length, 0);
assert.equal(observed.timeline[0]?.path, "slow");
assert.match(observed.timeline[0]?.reason ?? "", /observe/);

const auto = send(apply(initialState(), { type: "mode", mode: "auto" }), "pr");
assert.equal(auto.tickets.length, 1);
assert.equal(auto.tickets[0]?.stage, "review");

const mailed = send(initialState(), "email");
assert.equal(mailed.tickets[0]?.stage, "review");
assert.equal(pendingItems(mailed)[0]?.kind, "acceptance");

const stuck = apply(initialState(), {
  type: "ingest",
  event: { id: "stuck", source: "github", thread: "issue-crash", text: "@agent 这个崩溃无法复现", label: "复现失败" },
});
assert.equal(stuck.tickets[0]?.stage, "failed");
assert.equal(pendingItems(stuck)[0]?.kind, "failure");
const retried = apply(stuck, { type: "decide", ticketId: "ticket-1", choice: "retry" });
assert.equal(retried.tickets[0]?.stage, "working");
const stopped = apply(stuck, { type: "decide", ticketId: "ticket-1", choice: "stop" });
assert.equal(stopped.tickets[0]?.stage, "dropped");

const follow = send(send(initialState(), "bug"), "follow");
assert.equal(follow.tickets.length, 1);
assert.equal(follow.tickets[0]?.stage, "attention");
assert.equal(follow.timeline.at(-1)?.concept, "subscription");

console.log("router machine ok");
