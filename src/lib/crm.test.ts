import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import type { CrmData, ExtractionSuggestion, Interaction, Person, RelationshipNote } from "../types";
import {
  addNextMoveRecord,
  addPersonRecord,
  addRelationshipNote,
  deletePersonRecord,
  deleteRelationshipNote,
  getPersonDeleteImpact,
  saveAcceptedSuggestions,
  updateLoopStatus,
  updateNextMoveStatus,
  upsertPersonRecord
} from "./crm";

function cloneSeed(): CrmData {
  return structuredClone(seedData);
}

describe("person records", () => {
  it("adds and updates people without mutating existing state", () => {
    const data = cloneSeed();
    const person: Person = {
      id: "p-test",
      name: "Test Person",
      aliases: [],
      relationshipTypes: ["friend"],
      contactMethods: [],
      importance: 3,
      warmth: "neutral",
      trust: 3,
      strategicRelevance: 2,
      sensitivity: "normal",
      createdAt: "2026-06-22T00:00:00.000Z",
      updatedAt: "2026-06-22T00:00:00.000Z"
    };

    const withPerson = addPersonRecord(data, person);
    const updated = upsertPersonRecord(withPerson, { ...person, city: "Jakarta", warmth: "warm" });

    expect(withPerson.people[0]).toEqual(person);
    expect(data.people.some((candidate) => candidate.id === person.id)).toBe(false);
    expect(updated.people.find((candidate) => candidate.id === person.id)?.city).toBe("Jakarta");
    expect(updated.people.find((candidate) => candidate.id === person.id)?.warmth).toBe("warm");
  });

  it("deletes a person and removes or detaches related records safely", () => {
    const data = cloneSeed();
    const sharedNote: RelationshipNote = {
      id: "n-shared",
      personIds: ["p-ada", "p-sana"],
      occurredAt: "2026-06-22",
      sourceType: "meeting",
      rawText: "Ada and Sana compared intro ideas.",
      sensitivity: "normal",
      createdAt: "2026-06-22T00:00:00.000Z"
    };
    const soloNote: RelationshipNote = {
      id: "n-solo",
      personIds: ["p-ada"],
      occurredAt: "2026-06-22",
      sourceType: "manual",
      rawText: "Ada only note.",
      sensitivity: "normal",
      createdAt: "2026-06-22T00:00:00.000Z"
    };
    const sharedInteraction: Interaction = {
      id: "i-shared",
      personIds: ["p-ada", "p-sana"],
      date: "2026-06-22",
      channel: "dinner",
      summary: "Shared dinner",
      emotionalRead: "warm",
      followUps: "none",
      reflection: "good"
    };

    const deleted = deletePersonRecord(
      {
        ...data,
        notes: [sharedNote, soloNote, ...data.notes],
        interactions: [sharedInteraction],
        memories: [
          {
            id: "m-test",
            personId: "p-ada",
            sourceNoteId: "n-solo",
            text: "Ada memory",
            category: "other",
            confidence: "high",
            sensitivity: "normal",
            confirmed: true
          },
          ...data.memories
        ],
        openLoops: [
          {
            id: "o-test",
            personId: "p-ada",
            title: "Ada loop",
            sensitivity: "normal",
            status: "open"
          },
          ...data.openLoops
        ],
        nextMoves: [
          {
            id: "x-test",
            personId: "p-ada",
            type: "message",
            draft: "Ada move",
            rationale: "test",
            risk: "low",
            status: "idea"
          },
          ...data.nextMoves
        ]
      },
      "p-ada"
    );

    expect(deleted.people.some((person) => person.id === "p-ada")).toBe(false);
    expect(deleted.memories.some((memory) => memory.personId === "p-ada")).toBe(false);
    expect(deleted.openLoops.some((loop) => loop.personId === "p-ada")).toBe(false);
    expect(deleted.nextMoves.some((move) => move.personId === "p-ada")).toBe(false);
    expect(deleted.notes.some((note) => note.id === "n-solo")).toBe(false);
    expect(deleted.notes.find((note) => note.id === "n-shared")?.personIds).toEqual(["p-sana"]);
    expect(deleted.interactions.find((interaction) => interaction.id === "i-shared")?.personIds).toEqual(["p-sana"]);
  });

  it("summarizes person delete consequences before deleting", () => {
    const data = cloneSeed();
    const impact = getPersonDeleteImpact(data, "p-ada");

    expect(impact).toMatchObject({
      personId: "p-ada",
      personName: "Ada Nkrumah",
      notesRemoved: 1,
      memoriesRemoved: 1,
      openLoopsRemoved: 1,
      nextMovesRemoved: 1
    });
  });
});

