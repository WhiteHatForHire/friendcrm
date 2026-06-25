import { describe, expect, it } from "vitest";
import { seedData } from "../data/seed";
import { CURRENT_CRM_SCHEMA_VERSION } from "./dataValidation";
import { exportJson, exportMarkdown } from "./storage";

describe("exports", () => {
  it("exports schema-versioned JSON", () => {
    const parsed = JSON.parse(exportJson(seedData)) as { schemaVersion: number; app: string; data: unknown };

    expect(parsed.schemaVersion).toBe(CURRENT_CRM_SCHEMA_VERSION);
    expect(parsed.app).toBe("friend-crm");
    expect(parsed.data).toMatchObject({ people: expect.any(Array), notes: expect.any(Array) });
  });

  it("exports people, memories, open loops, next moves, and notes to Markdown", () => {
    const markdown = exportMarkdown(seedData);

    expect(markdown).toContain("# Friend CRM Export");
    expect(markdown).toContain("## Ada Nkrumah");
    expect(markdown).toContain("### Memories");
    expect(markdown).toContain("Prefers a tight memo before calls.");
    expect(markdown).toContain("### Open Loops");
    expect(markdown).toContain("Send two founder intros");
    expect(markdown).toContain("### Next Moves");
    expect(markdown).toContain("Send Ada a short note");
    expect(markdown).toContain("### Notes");
    expect(markdown).toContain("Ada is exploring a small advisory group");
  });

  it("preserves sensitivity labels in Markdown exports", () => {
    const markdown = exportMarkdown(seedData);

    expect(markdown).toContain("- Sensitivity: private");
    expect(markdown).toContain("(private): Jules seemed tired");
    expect(markdown).toContain("[open] (private) Small check-in");
  });

  it("exports profile photo references and contact methods to Markdown", () => {
    const markdown = exportMarkdown({
      ...seedData,
      people: [
        {
          ...seedData.people[0],
          profilePhotoUrl: "https://example.com/ada.jpg",
          contactMethods: [
            { type: "linkedin", value: "https://linkedin.com/in/ada" },
            { type: "website", value: "https://ada.example" }
          ]
        }
      ]
    });

    expect(markdown).toContain("- Profile photo: https://example.com/ada.jpg");
    expect(markdown).toContain("  - linkedin: https://linkedin.com/in/ada");
    expect(markdown).toContain("  - website: https://ada.example");
  });
});
