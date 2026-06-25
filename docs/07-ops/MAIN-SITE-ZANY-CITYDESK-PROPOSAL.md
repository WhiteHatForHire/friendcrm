# MAIN-SITE-ZANY-CITYDESK-PROPOSAL.md — Main App Zany Style Expansion

Date: 2026-06-23

Purpose: propose how to bring more CityDesk 3000 / GTA-style fake-web chaos into the main Friend CRM app without damaging the trust-critical relationship memory workflow.

This is a design/product proposal only. It does not implement app changes.

---

# Recommendation

Apply the CityDesk 3000 style guide to the **app frame and playful helper surfaces**, not wholesale to every workflow.

Use this principle:

**Make the frame scream. Make the workflow work.**

Friend CRM should feel more like a weird in-world private desk from a fake web universe, but the user must still trust the app with relationship notes, privacy labels, deletion, export, and review decisions.

Best first implementation:

1. Add a fake top chrome strip across the app.
2. Add compact rotating parody widgets to the side surfaces.
3. Add CityDesk-style classified/coupon/stamp treatments to empty states and non-destructive helper panels.
4. Leave Review, note capture, export/import, delete, and privacy controls mostly sober.

---

# Style Source

Local style kit:

- `/Users/marcusvale/Documents/coding/DreamPostcards/docs/02-design/brand-style-kits/citydesk-3000-style-kit/`

Existing Friend CRM canon reference:

- `docs/07-ops/GTA-WEB-SATIRE-REFERENCE.md`

Existing implemented proof:

- BuddyScan 3000 Poster Lab
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab.png`

The Poster Lab proves the style works when isolated to a playful artifact. The next question is how much of that energy can live in the main app shell.

---

# Current App Fit

Friend CRM already has:

- Glossy dark sidebar.
- Loud sticker headings.
- Halftone/grid texture.
- Heavy shadows.
- Cheeky navigation and panel copy.
- BuddyScan 3000 as an in-world fake service.

What still feels quieter than the style guide:

- The main workspace lacks a top fake-web chrome/status strip.
- Empty states are funny but not yet visually zany.
- The right rail has useful sections, but not enough fake institutional flavor.
- Settings could feel more like an "Evidence Locker" with civic-warning panels.
- Radar and Plot Board could use more fake meters/stamps without harming function.

---

# Design Thesis

The whole product should not become one giant poster.

Instead:

- The **work layer** stays readable: tables, forms, review controls, import/export, delete actions.
- The **parody layer** gets louder: fake status strips, stamps, classified boxes, coupon panels, tabloid widgets.
- The **texture layer** gets slightly richer: newsprint, fax paper, warning tape, cheap chrome, but never behind dense text.

This preserves Friend CRM's product promise:

> A private relationship intelligence desk, not a sales CRM and not a surveillance toy.

---

# Proposed Zany Additions

## 1. Fake Top Chrome Strip

Add a narrow app-wide strip above or inside the main shell.

Purpose:

- Make the whole app feel like an in-world fake operating portal.
- Add personality without changing workflows.

Possible modules:

- `USER: LOCAL_OPERATOR`
- `MODE: PRIVATE FRIEND INTEL`
- `SYNC: LOCAL ONLY`
- `BUREAU STATUS: OPERATIONAL... SORTA`
- `NO SCRAPING DETECTED`
- `TODAY'S ALIBI: ACT NORMAL`

Rules:

- Must not look like real sync/cloud status.
- Must not imply remote persistence.
- Must stay short on mobile.
- Hide lower-priority labels below narrow widths.

Acceptance criteria for implementation:

- Top chrome appears on desktop and mobile without causing horizontal overflow.
- Clearly states local/private posture.
- Does not replace existing nav.
- Browser regression still passes mobile overflow check.

## 2. Right-Rail "Daily Alibi" Widget

Add a small rotating parody widget near the Person Rail or main side surface.

Purpose:

- Bring CityDesk tabloid/coupon energy into the regular app.
- Make repeated use feel alive.

Possible titles:

- `Daily Alibi`
- `Office of Friendship Irregularities`
- `Normal Human Bulletin`
- `Department Memo`

Possible copy:

- `Do one thoughtful thing before opening another tab.`
- `No scraping today. The bureau is trying personal growth.`
- `Remembering birthdays is not a personality, but it helps.`
- `Act normal. Then write it down.`

Rules:

- No user-specific generated claims.
- No hidden scoring.
- No advice that pressures outreach.
- Should be dismissible or low prominence if it gets annoying.

Acceptance criteria:

- Shows harmless rotating copy.
- Does not use private data.
- Does not block Person Rail actions.
- Respects reduced motion if animated.

## 3. Social Debt Receipt Mini-Panel

Add a small non-destructive visual summary for selected person or People view.

Purpose:

- Translate open loops/next nudge into playful but useful scan info.

Possible fields:

- `Unfinished business`
- `Nudge due`
- `Receipt count`
- `Last seen`

Visual treatment:

- Coupon/receipt paper.
- Dashed border.
- Fake cashier/checklist typography.
- Stamp: `PAY WITH ATTENTION`

Rules:

- Use counts/dates only.
- Do not shame the user.
- Do not invent relationship quality.
- Do not replace actual open loop list.

Acceptance criteria:

- Clearly derived from existing visible data.
- Does not add new data model.
- Does not use contact values or notes.

## 4. Classified Empty States

Convert some empty states into classified-box style modules.

Good targets:

