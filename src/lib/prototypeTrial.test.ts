import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import type { CrmData, NextMove, Person, RelationshipNote } from "../types";
import {
  addNextMoveRecord,
  addPersonRecord,
  addRelationshipNote,
  deletePersonRecord,
  deleteRelationshipNote,
  getPersonDeleteImpact,
  saveAcceptedSuggestions,
  updateNextMoveStatus
} from "./crm";
import { buildBrief, radar } from "./insights";
import { exportJson, exportMarkdown } from "./storage";
import { extractMemorySuggestionsForReview } from "./aiExtractorRoute";
import { generateBriefForReview, generateNextMovesForReview } from "./aiGenerationRoute";
import { parseCrmDataExport, summarizeCrmData } from "./dataValidation";

const simulatedNotes: Array<Omit<RelationshipNote, "id" | "createdAt">> = [
  {
    personIds: ["p-ada"],
    occurredAt: "2026-06-01",
    sourceType: "call",
    rawText: "Ada prefers a written agenda before strategy calls. Promised to send a draft by Friday.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-jules"],
    occurredAt: "2026-06-02",
    sourceType: "dinner",
    rawText: "Jules likes concrete dinner plans. Remember that family health details are private.",
    sensitivity: "private"
  },
  {
    personIds: ["p-mira"],
    occurredAt: "2026-06-03",
    sourceType: "meeting",
    rawText: "Mira likes crisp decision memos. She asked for a repo update next week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-niko"],
    occurredAt: "2026-06-04",
    sourceType: "text_summary",
    rawText: "Niko prefers low-pressure plans. Do not ask about the family conflict unless he opens it.",
    sensitivity: "private"
  },
  {
    personIds: ["p-sana"],
    occurredAt: "2026-06-05",
    sourceType: "call",
    rawText: "Sana likes context before intros. Promised to send the one-paragraph note this week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-theo"],
    occurredAt: "2026-06-06",
    sourceType: "manual",
    rawText: "Theo prefers specific collaboration asks. Follow up next week with the prototype angle.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-lena"],
    occurredAt: "2026-06-07",
    sourceType: "call",
    rawText: "Lena loves garden updates. Do not turn emotional support into a task list.",
    sensitivity: "private"
  },
  {
    personIds: ["p-ravi"],
    occurredAt: "2026-06-08",
    sourceType: "meeting",
    rawText: "Ravi prefers written scope before calls. Promised to send the revised outline tomorrow.",
    sensitivity: "sensitive"
  },
  {
    personIds: ["p-iona"],
    occurredAt: "2026-06-09",
    sourceType: "manual",
    rawText: "Iona likes spacious scheduling. Boundary: do not over-plan the next conversation.",
    sensitivity: "private"
  },
  {
    personIds: ["p-cam"],
    occurredAt: "2026-06-10",
    sourceType: "dinner",
    rawText: "Cam loves spontaneous invites. Need to send the music night link this week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-ada", "p-sana"],
    occurredAt: "2026-06-11",
    sourceType: "meeting",
    rawText: "Ada and Sana both prefer tight context. Promised to send intro framing by Friday.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-mira", "p-theo"],
    occurredAt: "2026-06-12",
    sourceType: "meeting",
    rawText: "Mira warned to avoid generic positioning. Theo asked for a concrete collaboration ask.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-jules"],
    occurredAt: "2026-06-13",
    sourceType: "text_summary",
    rawText: "Jules hates vague check-ins. Send one direct weekend option next week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-niko"],
    occurredAt: "2026-06-14",
    sourceType: "call",
    rawText: "Niko likes short calls during recovery weeks. Remember health context is sensitive.",
    sensitivity: "sensitive"
  },
  {
    personIds: ["p-lena"],
    occurredAt: "2026-06-15",
    sourceType: "memory",
    rawText: "Lena prefers care without pressure. Promise to send a small photo from the walk this week.",
    sensitivity: "private"
  },
  {
    personIds: ["p-ravi"],
    occurredAt: "2026-06-16",
    sourceType: "call",
    rawText: "Ravi likes explicit timelines. Need to follow up by Friday with the scope note.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-iona"],
    occurredAt: "2026-06-17",
    sourceType: "dinner",
    rawText: "Iona prefers direct but gentle language. Boundary: do not bring up private history casually.",
    sensitivity: "private"
  },
  {
    personIds: ["p-cam"],
    occurredAt: "2026-06-18",
    sourceType: "text_summary",
    rawText: "Cam likes playful plans. Promised to send two date options this week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-sana"],
    occurredAt: "2026-06-19",
    sourceType: "meeting",
    rawText: "Sana prefers no-surprise asks. Remember to include why the intro helps both sides.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-theo"],
    occurredAt: "2026-06-20",
    sourceType: "manual",
    rawText: "Theo likes operator examples. Need to send the demo clip next week.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-ada", "p-mira"],
    occurredAt: "2026-06-21",
    sourceType: "meeting",
    rawText: "Ada wants a tiny agenda before the next strategy chat. Mira needs the decision tree by Monday.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-jules"],
    occurredAt: "2026-06-22",
    sourceType: "call",
    rawText: "Circle back with Jules once the medical appointment chaos calms down. Do not joke about family stuff.",
    sensitivity: "private"
  },
  {
    personIds: ["p-niko", "p-cam"],
    occurredAt: "2026-06-23",
    sourceType: "text_summary",
    rawText: "Book a casual beach walk for Niko and Cam next month. Niko appreciates low-stakes plans.",
    sensitivity: "normal"
  },
  {
    personIds: ["p-ravi"],
    occurredAt: "2026-06-24",
    sourceType: "meeting",
    rawText: "Ravi said contract budget talk is sensitive. Owed him a clean scope by 2026-06-28.",
    sensitivity: "sensitive"
  },
  {
    personIds: ["p-iona"],
    occurredAt: "2026-06-25",
    sourceType: "dinner",
    rawText: "Iona loves handwritten notes. Invite her to one quiet thing, no pressure.",
    sensitivity: "private"
  }
];

