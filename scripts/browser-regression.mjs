import { Buffer } from "node:buffer";
import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const checks = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

try {
  await check("app shell loads", async () => {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => window.localStorage.removeItem("friend-crm:data:v1"));
    await page.reload({ waitUntil: "networkidle" });
    await expectText("Friend CRM");
    await expectText("People");
  });

  await check("logo tagline easter egg is harmless and deterministic", async () => {
    await expectText("Private friend intel");
    await page.getByRole("button", { name: "Cycle classified tagline" }).click();
    await expectText("Definitely not weird");
    await page.getByRole("button", { name: "Cycle classified tagline" }).click();
    await expectText("Social debt department");
  });

  await check("keyboard shortcuts switch views and focus capture controls", async () => {
    await page.keyboard.press("2");
    await page.getByRole("heading", { name: "The Radar" }).waitFor();
    await page.keyboard.press("5");
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await expectText("Keyboard Mischief");
    await page.keyboard.press("n");
    await page.getByPlaceholder("Add a suspect").waitFor();
    await waitForActivePlaceholder("Add a suspect");
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.keyboard.press("c");
    await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
    await waitForActivePlaceholder("What happened? What did they reveal? What did you foolishly promise?");
  });

  await check("people setup edits, filters, and why-now signal persist", async () => {
    const today = new Date().toISOString().slice(0, 10);
    await page.getByPlaceholder("Add a suspect").fill("Zora Test");
    await page.getByTitle("Add suspect").click();
    await page.getByLabel("Name").fill("Zora Trial");
    await page.getByLabel("City").fill("Detroit");
    await page.getByLabel("Warmth").selectOption("hot");
    await page.getByLabel("Sensitivity").selectOption("sensitive");
    await page.getByLabel("Importance").selectOption("5");
    await page.getByLabel("Trust").selectOption("4");
    await page.getByLabel("Last contact").fill("2026-06-01");
    await page.getByLabel("Next contact").fill(today);
    await page.setInputFiles("input[aria-label='Upload profile photo']", {
      name: "zora.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='#ff4aa2'/><text x='40' y='49' text-anchor='middle' font-size='30' fill='white'>Z</text></svg>")
    });
    await page.getByRole("img", { name: "Zora Trial profile" }).first().waitFor();
    await page.getByRole("button", { name: "Remove photo" }).click();
    await page.getByRole("img", { name: "Zora Trial profile" }).first().waitFor({ state: "detached" });
    await page.setInputFiles("input[aria-label='Upload profile photo']", {
      name: "zora.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='#ff4aa2'/><text x='40' y='49' text-anchor='middle' font-size='30' fill='white'>Z</text></svg>")
    });
    await page.getByRole("img", { name: "Zora Trial profile" }).first().waitFor();
    await page.getByLabel("LinkedIn").fill("https://linkedin.com/in/zora-trial");
    await page.getByLabel("Mentor").check();
    await page.getByLabel("Summary").fill("Knows where the bodies are metaphorically filed.");
    await expectText("Nudge due");
    await expectText("Ways To Appear Normal");
    await expectText("LinkedIn");

    await page.getByPlaceholder("Search the social files").fill("Zora");
    await expectText("Zora Trial");
    await page.locator(".filters select").selectOption("mentor");
    await expectText("Zora Trial");
    await page.getByLabel("Needs a little attention").check();
    await expectText("Zora Trial");

    await page.reload({ waitUntil: "networkidle" });
    await expectText("Zora Trial");
    await expectText("Detroit");
    await expectText("Nudge due");
    await page.getByRole("img", { name: "Zora Trial profile" }).first().waitFor();
    await expectText("LinkedIn");
    await page.getByPlaceholder("Search the social files").fill("");
    await page.locator(".filters select").selectOption("all");
  });

  await check("generated brief renders", async () => {
    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await expectText(/Checked by the local AI desk|Checked by the private draft desk|safe local version made this brief/);
    await expectText("Brief refreshed. Still just advice, not official lore.");
  });

  await check("local fake dossier poster lab is opt-in and harmless", async () => {
    await page.getByRole("button", { name: "Fake Dossier Art" }).click();
    await page.getByRole("heading", { name: "Poster Lab" }).waitFor();
    await expectText("BuddyScan 3000 Office Edition");
    await expectText("Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.");
    assert(await page.getByRole("button", { name: "Context Receipt" }).getAttribute("aria-expanded") === "false", "Expected context receipt accordion to start collapsed");
    await page.getByRole("button", { name: "Context Receipt" }).click();
    await expectText("No notes, contact values, social scraping, or private summaries are used.");
    await page.getByRole("button", { name: "Shuffle Bureau Nonsense" }).click();
    await expectText("Bureau nonsense shuffled. Facts untouched, dignity negotiable.");
    await page.getByRole("button", { name: "Copy Poster Text" }).click();
    await expectText(/Poster text copied|Copy failed/);
    await page.getByRole("button", { name: "Close Poster Lab" }).click();
    await page.getByRole("heading", { name: "Poster Lab" }).waitFor({ state: "detached" });
  });

  await check("major view changes clear transient rail panels and settings hides rail", async () => {
    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: "Erase File", exact: true }).click();
    await expectText("Erase File Consequences");
    await page.getByRole("button", { name: "The Radar" }).click();
    await page.getByRole("heading", { name: "The Radar" }).waitFor();
    await page.getByText("Erase File Consequences").waitFor({ state: "detached" });

    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor({ state: "detached" });

    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await assertHidden(".person-rail");
  });

  await check("generated next move can be edited before add", async () => {
    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await page.getByPlaceholder("What are we trying to pull off?").fill("follow up on the promised intro");
    await page.getByRole("button", { name: "Cook Something Up" }).click();
    const draft = page.getByLabel("Edit generated move 1");
    await draft.waitFor();
    await draft.fill("Edited regression draft: send a thoughtful follow-up about the intro.");
    await draft.locator("xpath=ancestor::article").getByRole("button", { name: "Add" }).click();
    await expectText("Draft added to the Plot Board. Still editable, still your fault.");
    await expectText("Edited regression draft: send a thoughtful follow-up about the intro.");
  });

  await check("capture and review saves edited suggestions while rejected suggestions stay out", async () => {
    await page.getByRole("button", { name: "Debrief Booth" }).click();
    const captureButton = page.getByRole("button", { name: "Capture & Interrogate" });
    await page.getByRole("button", { name: "Nobody" }).click();
    assert(await captureButton.isDisabled(), "Expected capture to be disabled without selected people");
    await page.getByRole("button", { name: "Everyone" }).click();
    await page
      .getByPlaceholder("What happened? What did they reveal? What did you foolishly promise?")
      .fill("Ada prefers espresso after 2pm. Ada asked me to send a reading list next week.");
    await captureButton.click();
    await waitForReviewPanel();
    await expectText("The note is already saved. Nothing below becomes memory until you approve it.");

    const memoryAttempt = page.locator(".review-item").filter({ hasText: "Memory Attempt" }).first();
    const openLoopAttempt = page.locator(".review-item").filter({ hasText: "Unfinished Business" }).first();
    await memoryAttempt.getByLabel("Memory text").fill("Edited browser proof: Ada likes espresso after 2pm.");
    await openLoopAttempt.getByRole("checkbox").uncheck();
    await page.getByRole("button", { name: "Make It Canon" }).click();
    await waitForReviewPanel({ state: "detached" });
    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await expectText("Edited browser proof: Ada likes espresso after 2pm.");
    await expectSectionLacksText("Unfinished Business", "reading list");
  });

  await check("note delete confirmation removes a captured note", async () => {
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTitle("Delete note and source-backed records").first().click();
    await page.waitForTimeout(100);
    await page.getByText("Ada asked me to send the three names next week").waitFor({ state: "detached" });
  });

  await check("empty extraction keeps note and disables saving records", async () => {
    await page.getByRole("button", { name: "Debrief Booth" }).click();
    const neutralNote = "We chatted about the neighborhood park after lunch.";
    await page.getByRole("button", { name: "Nobody" }).click();
    await page.getByLabel("Ada Nkrumah").check();
    await page
      .getByPlaceholder("What happened? What did they reveal? What did you foolishly promise?")
      .fill(neutralNote);
    await page.getByRole("button", { name: "Capture & Interrogate" }).click();
    await waitForReviewPanel();
    await expectText("0 of 0 source-backed records are trying to become official memory.");
    await expectText("The note was saved. No durable records extracted.");
    assert(await page.getByRole("button", { name: "Make It Canon" }).isDisabled(), "Expected save button to be disabled with no suggestions");
    await page.keyboard.press("Escape");
    await waitForReviewPanel({ state: "detached" });
    await expectText(neutralNote);
  });

  await check("plot board moves cards between statuses", async () => {
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    const ideaColumn = page.locator(".board-column").first();
    const queuedColumn = page.locator(".board-column").nth(1);
    const ideaBefore = await ideaColumn.locator(".move-card").count();
    const queuedBefore = await queuedColumn.locator(".move-card").count();
    assert(ideaBefore > 0, "Expected at least one idea card to drag");
    const firstIdeaCard = ideaColumn.locator(".move-card").first();
    const movedDraft = await firstIdeaCard.locator("p").innerText();

    await firstIdeaCard.locator(".drag-handle").dragTo(queuedColumn, { force: true });
    await expectColumnCount(0, ideaBefore - 1);
    await expectColumnCount(1, queuedBefore + 1);
    await expectColumnText(0, movedDraft, false);
    await expectColumnText(1, movedDraft, true);

    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await expectColumnCount(0, ideaBefore - 1);
    await expectColumnCount(1, queuedBefore + 1);
    await expectColumnText(1, movedDraft, true);
  });

  await check("settings export and import preview work", async () => {
    await page.getByRole("button", { name: "Evidence Locker" }).click();
    const downloadPromise = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await page.getByRole("button", { name: "Export Backup JSON" }).click();
    const download = await downloadPromise;
    assert(download, "Expected JSON export download");
    await expectText("friend-crm-export.json exported.");

    const markdownPromise = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await page.getByRole("button", { name: "Export Readable Markdown" }).click();
    const markdown = await markdownPromise;
    assert(markdown, "Expected Markdown export download");

    await page.setInputFiles("input[type=file]", {
      name: "friend-crm-malformed-import.json",
      mimeType: "application/json",
      buffer: Buffer.from("{not-json")
    });
    await expectText("Import blocked. The file is giving nonsense: Import must be valid JSON.");
    await page.getByRole("heading", { name: "Check the Saved Export Before Restore" }).waitFor({ state: "detached", timeout: 1000 }).catch(() => {
      throw new Error("Malformed import should not show import preview");
    });
    await page.getByRole("button", { name: "The People" }).click();
    await expectText("Ada Nkrumah");
    await page.getByRole("button", { name: "Evidence Locker" }).click();

    const importPayload = createImportPayload();
    await page.setInputFiles("input[type=file]", {
      name: "friend-crm-regression-import.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(importPayload))
    });
    await expectText("Import looks structurally sane. Still read the preview before replacing your local reality.");
    await expectText("Check the Saved Export Before Restore");
    await expectText("Regression Person");
    await expectText("No notes. Nothing in the diary.");
    await expectText("0 private people");
    const backupPromise = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await page.getByRole("button", { name: "Make Panic Copy Of Current File" }).click();
    const backup = await backupPromise;
    assert(backup, "Expected backup-before-replace download");
    await page.getByRole("button", { name: "Restore This Saved Export" }).click();
    await expectText("Restored saved export: 1 people and 0 notes are now the local browser dataset.");
    await page.getByRole("button", { name: "The People" }).click();
    await expectText("Regression Person");
    await page.getByRole("img", { name: "Regression Person profile" }).first().waitFor();
    await expectText("LinkedIn");
  });

  await check("sample dataset restore replaces local changes intentionally", async () => {
    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await expectText("Restore Built-In Fake Friends");
    await expectText("This is the demo safety lever.");
    await expectText("Export first if the current local data matters.");
    page.once("dialog", async (dialog) => {
      assert(dialog.message().includes("Restore the built-in fake sample dataset?"), "Expected sample restore warning");
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Restore Sample Friends" }).click();
    await page.getByRole("heading", { name: "The People" }).waitFor();
    await expectText("Ada Nkrumah");
    await expectText("Jules Moreno");
    await page.getByText("Regression Person").waitFor({ state: "detached" });
  });

  await check("person delete panel shows consequences", async () => {
    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: "Erase File", exact: true }).click();
    await expectText("Erase File Consequences");
    await expectText(/memories removed|open loops removed|next moves removed/);
  });

  await check("mobile viewport has no horizontal page overflow", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    assert(overflow <= 1, `Expected no horizontal overflow, found ${overflow}px`);
  });
} finally {
  await browser.close();
}

