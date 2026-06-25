import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const storageKey = "friend-crm:data:v1";
const checks = [];
const syntheticTrialData = createSyntheticTrialData();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

try {
  await check("loads synthetic 10-person 25-note trial dataset", async () => {
    await loadSyntheticTrialData();
    await expectText("Friend CRM");
    await expectText("The People");
    await expectText("10 people");
    await expectText(/social debt|open loops/);
    await expectText("Browser Trial Alpha");
    await expectText("Debt overdue");
  });

  await check("person rail generates editable brief and next moves without auto-adding", async () => {
    await page.getByRole("button", { name: /Browser Trial Alpha/ }).first().click();
    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await expectText(/cafe intro/i);
    await expectText(/sensitive\/private context|Checked by the local AI desk|private draft desk/);

    const beforeMoveCount = await storedNextMoveCount();
    await page.getByPlaceholder("What are we trying to pull off?").fill("close the overdue cafe intro loop");
    await page.getByRole("button", { name: "Cook Something Up" }).click();
    await page.getByLabel("Edit generated move 1").waitFor();
    await page.getByLabel("Edit generated move 2").waitFor();
    await page.getByLabel("Edit generated move 3").waitFor();
    assert((await storedNextMoveCount()) === beforeMoveCount, "Generated drafts should not auto-add next moves");

    await page.getByLabel("Edit generated move 1").fill("Browser trial edited move: close the cafe intro cleanly.");
    await page
      .getByLabel("Edit generated move 1")
      .locator("xpath=ancestor::article")
      .getByRole("button", { name: "Add" })
      .click();
    assert((await storedNextMoveCount()) === beforeMoveCount + 1, "Adding a generated move should update local data once");
    await expectText("Draft added to the Plot Board. Still editable, still your fault.");
  });

  await check("radar sees cold people, protected files, overdue loops, and openings", async () => {
    await page.getByRole("button", { name: "The Radar" }).click();
    await page.getByRole("heading", { name: "The Radar" }).waitFor();
    await expectText("Going Cold");
    await expectText("Promises You Shouldn't Have Made");
    await expectText("Protected Files");
    await expectText("Openings");
    await expectText("Browser Trial Alpha");
    await expectText("Browser Trial Hotel");
  });

  await check("plot board can reclassify synthetic trial moves", async () => {
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    const ideaCard = page.locator("section[aria-label='Bad Idea? moves'] .move-card").first();
    const movedDraft = await ideaCard.locator("p").innerText();
    await ideaCard.getByLabel(/next move to/).selectOption("queued");
    await page.waitForFunction(
      ({ text }) => document.querySelector("section[aria-label='Loaded moves']")?.textContent?.includes(text),
      { text: movedDraft }
    );
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.waitForFunction(
      ({ text }) => document.querySelector("section[aria-label='Loaded moves']")?.textContent?.includes(text),
      { text: movedDraft }
    );
  });

  await check("settings exports and previews import after synthetic data exists", async () => {
    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await expectText("10/10");
    await expectText("25/25");

    const downloadPromise = page.waitForEvent("download", { timeout: 5000 }).catch(() => null);
    await page.getByRole("button", { name: "Export Backup JSON" }).click();
    const download = await downloadPromise;
    assert(download, "Expected JSON export download from synthetic trial data");
    await expectText("friend-crm-export.json exported.");

    await page.setInputFiles("input[type=file]", {
      name: "friend-crm-browser-synthetic-trial.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(createImportEnvelope(syntheticTrialData)))
    });
    await expectText("Import looks structurally sane");
    await expectText("Check the Saved Export Before Restore");
    await expectText("Browser Trial Alpha");
    await expectText("25");
    await expectText("sensitive/private");
  });

  await check("mobile viewport renders synthetic trial data without horizontal overflow", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "The People" }).click();
    await page.waitForTimeout(100);
    await expectText("Browser Trial Alpha");
    await assertNoHorizontalOverflow();
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await assertNoHorizontalOverflow();
  });
} finally {
  await browser.close();
}

console.log("# Friend CRM Browser Synthetic Trial\n");
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

