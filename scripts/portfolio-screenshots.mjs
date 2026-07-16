import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.FRIEND_CRM_BASE_URL ?? "http://127.0.0.1:5174";
const outputDir = process.env.FRIEND_CRM_PORTFOLIO_DIR ?? "docs/07-ops/portfolio-screenshots-2026-06-29";
const storageKey = "friend-crm:data:v1";
const shots = [];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  await captureDesktop();
  await captureMobile();
  await captureTablet();
} finally {
  await browser.close();
}

await writeFile(`${outputDir}/SHOT-LIST.md`, buildShotList());

console.log("# Friend CRM Portfolio Screenshots\n");
console.log(`Output: ${outputDir}\n`);
shots.forEach((shot) => console.log(`- ${shot.file}: ${shot.caption}`));

async function captureDesktop() {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  try {
    await resetToSeed(page);
    await screenshot(page, "01-desktop-people-desk", "Hero candidate: the retro private relationship desk with selected dossier rail.");

    await page.getByRole("button", { name: "Brief Me" }).click();
    await page.getByRole("heading", { name: "Pre-Meeting Intel" }).waitFor();
    await screenshot(page, "02-desktop-person-brief", "AI-aware brief flow framed as a draft, not official truth.");

    await page.getByRole("button", { name: "Debrief Booth" }).click();
    await page.getByRole("heading", { name: "Debrief Booth" }).waitFor();
    await createReviewPanel(page);
    await screenshot(page, "03-desktop-review-panel", "Source-backed review panel where suggestions require user confirmation.");
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await screenshot(page, "04-desktop-plot-board", "Playful next-move planning board with retro classified-desk personality.");

    await page.getByRole("button", { name: "The People" }).click();
    await page.getByRole("button", { name: "Fake Dossier Art" }).click();
    await page.getByRole("heading", { name: "Poster Lab" }).waitFor();
    await screenshot(page, "05-desktop-poster-lab", "Poster Lab shows the tongue-in-cheek retro parody without becoming durable memory.");
    await page.getByRole("button", { name: "Close Poster Lab" }).click();

    await page.getByRole("button", { name: "Evidence Locker" }).click();
    await page.getByRole("heading", { name: "Evidence Locker" }).waitFor();
    await screenshot(page, "06-desktop-evidence-locker", "Export, restore, and reset controls make the privacy story visible.");
  } finally {
    await context.close();
  }
}

async function captureMobile() {
  const context = await browser.newContext({
    acceptDownloads: true,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  try {
    await resetToSeed(page);
    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await waitForMobileDrawer(page, true);
    await screenshot(page, "07-mobile-people-drawer", "Mobile dossier drawer keeps the private desk usable on a phone.");

    await page.getByRole("button", { name: "Close file" }).click();
    await waitForMobileDrawer(page, false);
    await page.getByRole("button", { name: "Plot Board" }).click();
    await page.getByRole("heading", { name: "Plot Board" }).waitFor();
    await screenshot(page, "08-mobile-plot-board", "Mobile Plot Board uses compact planning controls instead of relying on drag gestures.");
  } finally {
    await context.close();
  }
}

async function captureTablet() {
  const context = await browser.newContext({
    acceptDownloads: true,
    hasTouch: true,
    viewport: { width: 768, height: 1024 }
  });
  const page = await context.newPage();

  try {
    await resetToSeed(page);
    await page.getByRole("button", { name: /Ada Nkrumah/ }).first().click();
    await waitForMobileDrawer(page, true);
    await page.getByRole("button", { name: "Close file" }).click();
    await waitForMobileDrawer(page, false);
    await page.locator("summary", { hasText: "Identity And Privacy" }).waitFor();
    await screenshot(page, "09-tablet-people-editor", "Tablet profile editing groups identity, timing, photo, labels, socials, and summary into scannable sections.");
  } finally {
    await context.close();
  }
}

async function resetToSeed(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((key) => window.localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
}

async function screenshot(page, name, caption) {
  const file = `${name}.png`;
  await page.screenshot({ path: `${outputDir}/${file}`, fullPage: false });
  shots.push({ file, caption });
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

async function waitForMobileDrawer(page, open) {
  await page.waitForFunction((shouldBeOpen) => {
    const rail = document.querySelector(".person-rail");
    if (!rail) return false;
    const styles = window.getComputedStyle(rail);
    const visible = styles.pointerEvents !== "none" && Number(styles.opacity) > 0.9;
    return shouldBeOpen ? visible : !visible;
  }, open);
}

function buildShotList() {
  const lines = [
    "# Portfolio Screenshot Gallery - 2026-06-29",
    "",
    "These screenshots are curated for the Symposium Studios Friend CRM portfolio/product page.",
    "",
    "Positioning:",
    "",
    "> Friend CRM is a tongue-in-cheek retro relationship desk with modern AI-aware workflows, local-first data, and privacy-first boundaries.",
    "",
    "## Shots",
    ""
  ];

  shots.forEach((shot, index) => {
    lines.push(`## ${index + 1}. ${shot.file}`);
    lines.push("");
    lines.push(`![${shot.caption}](./${shot.file})`);
    lines.push("");
    lines.push(`Caption: ${shot.caption}`);
    lines.push("");
  });

  lines.push("## Suggested Portfolio Use");
  lines.push("");
  lines.push("- Hero: `01-desktop-people-desk.png`.");
  lines.push("- Product walkthrough: screenshots 2-6.");
  lines.push("- Responsive proof: screenshots 7-9.");
  lines.push("- Optional social crop: `05-desktop-poster-lab.png` for the loud retro identity.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}
