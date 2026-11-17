export interface PendingCall {
  id: string;
  name: string;
  arguments: string;
}

export type Decision =
  | { status: "pending"; call: PendingCall }
  | { status: "allowed"; result: string }
  | { status: "denied"; result: string };

const needsPerson = new Set(["write_file", "merge_pull_request"]);

export function decide(call: PendingCall, approved: boolean | null): Decision {
  if (!needsPerson.has(call.name)) {
    return { status: "allowed", result: `已执行 ${call.name}` };
  }
  if (approved === null) return { status: "pending", call };
  if (!approved) return { status: "denied", result: "人拒绝了这次调用" };
  return { status: "allowed", result: `人同意后执行 ${call.name}` };
}
