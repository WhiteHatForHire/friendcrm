import type {
  CrmData,
  ExtractionSuggestion,
  Memory,
  OpenLoop,
  Person,
  RelationshipNote,
  Sensitivity
} from "../types";
import { makeId, today } from "./storage";

const sensitivePattern =
  /\b(health|medical|recovery|sex|money|budget|family conflict|legal|trauma|private|diagnosis|therapy|grief|sobriety|divorce|visa|immigration)\b/i;
const boundaryPattern = /\b(avoid|boundary|do not|don't|private|sensitive|not repeat)\b/i;
const promisePattern =
  /\b(promised|promise|follow up|circle back|send|share|draft|book|schedule|invite|introduce|owe|owed|need to|asked for|by friday|this week|next week|next month)\b/i;
const preferencePattern =
  /\b(prefers|likes|hates|loves|wants|appreciates|needs|works better|responds better|doesn't like|does not like|remember)\b/i;

export function daysBetween(date: string) {
  const from = new Date(`${date}T00:00:00`);
  const to = new Date(`${today()}T00:00:00`);
  return Math.floor((to.getTime() - from.getTime()) / 86_400_000);
}

export function isOverdue(date?: string) {
  return Boolean(date && new Date(`${date}T00:00:00`) < new Date(`${today()}T00:00:00`));
}

export function peopleByAttention(data: CrmData) {
  return [...data.people].sort((a, b) => {
    const aDays = a.lastContactAt ? daysBetween(a.lastContactAt) : 999;
    const bDays = b.lastContactAt ? daysBetween(b.lastContactAt) : 999;
    return b.importance * bDays - a.importance * aDays;
  });
}

export function radar(data: CrmData) {
  const neglected = data.people.filter((person) => {
    const days = person.lastContactAt ? daysBetween(person.lastContactAt) : 999;
    return person.importance >= 4 && days >= 30;
  });

  const upcoming = data.people.filter((person) => {
    if (!person.nextContactAt) return false;
    const distance = daysBetween(person.nextContactAt);
    return distance <= 0 && distance >= -14;
  });

  const overdueLoops = data.openLoops.filter((loop) => loop.status !== "done" && isOverdue(loop.dueAt));
  const fragile = data.people.filter(
    (person) => person.warmth === "cold" || person.warmth === "cool" || person.trust <= 2
  );
  const protect = data.people.filter((person) => person.sensitivity === "private");
  const opportunities = data.nextMoves.filter((move) => move.status === "idea" || move.status === "queued");

  return { neglected, upcoming, overdueLoops, fragile, protect, opportunities };
}

function inferSensitivity(text: string, fallback: Sensitivity): Sensitivity {
  if (sensitivePattern.test(text)) return text.toLowerCase().includes("private") ? "private" : "sensitive";
  return fallback;
}

function inferCategory(text: string): Memory["category"] {
  if (boundaryPattern.test(text)) return "boundary";
  if (preferencePattern.test(text)) return "preference";
  if (/\bworking on|moved|new job|family|health|city|project\b/i.test(text)) return "life_context";
  if (/\bwarned|risk|careful|fragile\b/i.test(text)) return "risk";
  return "other";
}

function dueDateFromText(text: string) {
  const lower = text.toLowerCase();
  const now = new Date();
  const next = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  if (lower.includes("today")) return next(0);
  if (lower.includes("tomorrow")) return next(1);
  if (lower.includes("this week")) return next(5);
  if (lower.includes("next week")) return next(10);
  if (lower.includes("friday")) return next((5 - now.getDay() + 7) % 7 || 7);

  const iso = lower.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  return iso?.[1];
}

export function extractSuggestions(
  note: Pick<RelationshipNote, "personIds" | "rawText" | "sensitivity">,
  people: Array<{ id: string; name: string }>
): ExtractionSuggestion[] {
  const sentences = note.rawText
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const selectedPeople = people.filter((person) => note.personIds.includes(person.id));

  return selectedPeople.flatMap((person) => {
    const personText = sentences.filter(
      (sentence) =>
        sentence.toLowerCase().includes(person.name.split(" ")[0].toLowerCase()) ||
        selectedPeople.length === 1
    );

    const memorySuggestions = personText
      .filter((sentence) => preferencePattern.test(sentence) || boundaryPattern.test(sentence))
      .map((sentence) => ({
        id: makeId("s"),
        kind: "memory" as const,
        personId: person.id,
        title: inferCategory(sentence).replace("_", " "),
        body: sentence.replace(new RegExp(`^${person.name.split(" ")[0]}\\s+`, "i"), ""),
        basis: sentence,
        category: inferCategory(sentence),
        confidence: "medium" as const,
        sensitivity: inferSensitivity(sentence, note.sensitivity)
      }));

    const loopSuggestions = personText
      .filter((sentence) => promisePattern.test(sentence))
      .map((sentence) => ({
        id: makeId("s"),
        kind: "openLoop" as const,
        personId: person.id,
        title: sentence.length > 70 ? `${sentence.slice(0, 67)}...` : sentence,
        body: sentence,
        basis: sentence,
        dueAt: dueDateFromText(sentence),
        sensitivity: inferSensitivity(sentence, note.sensitivity)
      }));

    return [...memorySuggestions, ...loopSuggestions];
  });
}

export function acceptSuggestion(suggestion: ExtractionSuggestion, sourceNoteId: string): Memory | OpenLoop {
  if (suggestion.kind === "memory") {
    return {
      id: makeId("m"),
      personId: suggestion.personId,
      sourceNoteId,
      text: suggestion.body,
      category: suggestion.category ?? "other",
      confidence: suggestion.confidence ?? "medium",
      sensitivity: suggestion.sensitivity,
      confirmed: true
    };
  }

  return {
    id: makeId("o"),
    personId: suggestion.personId,
    sourceNoteId,
    title: suggestion.title,
    description: suggestion.body,
    dueAt: suggestion.dueAt,
    sensitivity: suggestion.sensitivity,
    status: "open"
  };
}

export function buildBrief(data: CrmData, person: Person) {
  const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
  const loops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
  const notes = data.notes
    .filter((note) => note.personIds.includes(person.id))
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 3);
  const moves = data.nextMoves.filter((move) => move.personId === person.id && move.status !== "dismissed");
  const avoid = memories.filter((memory) => memory.category === "boundary" || memory.sensitivity !== "normal");

  return {
    snapshot: person.summary ?? `${person.name} has no summary yet.`,
    remember: memories.slice(0, 5).map((memory) => memory.text),
    loops: loops.map((loop) => loop.title),
    recent: notes.map((note) => `${note.occurredAt}: ${note.rawText}`),
    avoid: avoid.map((memory) => memory.text),
    nextMove: moves[0]?.draft ?? "Choose one small, direct reason to reach out."
  };
}

export function personName(data: CrmData, personId: string) {
  return data.people.find((person) => person.id === personId)?.name ?? "Unknown person";
}
