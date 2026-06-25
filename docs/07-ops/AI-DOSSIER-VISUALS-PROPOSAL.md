# AI-DOSSIER-VISUALS-PROPOSAL.md — Funny Dossier Visuals Exploration

Date: 2026-06-23

Purpose: propose a safe, funny, GTA-IV-web-adjacent visual layer for Friend CRM without turning jokes into relationship facts or sending private context silently.

---

# Implementation Status

Phase A was implemented on 2026-06-23 as the local-only **BuddyScan 3000 Poster Lab**.

Implemented behavior:

- Person Rail action: `Fake Dossier Art`.
- Modal title: `Poster Lab`.
- Local CSS/HTML poster generation.
- Shuffleable joke variants.
- Copyable poster text.
- Visible context receipt.
- Visible safety labels: fake, comedy only, not memory, not analysis, not evidence.
- No provider call.
- No saved artifact.
- No notes, contact values, social scraping, private summaries, or sensitive summaries used.

Evidence screenshots:

- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab.png`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/desktop-poster-lab-shuffled.png`
- `docs/07-ops/buddyscan-poster-lab-2026-06-23/mobile-poster-lab.png`

Phase B provider-backed image generation remains parked.

---

# Recommendation

Build this in two phases:

1. **Phase A: Local Dossier Poster Lab**
   - No real image provider.
   - No network call.
   - No durable storage by default.
   - Generate a playful, CSS/HTML dossier poster from already-visible non-sensitive person fields.
   - Keep the artifact clearly labeled as fake, decorative, and user-triggered.

2. **Phase B: Optional AI Image Provider**
   - Only after Phase A proves fun and useful.
   - Must use an explicit context picker.
   - Must exclude sensitive/private content by default.
   - Must use a server-side provider route.
   - Must fall back to the local poster generator if the provider fails.

This avoids the worst version of the feature: uploading private relationship notes to an image model in exchange for a funny sticker that accidentally feels like product truth.

---

# Current App Context

Reviewed current app state with fresh screenshots:

- `docs/07-ops/ai-dossier-visuals-proposal-2026-06-23/current-people-desktop.png`
- `docs/07-ops/ai-dossier-visuals-proposal-2026-06-23/current-plot-board-desktop.png`
- `docs/07-ops/ai-dossier-visuals-proposal-2026-06-23/current-people-mobile.png`

Detailed inspiration notes live in:

- `docs/07-ops/GTA-WEB-SATIRE-REFERENCE.md`

Applied style source:

- `/Users/marcusvale/Documents/coding/DreamPostcards/docs/02-design/brand-style-kits/citydesk-3000-style-kit/`

The app already has a strong retro private-intel look:

- Dark glossy sidebar.
- Sticker-like headings.
- Halftone/grid paper texture.
- Chunky cards and loud shadows.
- Cheeky labels such as "Ways To Appear Normal" and "Unfinished Business".
- Person Rail with current context, memories, open loops, next moves, and note capture.

The best place for dossier visuals is **not** the factual memory list. It belongs near the Person Rail as a deliberately playful companion surface.

Recommended placement:

- Add a small action near `Brief Me`: **Make Fake Dossier Art**.
- Open a modal or drawer named **Poster Lab**.
- Generate a poster preview in the modal.
- Let the user regenerate the joke treatment locally.
- Do not add the generated poster to memories, open loops, notes, or profile facts.

---

# GTA IV Web Research Notes

The relevant pattern from GTA IV is not merely "old web graphics." It is **fake functional internet with satirical specificity**.

Useful references:

- GTA Wiki lists GTA IV's in-game websites as fictional sites, many parodying real-world sites, with categories including interactive sites, news, social networking, shopping, professional sites, community/subculture sites, and scams: [Websites in GTA IV](https://gta.fandom.com/wiki/Websites_in_GTA_IV).
- GTA Wiki describes GTA IV as having its own in-game internet with dozens of websites that either service the player or parody real-life trends/products, viewed through a browser-like interface: [Internet in GTA IV](https://gta.fandom.com/wiki/Internet_in_GTA_IV).
- Grand Theft Wiki notes that GTA IV's fake internet can update with story progress, support jobs, dating, ringtones, and other gameplay-adjacent functions; most sites are amusement, but some affect play: [Internet](https://www.grandtheftwiki.com/Internet).
- Wired's note on GTA IV's "Fruit" Apple parody highlights how the joke lands by closely matching a recognizable product category's tone and layout while exaggerating it: [Apple Parody Hidden Inside GTA IV](https://www.wired.com/2008/05/apple-parody-hi/).

Lessons for Friend CRM:

- The joke should feel like a real service inside the product world, not a random meme panel.
- It should parody the category: relationship productivity, surveillance theater, personal knowledge management, and social overthinking.
- It should have a fake brand voice and fake functionality, but real product safety.
- It should be interactive enough to feel like a toy, not so functional that it starts making claims.
- It should be specific to the selected person while never pretending to know hidden motives.

---

# Product Principle

The feature is a **toy artifact generator**, not a memory system.

Allowed:

- Generate fake dossier/poster/sticker visuals.
- Use visible person fields such as name, initials/photo, city, relationship labels, warmth, and non-sensitive summary.
- Use generic counts such as number of memories/open loops.
- Use confirmed, normal-sensitivity snippets only if the user explicitly selects them in a context picker.
- Add funny labels that are obviously decorative.

Not allowed:

- Do not scrape socials or messages.
- Do not infer hidden personality traits.
- Do not create hidden scores.
- Do not use sensitive/private notes by default.
- Do not send contact values to a provider.
- Do not save generated art as durable memory.
- Do not imply the poster is factual analysis.
- Do not create automated outreach or recommendations that evade consent.

Label requirement:

> Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.

The wording should be visible inside the Poster Lab and on the generated visual.

---

# Phase A — Local Dossier Poster Lab

## User Story

As a user, I want to generate a ridiculous fake dossier poster for a friend so the app feels fun and alive, while knowing it is not a factual record and is not sent anywhere.

## Entry Point

In `PersonRail`, near the current buttons:

- Existing: `Brief Me`
- Existing: `Erase File`
- New: `Make Fake Dossier Art`

Suggested button copy variants:

- `Make Fake Dossier Art`
- `Print Suspicious Poster`
- `Generate Non-Evidence`

Default recommendation: **Make Fake Dossier Art** because it is funny but clear.

## Poster Lab Flow

1. User clicks **Make Fake Dossier Art**.
2. Modal opens with a generated local preview.
3. Modal shows a short context receipt:
   - Name
   - City
   - Relationship labels
   - Warmth
   - Summary, only if person sensitivity is `normal`
4. Modal excludes:
   - Notes
   - Memories
   - Open loop descriptions
   - Contact/social values
   - Sensitive/private person summaries
5. User can click **Shuffle Bureau Nonsense** to regenerate decorative copy/style.
6. User can close without saving.

## Visual Direction

Treat this like an in-world microsite or printable poster from a fake overfunded friendship surveillance vendor.

Possible fake sub-brand names:

- **BuddyScan 3000**
- **FriendWatch Office Edition**
- **The Bureau of Casual Familiarity**
- **Normal Human Associates**
- **Department of Unfinished Business**

Recommended for v1: **BuddyScan 3000**.

Why:

- Broadly funny.
- Clearly fake.
- No direct GTA/IP reference.
- Works with current `Private friend intel` brand.

## Poster Template

Poster anatomy:

- Fake browser/header bar:
  - `www.buddyscan3000.biz/person-of-interest`
  - faux "Verified Probably" badge
- Main title:
  - `<NAME> IS CURRENTLY KNOWN`
- Profile visual:
  - existing profile photo if present, otherwise initials block
- Big fake stamp:
  - `NOT EVIDENCE`
  - `SOCIAL DEBT DETECTED`
  - `VIBES REQUIRE SUPERVISION`
  - `DO NOT OVERPLAY THE BIT`
- Comedic stats:
  - `Warmth: Warm / Cool / Neutral / Hot`
  - `Trust: 5 suspicious blue dots`
  - `Unfinished Business: 1 loose thread`
  - `Last Seen: 10d ago`
- Decorative warning:
  - `This poster was generated by a machine that has never successfully attended brunch.`
- Safety footer:
  - `Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.`

## Copy Examples

Use local deterministic templates, not provider calls:

- `Known alias: Person Who Absolutely Mentioned That Thing Once.`
- `Threat level: Might make plans and then require calendar courage.`
- `Recommended approach: Act normal for up to seven consecutive minutes.`
- `Evidence quality: vibes, receipts, and one suspiciously specific memory.`
- `Office note: Do not confuse remembering birthdays with having emotional intelligence.`
- `System warning: This poster contains decorative nonsense and zero legal standing.`

Tone rules:

- Punch up at the user's overthinking and the app's fake bureaucracy.
- Do not insult the friend.
- Do not mention protected traits.
- Do not imply manipulation, surveillance, stalking, or coercion.
- Keep the joke visibly absurd.

## Data Used In Phase A

Safe by default:

- `person.name`
- `person.city`
- `person.relationshipTypes`
- `person.warmth`
- `person.trust`
- `person.importance`
- `person.lastContactAt`
- `person.nextContactAt`
- `person.profilePhotoUrl`
- Count of open loops
- Count of memories

Conditional:

- `person.summary`, only when `person.sensitivity === "normal"`

Excluded:

- Raw notes
- Memory text
- Open loop descriptions
- Contact values
- Sensitive/private person summary
- Any data from external/social sites

This keeps Phase A entirely local and avoids expanding the AI privacy surface.

## Storage

Phase A should not add a new persisted data type.

The generated poster can live in component state while the modal is open. If export/download is needed later, add a separate explicit action such as:

- `Download Joke Poster`
- `Copy Poster Text`

Do not include poster artifacts in JSON export until the user explicitly chooses to save them as playful artifacts and the schema has a separate non-memory type.

---

# Phase B — Optional AI Image Provider

Do not build Phase B first.

If added later, it should be a separate route and explicit opt-in flow:

- `POST /api/ai/generate-dossier-visual`

Provider boundary:

- Server-side only.
- No provider key in browser bundle.
- `Cache-Control: no-store`.
- No production prompt/raw context logging.
- Request validation before provider call.
- Response validation before UI display.
- Deterministic local poster fallback on provider failure.

Context picker:

- Show exactly what will be sent.
- Default to only:
  - name
  - city
  - relationship labels
  - warmth
  - user-selected normal summary
- Private/sensitive notes are excluded by default and require an explicit per-item checkbox.
- Contact/social values are not sent.

Output:

- Treat as a generated image artifact.
- Label as fake/comedic.
- Never add it to memories/open loops.
- Never use it as relationship analysis.

Provider failure copy:

> The art machine jammed. We made a local fake poster instead. No data was saved.

---

# UX Risks

## Risk: The App Becomes Too Creepy

The app already plays with private-intel language. A fake poster can tip from cheeky into uncomfortable if it appears to surveil the friend.

Mitigation:

- Keep every generated label absurd and self-indicting.
- Aim jokes at the user's overpreparedness and the app's fake bureaucracy.
- Keep "no scraping / no syncing / no robot errands" copy nearby.

## Risk: Generated Art Feels Like Factual Analysis

AI images and posters can feel authoritative.

Mitigation:

- Use "fake", "joke", "not evidence", and "not memory" in the UI.
- Do not show it in the memories/open loops timeline.
- Do not persist by default.

## Risk: Sensitive Context Leaks To Provider

Image generation tempts rich prompts. Rich prompts tempt private content.

Mitigation:

- Start local-only.
- Require explicit context picker for any future provider call.
- Exclude private/sensitive content by default.
- Reuse existing server-side AI boundary principles.

## Risk: Export Size Bloats

The app now supports local profile photos as data URLs. Generated images would make exports much heavier.

Mitigation:

- Phase A is CSS/HTML component state.
- Do not store generated raster images in app data by default.
- If later persisted, add size limits and clear export warnings.

---

# Implementation Proposal

## PR 1: Local Poster Lab

Files likely touched:

- `src/components/PersonRail.tsx`
- `src/components/DossierPosterLab.tsx`
- `src/components/DossierPoster.tsx`
- `src/styles.css`
- `scripts/browser-regression.mjs`

Acceptance criteria:

- `PersonRail` has a visible **Make Fake Dossier Art** action.
- Clicking opens a modal/drawer with a local generated poster.
- Poster uses only safe default fields.
- Poster includes visible "Fake / Not memory / Not evidence" label.
- User can shuffle local joke/style variants.
- User can close without saving.
- No new provider route.
- No new persisted data type.
- Browser regression covers opening, shuffling, and closing the Poster Lab.
- `npm test`, `npm run build`, `npm run demo:check`, and browser regression pass.

## PR 2: Context Picker And Copy Export

Only after PR 1 feels good.

Acceptance criteria:

- Poster Lab shows a context receipt.
- User can choose whether to include normal summary.
- Private/sensitive summary is locked out with explanatory copy.
- User can copy poster text.
- No raw notes/contact values included.

## PR 3: Optional Provider Spike

Only after local poster has product value.

Acceptance criteria:

- Adds route shell and schema only, no production infra.
- Provider call is server-side.
- Context picker is required.
- Sensitive/private data excluded unless explicitly selected.
- Failure falls back to local poster.
- No generated image is stored as durable memory.

---

# Recommended First Run

Do **PR 1: Local Poster Lab** next.

Keep it intentionally small:

- local-only
- modal in `PersonRail`
- one poster template
- shuffle button
- no storage
- browser regression

This gives the product the GTA-IV-ish "fake website inside the app" energy without creating a new privacy or provider surface.

---

# Open Questions

- Should the local poster be downloadable as an image, or is copy/screenshot enough for now?
- Should the fake brand be **BuddyScan 3000** or something closer to the current "Private friend intel" voice?
- Should posters include profile photos by default, or should photo inclusion be a checkbox because images can feel more personal?
- Should normal memories be selectable in Phase B, or should all memory text remain excluded from visual generation?

---

# Decision

Proceed with a local-only Poster Lab before any real AI image generation.

The feature should make the app feel more alive, cheeky, and in-world while preserving the core trust rule:

**Facts live in the database. Jokes live in the poster lab.**
