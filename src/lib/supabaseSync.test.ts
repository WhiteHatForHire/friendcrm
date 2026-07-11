import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import type { CrmData } from "../types";
import { prepareCrmDataForHostedSync } from "./supabaseSync";

describe("prepareCrmDataForHostedSync", () => {
  it("keeps local data shape but excludes unconfirmed durable memories from hosted sync", () => {
    const data: CrmData = {
      ...structuredClone(seedData),
      memories: [
        {
          id: "m-unconfirmed",
          personId: "p-ada",
          sourceNoteId: "n-ada-1",
          text: "AI guessed a memory that the user has not confirmed.",
          category: "other",
          confidence: "low",
          sensitivity: "normal",
          confirmed: false
        },
        ...seedData.memories
      ]
    };

    const prepared = prepareCrmDataForHostedSync(data);

    expect(prepared.memories.some((memory) => memory.id === "m-unconfirmed")).toBe(false);
    expect(prepared.memories.every((memory) => memory.confirmed)).toBe(true);
    expect(prepared.people).toEqual(data.people);
    expect(prepared.notes).toEqual(data.notes);
    expect(data.memories.some((memory) => memory.id === "m-unconfirmed")).toBe(true);
  });
});