- Empty Plot Board column.
- No memories.
- No open loops.
- No captured notes.
- No search results.

Examples:

- `WANTED: One Specific Plan`
- `MISSING: Last Week's Follow-Up`
- `FOUND: Suspiciously Clean Open Loops`
- `CLASSIFIED: No Memories Filed`
- `PUBLIC NOTICE: Nobody Has Ghosted You Yet`

Rules:

- Keep empty-state action obvious.
- Avoid making the joke the only instruction.
- Do not use this style for errors/destructive warnings.

Acceptance criteria:

- At least 3 empty states get classified-box visual treatment.
- Existing browser regression still passes.
- Mobile remains readable.

## 5. Stamps And Warning Tape For Existing States

Use stamps more consistently, but only for status/metadata.

Targets:

- Needs attention.
- Privacy labels.
- Overdue next contact.
- Open loop statuses.
- BuddyScan/poster-related artifacts.

Examples:

- `HANDLE GENTLY`
- `LOCAL ONLY`
- `NORMAL ALIBI`
- `PRIVATE FILE`
- `DO NOT OVERPLAY`
- `UNFINISHED BUSINESS`

Rules:

- Do not overuse red.
- Keep accessibility: text plus color.
- Do not rotate real controls.

Acceptance criteria:

- Adds visual personality to non-destructive status chips.
- No button text readability regressions.
- No overlap at mobile widths.

## 6. Settings As Evidence Locker

Settings already uses "Evidence Locker" language. Push this more.

Potential modules:

- `Panic Copy Desk` for export.
- `Incoming Evidence Inspection` for import preview.
- `Reality Replacement Permit` for import/replace.
- `Local Data Disposal` for reset/delete.
- `Sample File Restoration` if the sample dataset reset task lands.

Rules:

- Destructive actions keep plain language beside the joke.
- Export/import privacy copy stays explicit.
- No fake language that obscures real data consequences.

Acceptance criteria:

- Settings feels more in-world.
- Export/import/reset distinction remains clearer, not blurrier.

---

# Do Not Zany These Yet

Keep these relatively sober:

- Review Panel save/reject controls.
- AI extraction warnings.
- Sensitive/private labels near content.
- Delete confirmation details.
- Import replacement preview.
- Export privacy warning.
- Real provider/API-key configuration.

These are trust-critical. They can have light styling, but the copy must stay plain enough to understand on first read.

---

# Copy Translation Rules

The CityDesk kit uses sales terms. Friend CRM must translate them.

| CityDesk / Sales Flavor | Friend CRM Translation |
| --- | --- |
| Lead | Person / suspect / person of interest |
| Deal | Plan / soft scheme / social maneuver |
| Pipeline | Plot Board |
| Close | Follow through / handle / make good |
| Lead heat | Nudge temperature / attention signal |
| Trust meter | Do not fumble / trust dots |
| Coupon | Social debt receipt / alibi ticket |
| Fake ad | Bureau memo / public notice / normal human bulletin |
| Account dossier | Person file |

Avoid:

- `lead`
- `pipeline`
- `deal`
- `conversion`
- `campaign`
- automated outreach language

---

# Proposed Implementation Runs

## Run 1 — Shell Chrome And Classified Empty States

Scope:

- Add fake top chrome strip.
- Convert selected empty states to classified boxes.
- Add CSS tokens/classes for reusable CityDesk-lite modules.
- No behavior changes.

Files likely touched:

- `src/App.tsx`
- `src/components/PlotBoard.tsx`
- `src/components/PersonRail.tsx`
- `src/components/ReflectionLog.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`

Validation:

- `npm test`
- `npm run build`
- `FRIEND_CRM_BASE_URL=http://127.0.0.1:5175 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:browser`
- `npm run demo:check`

## Run 2 — Daily Alibi And Social Debt Receipt

Scope:

- Add small harmless Daily Alibi widget.
- Add selected-person Social Debt Receipt derived from counts/dates.
- Keep both non-persistent and local.

Files likely touched:

- `src/components/PersonRail.tsx`
- possibly `src/components/DailyAlibi.tsx`
- possibly `src/components/SocialDebtReceipt.tsx`
- `src/styles.css`
- component/browser tests

Validation:

- Existing validation plus component tests for derived values.

## Run 3 — Evidence Locker Styling Pass

Scope:

- Push Settings into more in-world "Evidence Locker" presentation.
- Keep destructive/import/export copy explicit.
- Prepare visual space for future sample dataset reset.

Files likely touched:

- `src/components/SettingsView.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`

Validation:

- Existing validation plus settings import/export browser checks.

---

# Success Criteria

This style expansion succeeds if:

- The app feels more alive and in-world.
- The central workflows remain faster to scan, not slower.
- Privacy/data actions are clearer, not buried under jokes.
- Mobile stays usable.
- Browser regression and demo readiness remain green.
- The user smiles, then still knows exactly what the button does.

This expansion fails if:

- Every panel competes equally for attention.
- The app starts feeling like a sales CRM.
- Joke copy obscures destructive actions.
- Private data handling feels less trustworthy.
- Mobile becomes a tiny poster scroll of doom.

---

# Recommendation

Proceed with **Run 1 — Shell Chrome And Classified Empty States** first.

It is the safest way to make the main app feel more zany immediately:

- High visible impact.
- Low data risk.
- No new model.
- No provider surface.
- Easy to validate visually.

Then evaluate whether the app needs Daily Alibi / Social Debt Receipt widgets or whether the shell/empty-state pass creates enough personality.