function cloneSeed(): CrmData {
  return structuredClone(seedData);
}

function makeMove(id: string, personId: string, draft: string): NextMove {
  return {
    id,
    personId,
    type: "check_in",
    draft,
    rationale: "Simulated trial next move.",
    risk: "low",
    status: "idea"
  };
}

describe("simulated prototype trial", () => {
  it("exercises the core MVP loop with 10 people and 25 synthetic trial notes", async () => {
    let data = cloneSeed();
    const acceptedSourceNoteIds: string[] = [];
    const zeroSuggestionNoteIds: string[] = [];

    expect(simulatedNotes).toHaveLength(25);

    for (const [index, trialNote] of simulatedNotes.entries()) {
      const note: RelationshipNote = {
        ...trialNote,
        id: `n-trial-${index + 1}`,
        createdAt: `2026-06-${String(index + 1).padStart(2, "0")}T12:00:00.000Z`
      };

      data = addRelationshipNote(data, note, note.createdAt);
      const extraction = await extractMemorySuggestionsForReview(note, data.people);
      if (extraction.suggestions.length === 0) {
        zeroSuggestionNoteIds.push(note.id);
        continue;
      }

      const acceptedIds = extraction.suggestions
        .filter((suggestion) => acceptedSourceNoteIds.length < 12 || suggestion.kind === "openLoop")
        .slice(0, 2)
        .map((suggestion) => suggestion.id);

      if (acceptedIds.length > 0) {
        acceptedSourceNoteIds.push(note.id);
        data = saveAcceptedSuggestions(data, extraction.suggestions, acceptedIds, note.id);
      }
    }

    data = addNextMoveRecord(data, makeMove("x-trial-1", "p-mira", "Send Mira the concise repo update."));
    data = addNextMoveRecord(data, makeMove("x-trial-2", "p-cam", "Send Cam two music-night options."));
    data = updateNextMoveStatus(data, "x-trial-1", "queued");
    data = updateNextMoveStatus(data, "x-jules-1", "done");

    const signals = radar(data);
    const briefs = ["p-ada", "p-lena", "p-ravi"].map((personId) => {
      const person = data.people.find((candidate) => candidate.id === personId);
      expect(person).toBeDefined();
      return buildBrief(data, person!);
    });
    const generatedBrief = await generateBriefForReview(data, data.people.find((person) => person.id === "p-jules")!);
    const generatedMoves = await generateNextMovesForReview(
      data,
      data.people.find((person) => person.id === "p-iona")!,
      "reconnect without turning it into a whole federal program"
    );

    const markdown = exportMarkdown(data);
    const exported = exportJson(data);
    const parsedExport = parseCrmDataExport(JSON.parse(exported));
    const summary = summarizeCrmData(data);

    const noteWithAcceptedRecords = acceptedSourceNoteIds[0];
    const beforeNoteDeleteRecords =
      data.memories.filter((memory) => memory.sourceNoteId === noteWithAcceptedRecords).length +
      data.openLoops.filter((loop) => loop.sourceNoteId === noteWithAcceptedRecords).length;
    const afterNoteDelete = deleteRelationshipNote(data, noteWithAcceptedRecords);

    const disposablePerson: Person = {
      id: "p-disposable",
      name: "Disposable Trial Person",
      aliases: [],
      relationshipTypes: ["weak_tie"],
      contactMethods: [],
      importance: 1,
      warmth: "neutral",
      trust: 3,
      strategicRelevance: 1,
      sensitivity: "normal",
      createdAt: "2026-06-23T00:00:00.000Z",
      updatedAt: "2026-06-23T00:00:00.000Z"
    };
    const disposableNote: RelationshipNote = {
      id: "n-disposable",
      personIds: ["p-disposable"],
      occurredAt: "2026-06-23",
      sourceType: "manual",
      rawText: "Disposable trial note.",
      sensitivity: "normal",
      createdAt: "2026-06-23T00:00:00.000Z"
    };
    const withDisposable = addRelationshipNote(addPersonRecord(data, disposablePerson), disposableNote);
    const personDeleteImpact = getPersonDeleteImpact(withDisposable, "p-disposable");
    const afterPersonDelete = deletePersonRecord(withDisposable, "p-disposable");

    expect(data.people).toHaveLength(10);
    expect(data.notes.length).toBeGreaterThanOrEqual(seedData.notes.length + 25);
    expect(zeroSuggestionNoteIds.length).toBeLessThanOrEqual(2);
    expect(data.memories.length + data.openLoops.length).toBeGreaterThanOrEqual(24);
    expect(data.memories.length).toBeGreaterThanOrEqual(13);
    expect(data.openLoops.length).toBeGreaterThanOrEqual(10);
    expect(data.nextMoves.filter((move) => move.status !== "dismissed")).toHaveLength(5);
    expect(data.people.filter((person) => person.sensitivity !== "normal")).toHaveLength(5);
    expect(data.notes.filter((note) => note.sensitivity !== "normal").length).toBeGreaterThanOrEqual(3);
    expect(summary.people).toBe(10);
    expect(summary.notes).toBeGreaterThanOrEqual(30);
    expect(summary.sensitiveOrPrivate).toBeGreaterThanOrEqual(15);
    expect(signals.overdueLoops.length).toBeGreaterThan(0);
    expect(signals.opportunities.length).toBeGreaterThan(0);
    expect(briefs.every((brief) => brief.remember.length > 0)).toBe(true);
    expect(briefs.some((brief) => brief.avoid.length > 0)).toBe(true);
    expect(generatedBrief.brief.sensitivityWarning).toBeDefined();
    expect(generatedMoves.moves.moves.length).toBeGreaterThanOrEqual(2);
    expect(generatedMoves.moves.sensitivityWarning).toBeDefined();
    expect(markdown).toContain("# Friend CRM Export");
    expect(markdown).toContain("Ada Nkrumah");
    expect(exported).toContain('"schemaVersion": 1');
    expect(parsedExport.ok).toBe(true);
    expect(beforeNoteDeleteRecords).toBeGreaterThan(0);
    expect(afterNoteDelete.memories.some((memory) => memory.sourceNoteId === noteWithAcceptedRecords)).toBe(false);
    expect(afterNoteDelete.openLoops.some((loop) => loop.sourceNoteId === noteWithAcceptedRecords)).toBe(false);
    expect(personDeleteImpact.notesRemoved).toBe(1);
    expect(afterPersonDelete.people.some((person) => person.id === "p-disposable")).toBe(false);
  });
});