describe("relationship notes", () => {
  it("adds a note and updates contact history for every selected person", () => {
    const data = cloneSeed();
    const note: RelationshipNote = {
      id: "n-new",
      personIds: ["p-ada", "p-sana"],
      occurredAt: "2026-06-22",
      sourceType: "call",
      rawText: "Ada and Sana planning note.",
      sensitivity: "normal",
      createdAt: "2026-06-22T00:00:00.000Z"
    };

    const updated = addRelationshipNote(data, note, "2026-06-22T01:00:00.000Z");

    expect(updated.notes[0]).toEqual(note);
    expect(updated.people.find((person) => person.id === "p-ada")?.lastContactAt).toBe("2026-06-22");
    expect(updated.people.find((person) => person.id === "p-sana")?.lastContactAt).toBe("2026-06-22");
    expect(updated.people.find((person) => person.id === "p-ada")?.updatedAt).toBe("2026-06-22T01:00:00.000Z");
  });

  it("deletes a note and removes source-backed memories and open loops", () => {
    const data = cloneSeed();
    const deleted = deleteRelationshipNote(data, "n-ada-1");

    expect(deleted.notes.some((note) => note.id === "n-ada-1")).toBe(false);
    expect(deleted.memories.some((memory) => memory.sourceNoteId === "n-ada-1")).toBe(false);
    expect(deleted.openLoops.some((loop) => loop.sourceNoteId === "n-ada-1")).toBe(false);
    expect(deleted.people.find((person) => person.id === "p-ada")?.lastContactAt).toBeUndefined();
  });
});

describe("review suggestions", () => {
  it("saves only accepted suggestions and confirmed memories", () => {
    const data = cloneSeed();
    const suggestions: ExtractionSuggestion[] = [
      {
        id: "s-memory",
        kind: "memory",
        personId: "p-ada",
        title: "Preference",
        body: "Prefers tight context before calls.",
        basis: "Ada prefers tight context before calls.",
        sensitivity: "normal",
        category: "preference",
        confidence: "high"
      },
      {
        id: "s-loop",
        kind: "openLoop",
        personId: "p-ada",
        title: "Send two names",
        body: "Promised to send two names.",
        basis: "Promised to send two names.",
        sensitivity: "private"
      },
      {
        id: "s-rejected",
        kind: "memory",
        personId: "p-ada",
        title: "Rejected",
        body: "This should not persist.",
        basis: "Rejected basis.",
        sensitivity: "normal",
        category: "other",
        confidence: "low"
      }
    ];

    const updated = saveAcceptedSuggestions(data, suggestions, ["s-memory", "s-loop"], "n-source");

    expect(updated.memories[0]).toMatchObject({
      personId: "p-ada",
      sourceNoteId: "n-source",
      text: "Prefers tight context before calls.",
      confirmed: true
    });
    expect(updated.openLoops[0]).toMatchObject({
      personId: "p-ada",
      sourceNoteId: "n-source",
      title: "Send two names",
      sensitivity: "private",
      status: "open"
    });
    expect(updated.memories.some((memory) => memory.text === "This should not persist.")).toBe(false);
  });

  it("persists edited accepted suggestions with their source note", () => {
    const data = cloneSeed();
    const suggestions: ExtractionSuggestion[] = [
      {
        id: "s-edited-memory",
        kind: "memory",
        personId: "p-ada",
        title: "Preference",
        body: "Edited memory text.",
        basis: "Original basis from the note.",
        sensitivity: "sensitive",
        category: "boundary",
        confidence: "medium"
      },
      {
        id: "s-edited-loop",
        kind: "openLoop",
        personId: "p-ada",
        title: "Edited open loop",
        body: "Edited loop description.",
        basis: "Original loop basis from the note.",
        dueAt: "2026-06-30",
        sensitivity: "sensitive"
      }
    ];

    const updated = saveAcceptedSuggestions(data, suggestions, ["s-edited-memory", "s-edited-loop"], "n-edited");

    expect(updated.memories[0]).toMatchObject({
      sourceNoteId: "n-edited",
      text: "Edited memory text.",
      category: "boundary",
      sensitivity: "sensitive",
      confirmed: true
    });
    expect(updated.openLoops[0]).toMatchObject({
      sourceNoteId: "n-edited",
      title: "Edited open loop",
      description: "Edited loop description.",
      dueAt: "2026-06-30",
      sensitivity: "sensitive"
    });
  });
});

describe("loops and next moves", () => {
  it("updates loop status without changing unrelated loops", () => {
    const data = cloneSeed();
    const updated = updateLoopStatus(data, "o-ada-1", "done");

    expect(updated.openLoops.find((loop) => loop.id === "o-ada-1")?.status).toBe("done");
    expect(updated.openLoops.find((loop) => loop.id === "o-sana-1")?.status).toBe("planned");
  });

  it("adds and updates next moves", () => {
    const data = cloneSeed();
    const withMove = addNextMoveRecord(data, {
      id: "x-new",
      personId: "p-ada",
      type: "check_in",
      draft: "Send a quick hello.",
      rationale: "Keep the connection warm.",
      risk: "low",
      status: "idea"
    });
    const updated = updateNextMoveStatus(withMove, "x-new", "queued");

    expect(withMove.nextMoves[0].id).toBe("x-new");
    expect(updated.nextMoves.find((move) => move.id === "x-new")?.status).toBe("queued");
  });
});
