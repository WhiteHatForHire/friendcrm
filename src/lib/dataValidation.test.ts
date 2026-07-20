import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import {
  CURRENT_CRM_SCHEMA_VERSION,
  SUPPORTED_CRM_SCHEMA_VERSIONS,
  createCrmDataExport,
  normalizeCrmDataExport,
  parseCrmDataExport,
  parseCrmDataJson,
  summarizeCrmData,
  validateCrmData
} from "./dataValidation";

describe("CRM data validation", () => {
  it("accepts exported CRM data", () => {
    const result = validateCrmData(seedData);

    expect(result.ok).toBe(true);
  });

  it("accepts schema-versioned export envelopes", () => {
    const result = parseCrmDataExport(createCrmDataExport(seedData, "2026-06-23T00:00:00.000Z"));

    expect(result.ok).toBe(true);
  });

  it("documents supported schema migration versions", () => {
    expect(SUPPORTED_CRM_SCHEMA_VERSIONS).toEqual([CURRENT_CRM_SCHEMA_VERSION]);
  });

  it("normalizes current version export envelopes through the migration registry", () => {
    const result = normalizeCrmDataExport(createCrmDataExport(seedData, "2026-06-23T00:00:00.000Z"));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.sourceVersion).toBe(1);
      expect(result.envelope.schemaVersion).toBe(CURRENT_CRM_SCHEMA_VERSION);
      expect(result.envelope.exportedAt).toBe("2026-06-23T00:00:00.000Z");
      expect(result.value.people).toHaveLength(10);
    }
  });

  it("keeps unversioned raw exports backward-compatible", () => {
    const result = parseCrmDataJson(JSON.stringify(seedData));

    expect(result.ok).toBe(true);
  });

  it("normalizes older open loops without sensitivity labels", () => {
    const olderData = {
      ...seedData,
      openLoops: seedData.openLoops.map(({ sensitivity: _sensitivity, ...loop }) => loop)
    };
    const result = parseCrmDataJson(JSON.stringify(olderData));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.openLoops.every((loop) => loop.sensitivity === "normal")).toBe(true);
    }
  });

  it("normalizes unversioned raw exports into the current envelope", () => {
    const result = normalizeCrmDataExport(seedData, "2026-06-23T12:00:00.000Z");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.sourceVersion).toBe("unversioned");
      expect(result.envelope).toMatchObject({
        schemaVersion: CURRENT_CRM_SCHEMA_VERSION,
        exportedAt: "2026-06-23T12:00:00.000Z",
        app: "friend-crm"
      });
    }
  });

  it("rejects unsupported schema versions", () => {
    const result = parseCrmDataExport({
      ...createCrmDataExport(seedData),
      schemaVersion: CURRENT_CRM_SCHEMA_VERSION + 1
    });

    expect(result).toEqual({
      ok: false,
      errors: [`Unsupported Friend CRM schema version: ${CURRENT_CRM_SCHEMA_VERSION + 1}.`]
    });
  });

  it("rejects invalid JSON imports", () => {
    const result = parseCrmDataJson("{not-json");

    expect(result).toEqual({ ok: false, errors: ["Import must be valid JSON."] });
  });

  it("rejects missing top-level arrays", () => {
    const result = validateCrmData({ people: [] });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "notes must be an array.",
          "memories must be an array.",
          "openLoops must be an array."
        ])
      );
    }
  });

  it("rejects malformed people and notes", () => {
    const result = validateCrmData({
      ...seedData,
      people: [{ id: "", name: "", relationshipTypes: "friend", contactMethods: [] }],
      notes: [{ id: "n-test", personIds: "p-test", rawText: "" }]
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "people[0].id must be a non-empty string.",
          "people[0].name must be a non-empty string.",
          "people[0].relationshipTypes must be an array.",
          "notes[0].personIds must be an array.",
          "notes[0].rawText must be a non-empty string."
        ])
      );
    }
  });

  it("validates structured contact methods and optional profile photos", () => {
    const result = validateCrmData({
      ...seedData,
      people: [
        {
          ...seedData.people[0],
          profilePhotoUrl: "https://example.com/ada.jpg",
          contactMethods: [
            { type: "linkedin", value: "https://linkedin.com/in/ada" },
            { type: "website", value: "https://ada.example" }
          ]
        },
        { ...seedData.people[1], contactMethods: [{ type: "carrier_pigeon", value: "nope" }] },
        { ...seedData.people[2], contactMethods: [{ type: "instagram", value: "" }] }
      ]
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "people[1].contactMethods[0].type must be one of: phone, email, instagram, twitter, x, linkedin, website, signal, whatsapp, other.",
          "people[2].contactMethods[0].value must be a non-empty string."
        ])
      );
    }
  });

  it("rejects invalid enums and malformed dates", () => {
    const result = validateCrmData({
      ...seedData,
      people: [{ ...seedData.people[0], warmth: "lukewarm", nextContactAt: "tomorrow" }],
      notes: [{ ...seedData.notes[0], occurredAt: "06/13/2026", sourceType: "email" }]
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "people[0].warmth must be one of: cold, cool, neutral, warm, hot.",
          "people[0].nextContactAt must use YYYY-MM-DD format.",
          "notes[0].occurredAt must use YYYY-MM-DD format.",
          "notes[0].sourceType must be one of: manual, call, dinner, meeting, text_summary, memory."
        ])
      );
    }
  });

  it("rejects duplicate IDs and broken references", () => {
    const result = validateCrmData({
      ...seedData,
      people: [seedData.people[0], { ...seedData.people[1], id: seedData.people[0].id }],
      notes: [{ ...seedData.notes[0], personIds: ["p-missing"] }],
      memories: [{ ...seedData.memories[0], sourceNoteId: "n-missing" }],
      openLoops: [{ ...seedData.openLoops[0], personId: "p-missing" }],
      nextMoves: [{ ...seedData.nextMoves[0], personId: "p-missing" }]
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "people[1].id must be unique.",
          "notes[0].personIds[0] must reference an existing record.",
          "memories[0].sourceNoteId must reference an existing record.",
          "openLoops[0].personId must reference an existing record.",
          "nextMoves[0].personId must reference an existing record."
        ])
      );
    }
  });

  it("summarizes import previews", () => {
    expect(summarizeCrmData(seedData)).toMatchObject({
      people: 10,
      notes: 5,
      memories: 5,
      openLoops: 3,
      nextMoves: 3,
      interactions: 0,
      privatePeople: 3,
      sensitivePeople: 5,
      sensitiveNotes: 2,
      sensitiveMemories: 2,
      sensitiveOpenLoops: 1,
      sensitiveOrPrivate: 10,
      firstPeople: ["Claire Dawson", "Jules Moreno", "Mira Chen", "Niko Alvarez", "Maya Kline"],
      oldestNoteDate: "2026-04-19",
      newestNoteDate: "2026-06-13"
    });
  });
});
