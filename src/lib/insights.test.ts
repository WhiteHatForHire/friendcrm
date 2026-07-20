import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import type { RelationshipNote } from "../types";
import { extractSuggestions, radar } from "./insights";

describe("radar", () => {
  it("surfaces overdue open loops and protected people", () => {
    const signal = radar(seedData);

    expect(signal.overdueLoops.map((loop) => loop.title)).toContain("Send two founder intros");
    expect(signal.protect.map((person) => person.name)).toContain("Lauren Whitaker");
  });
});

describe("extractSuggestions", () => {
  it("keeps suggestions source-backed and requires later acceptance", () => {
    const note: RelationshipNote = {
      id: "n-test",
      personIds: ["p-ada"],
      occurredAt: "2026-06-22",
      sourceType: "manual",
      rawText: "Claire prefers tight memos. Promised to send the intro this week.",
      sensitivity: "normal",
      createdAt: "2026-06-22T00:00:00.000Z"
    };

    const suggestions = extractSuggestions(note, seedData.people);

    expect(suggestions).toHaveLength(2);
    expect(suggestions.every((suggestion) => suggestion.basis.length > 0)).toBe(true);
    expect(suggestions.map((suggestion) => suggestion.kind)).toEqual(["memory", "openLoop"]);
  });
});
