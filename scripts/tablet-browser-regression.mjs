import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const screenshotDir = process.env.FRIEND_CRM_TABLET_SCREENSHOT_DIR ?? "docs/07-ops/tablet-breakpoint-regression-2026-06-25";
const storageKey = "friend-crm:data:v1";
const viewports = [
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "tablet-834x1112", width: 834, height: 1112 }
];
const checks = [];
const findings = [];
const screenshots = [];

await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    await runViewport(viewport);
  }
} finally {
  await browser.close();
}

await writeFile(
  `${screenshotDir}/findings.json`,
  JSON.stringify({ baseUrl, viewports, screenshots, findings, checks }, null, 2)
);

console.log("# Friend CRM Tablet Browser Regression\n");
console.log(`Artifacts: ${screenshotDir}`);
console.log(`Findings JSON: ${screenshotDir}/findings.json\n`);
checks.forEach((item) => {
  console.log(`- ${item.ok ? "PASS" : "FAIL"} ${item.name}${item.error ? `: ${item.error}` : ""}`);
});

if (findings.length > 0) {
  console.log("\nFindings:");
  findings.forEach((finding) => {
    console.log(`- ${finding.severity.toUpperCase()} ${finding.screen}: ${finding.message}`);
  });
}

if (checks.some((item) => !item.ok) || findings.some((finding) => finding.severity === "high")) {
  process.exitCode = 1;
}

async function runViewport(viewport) {
  const context = await browser.newContext({
    acceptDownloads: true,
    hasTouch: true,
    isMobile: true,
    viewport: { width: viewport.width, height: viewport.height }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  page.setDefaultNavigationTimeout(10000);
  const runtimeErrors = [];
  page.on("pageerror", (error) => {
    runtimeErrors.push(error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });

  try {
    const peopleReady = await check(`${viewport.name} People, drawer, and compact editor`, async () => {
      await resetToSeed(page);
      await assertNoRuntimeErrors(page, runtimeErrors, `${viewport.name}-people`);
      await expectText(page, "The People");
      await page.getByPlaceholder("Add a suspect").waitFor();
      await assertCompactNavReachable(page);
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-people`);

      await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
      await assertDrawerOpen(page);
      await assertBackdropVisible(page);
      await assertBodyScrollLocked(page, true);
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-person-drawer`);
      await page.getByRole("button", { name: "Close file" }).click();
      await assertDrawerClosed(page);
      await assertBodyScrollLocked(page, false);

      await page.locator("details.editor-section summary", { hasText: "Timing Alibis" }).click();
      await page.getByLabel("Last contact").waitFor();
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-people-editor`);
    });
    if (!peopleReady) return;

    const plotReady = await check(`${viewport.name} Plot Board remains reachable`, async () => {
      await assertNoRuntimeErrors(page, runtimeErrors, `${viewport.name}-plot-board`);
      await page.getByRole("button", { name: "Plot Board" }).click();
      await page.getByRole("heading", { name: "Plot Board" }).waitFor();
      await expectText(page, "Bad Idea?");
      await page.locator("section[aria-label='Loaded moves']").waitFor();
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-plot-board`);
    });
    if (!plotReady) return;

    const reviewReady = await check(`${viewport.name} Review Panel fits`, async () => {
      await assertNoRuntimeErrors(page, runtimeErrors, `${viewport.name}-review-panel`);
      await page.getByRole("button", { name: "Debrief Booth" }).click();
      await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
      await page.getByRole("button", { name: "Nobody" }).click();
      await page.getByLabel("Ada Nkrumah").check();
      await page
        .getByPlaceholder("What happened? What did they reveal? What did you foolishly promise?")
        .fill("Ada prefers a short tablet demo note. Promised to send the harmless follow-up.");
      await page.getByRole("button", { name: "Capture & Interrogate" }).click();
      await page.locator(".review-panel").waitFor();
      await assertFitsViewport(page, ".review-panel", viewport.width);
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-review-panel`);
      await page.keyboard.press("Escape");
      await page.locator(".review-panel").waitFor({ state: "detached" });
    });
    if (!reviewReady) return;

    await check(`${viewport.name} Settings safety controls fit`, async () => {
      await assertNoRuntimeErrors(page, runtimeErrors, `${viewport.name}-settings`);
      await page.getByRole("button", { name: "Evidence Locker" }).click();
      await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
      await expectText(page, "Export Backup JSON");
      await expectText(page, "Restore Saved Export");
      await expectText(page, "Restore Built-In Fake Friends");
      await assertHidden(page, ".view-settings .person-rail");
      await assertNoHorizontalOverflow(page, viewport.width);
      await capture(page, `${viewport.name}-settings`);
    });
  } finally {
    await context.close();
  }
}

async function check(name, fn) {
  try {
    await fn();
    checks.push({ name, ok: true });
    return true;
  } catch (error) {
    checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
    return false;
  }
}

async function resetToSeed(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((key) => window.localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
}

async function expectText(page, text) {
  await page.getByText(text).first().waitFor();
}

async function capture(page, name) {
  const path = `${screenshotDir}/${name}.png`;
  await page.screenshot({ path, fullPage: true });
  screenshots.push(path);
}

async function assertCompactNavReachable(page) {
  for (const label of ["The People", "The Radar", "Plot Board", "Debrief Booth", "Evidence Locker"]) {
    const navItem = page.getByRole("button", { name: label });
    await navItem.waitFor();
    const box = await navItem.boundingBox();
    assert(box && box.width > 30 && box.height > 30, `Expected ${label} nav item to be reachable`);
  }
}

async function assertNoHorizontalOverflow(page, viewportWidth) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `Expected no horizontal overflow at ${viewportWidth}px, found ${overflow}px`);
}

async function assertFitsViewport(page, selector, viewportWidth) {
  const box = await page.locator(selector).first().boundingBox();
  assert(box, `Expected ${selector} to exist`);
  assert(box.x >= -1, `${selector} starts outside viewport at x=${box.x}`);
  assert(box.x + box.width <= viewportWidth + 1, `${selector} extends beyond viewport: ${box.x + box.width}px`);
}

async function assertDrawerOpen(page) {
  await page.waitForFunction(() => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return false;
    const styles = window.getComputedStyle(rail);
    return styles.pointerEvents !== "none" && Number(styles.opacity) > 0.9;
  });
}

async function assertDrawerClosed(page) {
  await page.waitForFunction(() => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return true;
    const styles = window.getComputedStyle(rail);
    return styles.pointerEvents === "none" && Number(styles.opacity) < 0.1;
  });
}

async function assertBackdropVisible(page) {
  const visible = await page.locator(".person-rail-backdrop").isVisible();
  assert(visible, "Expected tablet drawer backdrop to be visible");
}

async function assertBodyScrollLocked(page, expected) {
  const locked = await page.evaluate(() => document.body.classList.contains("drawer-scroll-locked"));
  assert(locked === expected, `Expected body scroll lock to be ${expected}, got ${locked}`);
}

async function assertHidden(page, selector) {
  const visible = await page.locator(selector).first().isVisible().catch(() => false);
  assert(!visible, `Expected ${selector} to be hidden`);
}

async function assertNoRuntimeErrors(page, runtimeErrors, screen) {
  if (runtimeErrors.length === 0) return;
  await capture(page, `${screen}-runtime-error`);
  const uniqueErrors = Array.from(new Set(runtimeErrors));
  uniqueErrors.forEach((message) => {
    findings.push({
      severity: "high",
      screen,
      message: `Browser runtime error: ${message}`
    });
  });
  throw new Error(`Browser runtime error: ${uniqueErrors[0]}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