async function loadSyntheticTrialData() {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(
    ({ key, data }) => window.localStorage.setItem(key, JSON.stringify(data)),
    { key: storageKey, data: syntheticTrialData }
  );
  await page.reload({ waitUntil: "networkidle" });
}

async function storedNextMoveCount() {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "{}").nextMoves?.length ?? 0, storageKey);
}

async function expectText(text) {
  await page.getByText(text).first().waitFor();
}

async function assertNoHorizontalOverflow() {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `Expected no horizontal overflow, found ${overflow}px`);
}

function createImportEnvelope(data) {
  return {
    schemaVersion: 1,
    exportedAt: "2026-06-25T00:00:00.000Z",
    app: "friend-crm",
    data
  };
}

function createSyntheticTrialData() {
  const people = [
    person("p-browser-alpha", "Browser Trial Alpha", ["friend", "collaborator"], "Austin", "warm", "sensitive", 5, 4, "2026-04-12", "2026-06-20", "Sharp operator. Prefers tight asks and actual follow-through."),
    person("p-browser-bravo", "Browser Trial Bravo", ["mentor"], "San Francisco", "neutral", "normal", 5, 5, "2026-05-12", "2026-07-02", "Mentor who likes crisp context before advice."),
    person("p-browser-charlie", "Browser Trial Charlie", ["friend"], "Los Angeles", "hot", "private", 4, 4, "2026-06-05", "2026-07-10", "High warmth, private family context nearby. Keep it gentle."),
    person("p-browser-delta", "Browser Trial Delta", ["community"], "New York", "cool", "normal", 4, 3, "2026-03-18", "2026-06-28", "Great connector, allergic to vague plans."),
    person("p-browser-echo", "Browser Trial Echo", ["collaborator"], "Chicago", "warm", "normal", 3, 4, "2026-06-10", "2026-06-26", "Likes working docs and specific next steps."),
    person("p-browser-foxtrot", "Browser Trial Foxtrot", ["family"], "Toronto", "warm", "private", 5, 5, "2026-04-01", "2026-06-22", "Protected relationship. Care beats cleverness."),
    person("p-browser-golf", "Browser Trial Golf", ["weak_tie", "collaborator"], "Seattle", "neutral", "normal", 3, 2, "2026-05-01", "2026-07-01", "Interesting but brittle. Needs a reason."),
    person("p-browser-hotel", "Browser Trial Hotel", ["client", "collaborator"], "Miami", "cool", "sensitive", 4, 3, "2026-03-20", "2026-06-19", "Scope-sensitive collaborator. Budget talk needs care."),
    person("p-browser-iona", "Browser Trial Iona", ["romantic"], "Portland", "neutral", "private", 4, 3, "2026-06-01", "2026-07-03", "Ambiguous. Avoid over-planning."),
    person("p-browser-juno", "Browser Trial Juno", ["community", "friend"], "London", "hot", "normal", 2, 4, "2026-06-12", "2026-07-09", "Spontaneous and social. Likes playful invites.")
  ];

  const noteSpecs = [
    ["p-browser-alpha", "Alpha prefers a written agenda before calls. Promised to send the cafe intro by Friday.", "call", "sensitive"],
    ["p-browser-bravo", "Bravo likes crisp decision memos. Need to send the options summary next week.", "meeting", "normal"],
    ["p-browser-charlie", "Charlie appreciates low-pressure plans. Do not ask about family conflict unless they open it.", "call", "private"],
    ["p-browser-delta", "Delta hates vague check-ins. Invite them to the Thursday salon with a real time.", "text_summary", "normal"],
    ["p-browser-echo", "Echo wants a working doc before the collaboration call. Share the outline tomorrow.", "meeting", "normal"],
    ["p-browser-foxtrot", "Foxtrot loves garden updates. Keep medical context private.", "memory", "private"],
    ["p-browser-golf", "Golf responds better to specific examples. Circle back with the prototype clip next week.", "manual", "normal"],
    ["p-browser-hotel", "Hotel said budget talk is sensitive. Owed a clean scope by 2026-06-27.", "meeting", "sensitive"],
    ["p-browser-iona", "Iona likes handwritten notes. Boundary: do not over-plan the next conversation.", "dinner", "private"],
    ["p-browser-juno", "Juno loves playful plans. Send two music-night options this week.", "text_summary", "normal"],
    ["p-browser-alpha", "Alpha and Echo both want tight context. Introduce them only with a clear mutual reason.", "meeting", "normal"],
    ["p-browser-bravo", "Bravo warned against generic updates. Send the one-page version by Monday.", "call", "normal"],
    ["p-browser-charlie", "Charlie needs recovery weeks kept spacious. Offer an easy-out coffee plan.", "manual", "sensitive"],
    ["p-browser-delta", "Delta can introduce two organizers if I send a short why-now note.", "call", "normal"],
    ["p-browser-echo", "Echo appreciates fast summaries. Draft the collaboration angle before Friday.", "meeting", "normal"],
    ["p-browser-foxtrot", "Foxtrot prefers care without management energy. Send one photo from the walk.", "memory", "private"],
    ["p-browser-golf", "Golf likes operator examples. Schedule a short call only if the clip lands.", "manual", "normal"],
    ["p-browser-hotel", "Hotel needs explicit timelines. Follow up with the scope note tomorrow.", "call", "normal"],
    ["p-browser-iona", "Iona prefers direct but gentle language. Do not bring up private history casually.", "dinner", "private"],
    ["p-browser-juno", "Juno appreciates spontaneous invites. Book the table if they say yes.", "text_summary", "normal"],
    ["p-browser-alpha", "Alpha asked for the cafe intro again. This is now social debt, not ambiance.", "manual", "normal"],
    ["p-browser-bravo", "Bravo prefers no-surprise asks. Share the context before asking for feedback.", "meeting", "normal"],
    ["p-browser-charlie", "Charlie likes tiny check-ins during stressful weeks. Avoid making it a task list.", "call", "private"],
    ["p-browser-hotel", "Hotel wants the revised scope before any budget conversation.", "meeting", "sensitive"],
    ["p-browser-juno", "Juno said the invite should be playful, not networking cosplay.", "dinner", "normal"]
  ];

  const notes = noteSpecs.map(([personId, rawText, sourceType, sensitivity], index) => ({
    id: `n-browser-${index + 1}`,
    personIds: index === 10 ? ["p-browser-alpha", "p-browser-echo"] : [personId],
    occurredAt: `2026-06-${String((index % 25) + 1).padStart(2, "0")}`,
    sourceType,
    rawText,
    sensitivity,
    createdAt: `2026-06-${String((index % 25) + 1).padStart(2, "0")}T12:00:00.000Z`
  }));

  const memories = [
    memory("m-browser-1", "p-browser-alpha", "n-browser-1", "Prefers a written agenda before calls.", "preference", "sensitive"),
    memory("m-browser-2", "p-browser-bravo", "n-browser-2", "Likes crisp decision memos.", "preference", "normal"),
    memory("m-browser-3", "p-browser-charlie", "n-browser-3", "Do not ask about family conflict unless they open it.", "boundary", "private"),
    memory("m-browser-4", "p-browser-delta", "n-browser-4", "Hates vague check-ins.", "preference", "normal"),
    memory("m-browser-5", "p-browser-echo", "n-browser-5", "Wants a working doc before collaboration calls.", "preference", "normal"),
    memory("m-browser-6", "p-browser-foxtrot", "n-browser-6", "Medical context should stay private.", "boundary", "private"),
    memory("m-browser-7", "p-browser-golf", "n-browser-7", "Responds better to specific examples.", "preference", "normal"),
    memory("m-browser-8", "p-browser-hotel", "n-browser-8", "Budget talk is sensitive.", "boundary", "sensitive"),
    memory("m-browser-9", "p-browser-iona", "n-browser-9", "Do not over-plan the next conversation.", "boundary", "private"),
    memory("m-browser-10", "p-browser-juno", "n-browser-10", "Loves playful plans.", "preference", "normal"),
    memory("m-browser-11", "p-browser-alpha", "n-browser-21", "Cafe intro is now overdue social debt.", "history", "normal"),
    memory("m-browser-12", "p-browser-juno", "n-browser-25", "Invites should not feel like networking cosplay.", "risk", "normal")
  ];

  const openLoops = [
    loop("o-browser-1", "p-browser-alpha", "n-browser-1", "Send the cafe intro", "Alpha asked for a cafe intro with clear context.", "2026-06-20", "sensitive", "open"),
    loop("o-browser-2", "p-browser-bravo", "n-browser-2", "Send options summary", "Bravo asked for crisp options.", "2026-06-28", "normal", "planned"),
    loop("o-browser-3", "p-browser-delta", "n-browser-14", "Send why-now note", "Unlock organizer intros.", "2026-06-21", "normal", "open"),
    loop("o-browser-4", "p-browser-echo", "n-browser-15", "Draft collaboration angle", "Needs the angle before Friday.", "2026-06-22", "normal", "open"),
    loop("o-browser-5", "p-browser-foxtrot", "n-browser-16", "Send walk photo", "Warm, low-pressure contact.", "2026-06-18", "private", "open"),
    loop("o-browser-6", "p-browser-golf", "n-browser-17", "Send prototype clip", "Specific reason to reconnect.", "2026-06-29", "normal", "planned"),
    loop("o-browser-7", "p-browser-hotel", "n-browser-18", "Send scope note", "Clarify timeline before budget.", "2026-06-19", "sensitive", "open"),
    loop("o-browser-8", "p-browser-juno", "n-browser-20", "Book table after yes", "Playful dinner plan.", "2026-07-01", "normal", "planned"),
    loop("o-browser-9", "p-browser-charlie", "n-browser-23", "Tiny check-in", "Keep it spacious.", "2026-06-24", "private", "open"),
    loop("o-browser-10", "p-browser-iona", "n-browser-19", "Quiet invite", "Direct but gentle.", "2026-06-30", "private", "planned")
  ];

  const nextMoves = [
    move("x-browser-1", "p-browser-alpha", "message", "Send Alpha the cafe intro with two sentences of context.", "Specific overdue loop. No need for a novella.", "medium", "idea"),
    move("x-browser-2", "p-browser-bravo", "message", "Send Bravo the one-page options summary.", "Mentor wants crisp context.", "low", "queued"),
    move("x-browser-3", "p-browser-delta", "invite", "Invite Delta to Thursday salon with a real time.", "Concrete plans beat fog.", "low", "idea"),
    move("x-browser-4", "p-browser-foxtrot", "support", "Send Foxtrot the walk photo without turning it into a project.", "Protected file. Keep it small.", "medium", "idea"),
    move("x-browser-5", "p-browser-hotel", "message", "Send Hotel the revised scope before budget talk.", "Sensitive context needs clarity.", "medium", "queued"),
    move("x-browser-6", "p-browser-juno", "invite", "Send Juno two playful music-night options.", "Fits known preference.", "low", "idea")
  ];

  return { people, notes, memories, openLoops, nextMoves, interactions: [] };
}

function person(id, name, relationshipTypes, city, warmth, sensitivity, importance, trust, lastContactAt, nextContactAt, summary) {
  return {
    id,
    name,
    aliases: [],
    relationshipTypes,
    city,
    timezone: "UTC",
    contactMethods: [],
    importance,
    warmth,
    trust,
    strategicRelevance: 3,
    sensitivity,
    lastContactAt,
    nextContactAt,
    summary,
    createdAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z"
  };
}

function memory(id, personId, sourceNoteId, text, category, sensitivity) {
  return { id, personId, sourceNoteId, text, category, confidence: "high", sensitivity, confirmed: true };
}

function loop(id, personId, sourceNoteId, title, description, dueAt, sensitivity, status) {
  return { id, personId, sourceNoteId, title, description, dueAt, sensitivity, status };
}

function move(id, personId, type, draft, rationale, risk, status) {
  return { id, personId, type, draft, rationale, risk, status };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
