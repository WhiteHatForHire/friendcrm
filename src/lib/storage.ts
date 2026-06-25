import { seedData } from "../data/seed";
import type { CrmData, Person } from "../types";
import { createCrmDataExport, parseCrmDataExport } from "./dataValidation";

const STORAGE_KEY = "friend-crm:data:v1";

export function loadData(): CrmData {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return seedData;
  }

  try {
    const result = parseCrmDataExport(JSON.parse(stored));
    return result.ok ? result.value : seedData;
  } catch {
    return seedData;
  }
}

export function saveData(data: CrmData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  window.localStorage.removeItem(STORAGE_KEY);
  return seedData;
}

export function makeId(prefix: string) {
  if ("crypto" in globalThis && "randomUUID" in globalThis.crypto) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function download(filename: string, contents: string, type = "text/plain") {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(data: CrmData) {
  const personSections = data.people
    .map((person) => {
      const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
      const notes = data.notes.filter((note) => note.personIds.includes(person.id));
      const loops = data.openLoops.filter((loop) => loop.personId === person.id);
      const moves = data.nextMoves.filter((move) => move.personId === person.id);

      return [
        `## ${person.name}`,
        "",
        person.summary ?? "No summary.",
        "",
        `- City: ${person.city ?? "Unknown"}`,
        person.profilePhotoUrl ? `- Profile photo: ${person.profilePhotoUrl}` : "- Profile photo: Not set",
        `- Warmth: ${person.warmth}`,
        `- Importance: ${person.importance}`,
        `- Sensitivity: ${person.sensitivity}`,
        "- Contacts:",
        person.contactMethods.length
          ? person.contactMethods.map((method) => `  - ${method.type}: ${method.value}`).join("\n")
          : "  - None",
        "",
        "### Memories",
        memories.length ? memories.map((memory) => `- ${memory.text}`).join("\n") : "No confirmed memories.",
        "",
        "### Open Loops",
        loops.length
          ? loops.map((loop) => `- [${loop.status}] (${loop.sensitivity}) ${loop.title}`).join("\n")
          : "No open loops.",
        "",
        "### Next Moves",
        moves.length ? moves.map((move) => `- [${move.status}] ${move.draft}`).join("\n") : "No next moves.",
        "",
        "### Notes",
        notes.length
          ? notes.map((note) => `- ${note.occurredAt} (${note.sensitivity}): ${note.rawText}`).join("\n")
          : "No notes."
      ].join("\n");
    })
    .join("\n\n");

  return `# Friend CRM Export\n\nGenerated ${new Date().toISOString()}\n\n${personSections}\n`;
}

export function exportJson(data: CrmData) {
  return JSON.stringify(createCrmDataExport(data), null, 2);
}

export function newPerson(name: string): Person {
  const now = new Date().toISOString();
  return {
    id: makeId("p"),
    name,
    aliases: [],
    relationshipTypes: ["friend"],
    contactMethods: [],
    importance: 3,
    warmth: "neutral",
    trust: 3,
    strategicRelevance: 3,
    sensitivity: "normal",
    createdAt: now,
    updatedAt: now
  };
}
