import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import {
  buildGenerateBriefRequest,
  generateBriefForReview,
  generateNextMovesForReview,
  runGenerateBriefRoute,
  runGenerateNextMovesRoute
} from "./aiGenerationRoute";
import type { CrmData, Person } from "../types";

const ada = seedData.people.find((person) => person.id === "p-ada")!;
const lena = seedData.people.find((person) => person.id === "p-lena")!;

function sparseData(person: Person): CrmData {
  return {
    people: [person],
    notes: [],
    memories: [],
    openLoops: [],
    nextMoves: [],
    interactions: []
  };
}

describe("generation route shells", () => {
  it("builds brief requests from minimal confirmed context", () => {
    const request = buildGenerateBriefRequest(seedData, ada);
    const serialized = JSON.stringify(request);

    expect(request.person).toMatchObject({ id: "p-ada", name: "Ada Nkrumah" });
    expect(request.memories.length).toBeGreaterThan(0);
    expect(request.recentNotes.length).toBeGreaterThan(0);
    expect(serialized).not.toContain("mira@example.com");
    expect(serialized).not.toContain("555-0134");
  });

  it("keeps unconfirmed memories out of provider-bound generation context", () => {
    const dataWithUnconfirmedMemory: CrmData = {
      ...seedData,
      memories: [
        ...seedData.memories,
        {
          id: "m-unconfirmed-provider-context",
          personId: "p-ada",
          sourceNoteId: "n-unreviewed",
          text: "Unreviewed suggestion that should not leave the review lane.",
          category: "other",
          confidence: "low",
          sensitivity: "normal",
          confirmed: false
        }
      ]
    };

    const request = buildGenerateBriefRequest(dataWithUnconfirmedMemory, ada);
    const serialized = JSON.stringify(request);

    expect(request.memories.length).toBe(
      seedData.memories.filter((memory) => memory.personId === "p-ada" && memory.confirmed).length
    );
    expect(serialized).not.toContain("Unreviewed suggestion");
    expect(serialized).not.toContain("n-unreviewed");
  });

  it("validates provider-backed briefs", async () => {
    const request = buildGenerateBriefRequest(seedData, ada);
    const result = await runGenerateBriefRoute(request, () => ({
      snapshot: "Ada likes concise context.",
      remember: ["Prefers a tight memo before calls."],
      openLoops: ["Send two founder intros"],
      avoid: [],
      goodNextMove: "Send the two founder names."
    }));

    expect(result.ok).toBe(true);
  });

  it("falls back when provider brief output is invalid", async () => {
    const result = await generateBriefForReview(seedData, ada, () => ({
      snapshot: "",
      remember: "not-array",
      openLoops: [],
      avoid: [],
      goodNextMove: "Automatically send this without review."
    }));

    expect(result.source).toBe("deterministic_fallback");
    expect(result.brief.snapshot.length).toBeGreaterThan(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("creates useful sparse-context briefs without inventing lore", async () => {
    const sparsePerson: Person = {
      id: "p-sparse",
      name: "Morgan Vale",
      aliases: [],
      relationshipTypes: ["friend"],
      contactMethods: [],
      importance: 3,
      warmth: "neutral",
      trust: 3,
      strategicRelevance: 2,
      sensitivity: "normal",
      createdAt: "2026-06-25T00:00:00.000Z",
      updatedAt: "2026-06-25T00:00:00.000Z"
    };
    const result = await generateBriefForReview(sparseData(sparsePerson), sparsePerson);

    expect(result.brief.snapshot).toContain("thin file");
    expect(result.brief.remember.join(" ")).toContain("No confirmed lore");
    expect(result.brief.openLoops.join(" ")).toContain("No open loop");
    expect(result.brief.avoid.join(" ")).toContain("Avoid pretending");
    expect(result.brief.goodNextMove).toContain("low-pressure");
    expect(result.brief.sensitivityWarning).toBeUndefined();
  });

  it("surfaces sensitive/private context in briefs without scary mystery scoring", async () => {
    const result = await generateBriefForReview(seedData, lena);

    expect(result.brief.avoid.join(" ")).toContain("protected");
    expect(result.brief.goodNextMove).toContain("Small check-in");
    expect(result.brief.sensitivityWarning).toContain("sensitive/private context");
  });

  it("validates generated next moves", async () => {
    const result = await runGenerateNextMovesRoute(
      {
        person: {
          id: "p-ada",
          name: "Ada Nkrumah",
          relationshipTypes: ["friend"],
          sensitivity: "normal"
        },
        objective: "close the founder intro loop",
        context: { memories: [], openLoops: [], recentNotes: [] }
      },
      () => ({
        moves: [
          {
            type: "message",
            draft: "Send Ada the two names.",
            rationale: "She asked for specific intros.",
            risk: "low",
            riskReason: "Specific and expected."
          }
        ]
      })
    );

    expect(result.ok).toBe(true);
  });

  it("falls back when generated next moves include risky instructions", async () => {
    const result = await generateNextMovesForReview(seedData, ada, "send the founder names", () => ({
      moves: [
        {
          type: "message",
          draft: "Automatically send this without review.",
          rationale: "Bad idea.",
          risk: "low",
          riskReason: "Bad."
        }
      ]
    }));

    expect(result.source).toBe("deterministic_fallback");
    expect(result.moves.moves.length).toBeGreaterThan(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("generates direct, warmer, and careful next-move options from open loops", async () => {
    const result = await generateNextMovesForReview(seedData, ada, "close the founder intro loop");
    const drafts = result.moves.moves.map((move) => move.draft).join(" ");
    const rationales = result.moves.moves.map((move) => move.rationale).join(" ");

    expect(result.moves.moves).toHaveLength(3);
    expect(drafts).toContain("Send two founder intros");
    expect(rationales).toContain("Direct option");
    expect(rationales).toContain("Warmer option");
    expect(rationales).toContain("Low-pressure option");
    expect(result.moves.moves.every((move) => move.riskReason.length > 0)).toBe(true);
  });

  it("keeps private-context generated moves visibly cautious", async () => {
    const result = await generateNextMovesForReview(seedData, lena, "check in about the garden");

    expect(result.moves.sensitivityWarning).toContain("sensitive/private context");
    expect(result.moves.moves.every((move) => move.risk === "medium")).toBe(true);
    expect(result.moves.moves.map((move) => move.riskReason).join(" ")).toContain("Known boundary");
  });
});
