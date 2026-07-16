import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const auditDir = process.env.FRIEND_CRM_AUDIT_DIR ?? "docs/07-ops/full-browser-audit-2026-06-25";
const storageKey = "friend-crm:data:v1";
const findings = [];
const screenshots = [];

await mkdir(auditDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  await runDesktopAudit();
  await runMobileAudit();
} finally {
  await browser.close();
}

await writeFile(`${auditDir}/findings.json`, JSON.stringify({ baseUrl, screenshots, findings }, null, 2));

console.log("# Friend CRM Full Browser Audit\n");
console.log(`Screenshots: ${auditDir}`);
console.log(`Findings JSON: ${auditDir}/findings.json\n`);
findings.forEach((finding) => {
  console.log(`- ${finding.severity.toUpperCase()} ${finding.screen}: ${finding.message}`);
});

if (findings.some((finding) => finding.severity === "blocker")) {
  process.exitCode = 1;
}

async function runDesktopAudit() {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  try {
    await resetToSeed(page);
    await capture(page, "desktop-people");

    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await capture(page, "desktop-person-brief");

    await page.getByPlaceholder("What are we trying to pull off?").fill("close the obvious intro loop");
    await page.getByRole("button", { name: "Cook Something Up" }).click();
    await page.getByLabel("Edit generated move 1").waitFor();
    await capture(page, "desktop-generated-moves");

    await page.getByRole("button", { name: "Fake Dossier Art" }).click();
    await page.getByRole("heading", { name: "Poster Lab" }).waitFor();
    await capture(page, "desktop-poster-lab");
    await page.getByRole("button", { name: "Close Poster Lab" }).click();

    await page.getByRole("button", { name: "Erase File" }).click();
    await page.getByText("Erase File Consequences").waitFor();
    await capture(page, "desktop-delete-panel");

    await page.getByRole("button", { name: "The Radar" }).click();
    await page.getByRole("heading", { name: "The Radar" }).waitFor();
    await capture(page, "desktop-radar");

    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await capture(page, "desktop-plot-board-before-drag");
    await dragFirstIdeaToQueued(page);
    await capture(page, "desktop-plot-board-after-drag");

    await page.getByRole("button", { name: "Debrief Booth" }).click();
    await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
    await capture(page, "desktop-reflection-log");
    await createReviewPanel(page);
    await capture(page, "desktop-review-panel");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await capture(page, "desktop-settings");
    await importPreview(page);
    await capture(page, "desktop-import-preview");
  } finally {
    await context.close();
  }
}

