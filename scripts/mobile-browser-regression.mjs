import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const screenshotDir = process.env.FRIEND_CRM_MOBILE_SCREENSHOT_DIR ?? "docs/07-ops/mobile-usability-audit-2026-06-24";
const checks = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  acceptDownloads: true,
  hasTouch: true,
  isMobile: true,
  viewport: { width: 390, height: 844 }
});
const page = await context.newPage();

try {
  await check("mobile shell loads compactly without overflow", async () => {
    await resetToSeed();
    await expectText("Friend CRM");
    await expectText("The People");
    await assertNoHorizontalOverflow();
    await assertFitsViewport(".app-shell");
    await assertFitsViewport(".sidebar");
    await assertFitsViewport(".workspace");
    await assertDrawerClosed();
    await screenshot("mobile-people");
  });

  await check("mobile people cards expose labels and modal drawer controls", async () => {
    await page.locator(".person-card-field .mobile-field-label", { hasText: "Vibe" }).first().waitFor();
    await page.locator(".person-card-field .mobile-field-label", { hasText: "Last Seen" }).first().waitFor();
    await page.locator(".person-card-field .mobile-field-label", { hasText: "Why Now" }).first().waitFor();
    await page.getByPlaceholder("Add a suspect").fill("Mobile Test");
    await page.getByTitle("Add suspect").click();
    await expectText("Mobile Test");
    await assertDrawerOpen();
    await assertBackdropVisible();
    await assertBodyScrollLocked(true);

    await page.keyboard.press("Escape");
    await assertDrawerClosed();
    await assertBodyScrollLocked(false);

    await page.getByRole("button", { name: /Mobile Test/ }).first().click();
    await assertDrawerOpen();
    await page.getByRole("button", { name: "Close file" }).click();
    await assertDrawerClosed();

    await page.getByRole("button", { name: /Mobile Test/ }).first().click();
    await assertDrawerOpen();
    await page.mouse.click(20, 60);
    await assertDrawerClosed();
    await assertBodyScrollLocked(false);

    await page.getByPlaceholder("Search the social files").fill("Mobile");
    await expectText("Mobile Test");
    await assertNoHorizontalOverflow();
    await screenshot("mobile-people-added");
  });

  await check("mobile reflection composer comes before picker and review sheet works", async () => {
    await page.getByRole("button", { name: "Debrief Booth" }).click();
    await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
    await assertBoxOrder(".composer", ".person-picker");
    await page.getByRole("button", { name: "Nobody" }).click();
    await page.getByLabel("Ada Nkrumah").check();
    await page
      .getByPlaceholder("What happened? What did they reveal? What did you foolishly promise?")
      .fill("Ada prefers phone calls after lunch.");
    await page.getByRole("button", { name: "Capture & Interrogate" }).click();
    await page.locator(".review-panel").waitFor();
    await expectText("Before This Becomes Lore");
    await expectText("Nothing below becomes memory until you approve it");
    await assertFitsViewport(".review-panel");
    await page.getByLabel("Memory text").fill("Mobile edited proof: Ada prefers phone calls after lunch.");
    await screenshot("mobile-review-panel");
    await page.getByRole("button", { name: "Make It Canon" }).click();
    await page.locator(".review-panel").waitFor({ state: "detached" });
    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await assertDrawerOpen();
    await expectText("Mobile edited proof: Ada prefers phone calls after lunch.");
    await screenshot("mobile-person-rail");
  });

  await check("mobile plot board uses status select instead of drag dependency", async () => {
    await resetToSeed();
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    const firstIdeaCard = page.locator("section[aria-label='Bad Idea? moves'] .move-card").first();
    const movedDraft = await firstIdeaCard.locator("p").innerText();
    await firstIdeaCard.getByLabel(/next move to/).selectOption("queued");
    await page.waitForFunction(
      ({ text }) => document.querySelector("section[aria-label='Loaded moves']")?.textContent?.includes(text),
      { text: movedDraft }
    );
    await assertNoHorizontalOverflow();
    await screenshot("mobile-plot-board");
  });

  await check("mobile settings keeps data safety actions reachable and hides dossier rail", async () => {
    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await expectText("Exports include private relationship data");
    await expectText("Export Backup JSON");
    await expectText("Restore Built-In Fake Friends");
    await assertElementAboveFold(page.getByRole("button", { name: "Export Backup JSON" }), 760);
    await assertHidden(".view-settings .person-rail");
    await assertNoHorizontalOverflow();
    await screenshot("mobile-settings");
  });
} finally {
  await browser.close();
}

console.log("# Friend CRM Mobile Browser Regression\n");
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

async function resetToSeed() {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.removeItem("friend-crm:data:v1"));
  await page.reload({ waitUntil: "networkidle" });
}

async function expectText(text) {
  await page.getByText(text).first().waitFor();
}

async function assertNoHorizontalOverflow() {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, `Expected no horizontal overflow, found ${overflow}px`);
}

async function assertFitsViewport(selector) {
  const box = await page.locator(selector).first().boundingBox();
  assert(box, `Expected ${selector} to exist`);
  assert(box.x >= -1, `${selector} starts outside viewport at x=${box.x}`);
  assert(box.x + box.width <= 391, `${selector} extends beyond mobile viewport: ${box.x + box.width}px`);
}

async function assertBoxOrder(firstSelector, secondSelector) {
  const first = await page.locator(firstSelector).first().boundingBox();
  const second = await page.locator(secondSelector).first().boundingBox();
  assert(first && second, `Expected ${firstSelector} and ${secondSelector} to exist`);
  assert(first.y < second.y, `Expected ${firstSelector} before ${secondSelector}, got ${first.y} >= ${second.y}`);
}

async function assertElementAboveFold(locator, maxY) {
  const box = await locator.boundingBox();
  assert(box, "Expected element to have a bounding box");
  assert(box.y < maxY, `Expected element above ${maxY}px, got y=${box.y}`);
}

async function assertHidden(selector) {
  const visible = await page.locator(selector).first().isVisible().catch(() => false);
  assert(!visible, `Expected ${selector} to be hidden`);
}

async function assertDrawerOpen() {
  await page.waitForFunction(() => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return false;
    const styles = window.getComputedStyle(rail);
    return styles.pointerEvents !== "none" && Number(styles.opacity) > 0.9;
  });
}

async function assertDrawerClosed() {
  await page.waitForFunction(() => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return true;
    const styles = window.getComputedStyle(rail);
    return styles.pointerEvents === "none" && Number(styles.opacity) < 0.1;
  });
}

async function assertBackdropVisible() {
  const visible = await page.locator(".person-rail-backdrop").isVisible();
  assert(visible, "Expected mobile drawer backdrop to be visible");
}

async function assertBodyScrollLocked(expected) {
  const locked = await page.evaluate(() => document.body.classList.contains("drawer-scroll-locked"));
  assert(locked === expected, `Expected body scroll lock to be ${expected}, got ${locked}`);
}

async function screenshot(name) {
  await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
