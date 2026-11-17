import assert from "node:assert/strict";
import { advance, resolveAttention } from "./routerMachine.ts";
import { canAdvance, initialState } from "./routerModel.ts";

let state = initialState();
assert.equal(state.ticket, null);

state = advance(state);
assert.equal(state.phase, "dropped");
assert.equal(state.ticket, null);

state = advance(state);
assert.equal(state.ticket?.id, "ticket-1");
assert.equal(state.ticket?.stage, "working");

state = advance(state);
assert.equal(state.phase, "fanout");
assert.equal(state.ticket?.stage, "working");

state = advance(state);
assert.equal(state.phase, "attention");
assert.equal(canAdvance(state), false);
assert.equal(advance(state).phase, "attention");
assert.match(state.ticket?.question ?? "", /480px/);

const rejected = resolveAttention(state, "reject");
assert.equal(rejected.ticket?.stage, "stopped");
assert.equal(rejected.phase, "closed");

const approved = resolveAttention(state, "approve");
assert.equal(approved.ticket?.stage, "review");
assert.equal(approved.ticket?.question, undefined);
const closed = advance(approved);
assert.equal(closed.phase, "closed");
assert.equal(closed.ticket?.stage, "closed");

console.log("router machine ok");