async function runMobileAudit() {
  const context = await browser.newContext({
    acceptDownloads: true,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  try {
    await resetToSeed(page);
    await capture(page, "mobile-people-closed-drawer");

    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await waitForMobileDrawer(page, true);
    await capture(page, "mobile-person-drawer");

    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await capture(page, "mobile-person-brief-drawer");

    await page.getByRole("button", { name: "Close file" }).click();
    await waitForMobileDrawer(page, false);
    await capture(page, "mobile-people-after-close");

    await page.getByRole("button", { name: "The Radar" }).click();
    await page.getByRole("heading", { name: "The Radar" }).waitFor();
    await capture(page, "mobile-radar");

    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await capture(page, "mobile-plot-board");

    await page.getByRole("button", { name: "Debrief Booth" }).click();
    await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
    await capture(page, "mobile-reflection-log");
    await createReviewPanel(page);
    await capture(page, "mobile-review-panel");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await capture(page, "mobile-settings");
  } finally {
    await context.close();
  }
}

async function resetToSeed(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((key) => window.localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
}

async function capture(page, name) {
  await page.screenshot({ path: `${auditDir}/${name}.png`, fullPage: true });
  screenshots.push(`${auditDir}/${name}.png`);
  const layoutFindings = await scanLayout(page, name);
  findings.push(...layoutFindings);
}

async function scanLayout(page, screen) {
  return page.evaluate((screenName) => {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const pageOverflow = document.documentElement.scrollWidth - viewportWidth;
    const localFindings = [];

    if (pageOverflow > 1) {
      localFindings.push({
        severity: "high",
        screen: screenName,
        message: `Page has ${pageOverflow}px horizontal overflow.`
      });
    }

    const selectors = [
      "button",
      "input",
      "select",
      "textarea",
      ".nav-item",
      ".person-row",
      ".rail-section",
      ".move-card",
      ".review-panel",
      ".import-preview",
      ".poster-lab",
      ".readiness-metric"
    ];

    const visibleElements = Array.from(document.querySelectorAll(selectors.join(",")))
      .filter((element) => {
        const box = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        if (element instanceof HTMLInputElement && element.type === "file") return false;
        return (
          box.width > 2 &&
          box.height > 2 &&
          styles.visibility !== "hidden" &&
          styles.display !== "none" &&
          Number(styles.opacity) > 0.05
        );
      })
      .slice(0, 500);

    visibleElements.forEach((element) => {
      const box = element.getBoundingClientRect();
      const label = element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 90) || element.tagName.toLowerCase();

      if (box.left < -1 || box.right > viewportWidth + 1) {
        localFindings.push({
          severity: "high",
          screen: screenName,
          message: `Visible element extends outside viewport: "${label}" (${Math.round(box.left)}..${Math.round(box.right)} of ${viewportWidth}).`
        });
      }

      if (
        element.scrollWidth > element.clientWidth + 2 &&
        ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(element.tagName) &&
        !isBrowserNativeInputNoise(element)
      ) {
        localFindings.push({
          severity: "medium",
          screen: screenName,
          message: `Control text/content may be clipped: "${label}".`
        });
      }

      if (element.scrollHeight > element.clientHeight + 4 && element.tagName === "BUTTON") {
        localFindings.push({
          severity: "medium",
          screen: screenName,
          message: `Button content may be vertically clipped: "${label}".`
        });
      }
    });

    const fixedDrawer = document.querySelector(".person-rail.mobile-drawer-open");
    if (fixedDrawer) {
      const box = fixedDrawer.getBoundingClientRect();
      if (box.top < 0 || box.bottom > viewportHeight + 1) {
        localFindings.push({
          severity: "medium",
          screen: screenName,
          message: `Mobile drawer extends outside viewport (${Math.round(box.top)}..${Math.round(box.bottom)} of ${viewportHeight}).`
        });
      }
    }

    return localFindings;

    function isBrowserNativeInputNoise(element) {
      if (!(element instanceof HTMLInputElement)) return false;
      if (["checkbox", "radio", "date", "file", "hidden", "range", "color"].includes(element.type)) return true;
      return !(
        element.value ||
        element.placeholder ||
        element.getAttribute("aria-label") ||
        element.getAttribute("title")
      );
    }
  }, screen);
}

async function dragFirstIdeaToQueued(page) {
  const ideaCard = page.locator("section[aria-label='Bad Idea? moves'] .move-card").first();
  const queuedColumn = page.locator("section[aria-label='Loaded moves']");
  const movedDraft = await ideaCard.locator("p").innerText();
  await ideaCard.locator(".drag-handle").dragTo(queuedColumn, { force: true });
  await page.waitForFunction(
    ({ text }) => document.querySelector("section[aria-label='Loaded moves']")?.textContent?.includes(text),
    { text: movedDraft }
  );
}

async function createReviewPanel(page) {
  await page.getByRole("button", { name: "Nobody" }).click();
  await page.getByLabel("Ada Nkrumah").check();
  await page
    .getByPlaceholder("What happened? What did they reveal? What did you foolishly promise?")
    .fill("Ada prefers phone calls after lunch. Promised to send the audit note next week.");
  await page.getByRole("button", { name: "Capture & Interrogate" }).click();
  await page.locator(".review-panel").waitFor();
}

async function importPreview(page) {
  await page.setInputFiles("input[type=file]", {
    name: "friend-crm-audit-import.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(createImportPayload()))
  });
  await page.getByRole("heading", { name: "Check the Saved Export Before Restore" }).waitFor();
}

async function waitForMobileDrawer(page, open) {
  await page.waitForFunction((shouldBeOpen) => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return false;
    const styles = window.getComputedStyle(rail);
    const visible = styles.pointerEvents !== "none" && Number(styles.opacity) > 0.9;
    return shouldBeOpen ? visible : !visible;
  }, open);
}

function createImportPayload() {
  return {
    schemaVersion: 1,
    exportedAt: "2026-06-25T00:00:00.000Z",
    app: "friend-crm",
    data: {
      people: [
        {
          id: "p-audit-import",
          name: "Audit Import Person",
          aliases: [],
          relationshipTypes: ["friend"],
          contactMethods: [],
          city: "QA City",
          timezone: "UTC",
          importance: 3,
          warmth: "neutral",
          trust: 3,
          strategicRelevance: 2,
          sensitivity: "normal",
          summary: "Import-preview audit payload.",
          createdAt: "2026-06-25T00:00:00.000Z",
          updatedAt: "2026-06-25T00:00:00.000Z"
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
