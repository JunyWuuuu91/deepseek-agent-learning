export interface Note {
  id: string;
  text: string;
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return notes
    .map((note) => ({
      note,
      score: terms.filter((term) => note.text.toLowerCase().includes(term)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.note);
}

const found = searchNotes(
  [
    { id: "a", text: "登录按钮在窄屏溢出" },
    { id: "b", text: "缓存命中要整段前缀相同" },
  ],
  "按钮 窄屏",
);
console.log(found.map((note) => note.id).join(","));