console.log(`# Friend CRM Browser Regression\n`);
checks.forEach((item) => {
  console.log(`- ${item.ok ? "PASS" : "FAIL"} ${item.name}${item.error ? `: ${item.error}` : ""}`);
});

if (checks.some((item) => !item.ok)) {
  process.exitCode = 1;
}

async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, ok: true });
  } catch (error) {
    checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

async function expectText(text) {
  await page.getByText(text).first().waitFor();
}

async function waitForReviewPanel(options = {}) {
  await page.locator(".review-panel").waitFor(options);
}

async function waitForActivePlaceholder(placeholder) {
  await page.waitForFunction(
    (targetPlaceholder) => {
      const active = document.activeElement;
      return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement
        ? active.placeholder === targetPlaceholder
        : false;
    },
    placeholder
  );
}

async function expectColumnCount(index, expected) {
  await page.waitForFunction(
    ({ selector, index, expectedCount }) => {
      const column = document.querySelectorAll(selector)[index];
      return !!column && column.querySelectorAll(".move-card").length === expectedCount;
    },
    { selector: ".board-column", index, expectedCount: expected }
  );
}

async function expectColumnText(index, text, shouldContain) {
  await page.waitForFunction(
    ({ selector, index, text, shouldContain }) => {
      const column = document.querySelectorAll(selector)[index];
      const containsText = !!column && column.textContent?.includes(text);
      return shouldContain ? containsText : !containsText;
    },
    { selector: ".board-column", index, text, shouldContain }
  );
}

async function expectSectionLacksText(heading, text) {
  await page.waitForFunction(
    ({ heading, text }) => {
      const sections = Array.from(document.querySelectorAll("section"));
      const section = sections.find((candidate) => candidate.querySelector("h3")?.textContent?.trim() === heading);
      return !!section && !section.textContent?.includes(text);
    },
    { heading, text }
  );
}

async function assertHidden(selector) {
  const visible = await page.locator(selector).first().isVisible().catch(() => false);
  assert(!visible, `Expected ${selector} to be hidden`);
}

function createImportPayload() {
  return {
    schemaVersion: 1,
    exportedAt: "2026-06-23T00:00:00.000Z",
    app: "friend-crm",
    data: {
      people: [
        {
          id: "p-regression",
          name: "Regression Person",
          relationshipTypes: ["friend"],
          contactMethods: [{ type: "linkedin", value: "https://linkedin.com/in/regression-person" }],
          profilePhotoUrl:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231155ff'/%3E%3Ctext x='40' y='49' text-anchor='middle' font-size='30' fill='white'%3ER%3C/text%3E%3C/svg%3E",
          city: "Test City",
          timezone: "UTC",
          importance: 3,
          warmth: "neutral",
          trust: 3,
          strategicRelevance: 2,
          sensitivity: "normal",
          summary: "Minimal import-preview dataset.",
          createdAt: "2026-06-23T00:00:00.000Z",
          updatedAt: "2026-06-23T00:00:00.000Z"
        }
      ],
      notes: [],
      memories: [],
      openLoops: [],
      nextMoves: [],
      interactions: []
    }
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
