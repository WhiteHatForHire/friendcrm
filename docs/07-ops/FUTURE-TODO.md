# FUTURE-TODO.md — Parked Backlog

This document tracks future work that is not currently in the active hopper.

Do not use this as the near-term execution list. Active work belongs in `NEXT-IN-HOPPER.md`.

Move items from this file into `NEXT-IN-HOPPER.md` only when they are ready to be worked on soon.

---

# Product Backlog

Items below are parked until they are ready to move into `NEXT-IN-HOPPER.md`. The whole-project map lives in `PROJECT-PLAN.md`.

---

## Milestone 0 — Project Brain And Decisions

- Add Design Foundation Skill.
- Add App Scaffold Skill.

## Milestone 1 — Deterministic Local Core

- Extract state transition helpers from large UI components where useful.
- Add export coverage for people, notes, memories, open loops, next moves, and interactions.
- Add optional export filtering for sensitive/private records if real use shows it is needed.

## Milestone 2 — Source-Backed Review Workflow

- Improve deterministic extraction suggestions.
- Add rejected-suggestion behavior if needed for auditability.
- Consider making review suggestions unselected by default if real use shows preselection weakens trust.

## Milestone 3 — Real AI Extraction Boundary

- Add production transport only after deployment/backend target is ready.

## Milestone 4 — Briefs And Next Moves

- Continue improving brief and next-move quality after the active quality pass lands.

## Milestone 5 — Demo Polish And Real-Use Trial

- Explore richer profile media only after the current local upload path proves useful.
- Consider download-as-image for BuddyScan posters if users want to keep joke artifacts outside app data.
- Explore alternate visual skins after MVP usability is proven.
- Restack review modal items earlier if mobile trial review feels cramped.
- Log real-use friction into hopper or future backlog.
- Run a private real-data trial after the simulated trial findings are addressed.

## Milestone 6 — Persistence And Deployment Decision

- Add the first non-v1 schema migration when a breaking data shape change actually occurs.
- Add deployment notes after the MVP is worth sharing.
- Revisit IndexedDB, SQLite, Supabase/Postgres, and local file/database options after more use.

## Milestone 7 — Post-MVP Expansion

- Explore calendar/email integrations after local MVP proves useful.
- Consider multi-user accounts only after single-user private workflow works.
- Explore simple social graph visualization after Plot Board is useful.
- Add mobile app or mobile-specific experience later.
- Explore relationship recovery workflows.
- Explore trip/dinner planning mode.

---

## Product

- Explore Bureau Oath first-run onboarding:
  - Explain the product's joke without making the privacy model ambiguous.
  - State that Friend CRM does not scrape messages, contacts, social accounts, or send outreach.
  - Let the user choose Demo Bureau or Blank Desk.
- Explore Mobile BuddyScan Lite:
  - Generate a playful local-only dossier card from selected person fields.
  - Keep it as parody artifact, not a factual score or hidden analysis.
  - Do not send contact or social values to an external provider.
- Explore Relationship Receipt:
  - Create a shareable/exportable local receipt after a debrief or review session.
  - Include only user-approved facts, open loops, and next moves.
  - Make the output funny but clearly generated from the user's own local notes.
- Explore Fake Data Tour Mode:
  - Provide a one-tap fake-data walkthrough for App Store reviewers and portfolio visitors.
  - Keep fake sample data visibly marked as demo content.
- Explore richer profile media after local uploads prove useful:
  - Consider crop/resize controls if real users upload awkward images.
  - Consider a small photo-compression helper if exported JSON becomes too large.
  - Keep initials fallback for people without photos.
  - Preserve explicit local/export privacy behavior.
- Explore optional provider-backed AI dossier visuals after the local Poster Lab proves useful:
  - Keep the current local BuddyScan 3000 poster as fallback.
  - Require an explicit context picker before any provider call.
  - Exclude private/sensitive notes unless the user explicitly includes individual items.
  - Do not send contact/social values.
  - Treat generated images as playful artifacts, not durable facts.
  - Add size/export warnings before any generated raster artifact can be saved.
- Add calendar/email integrations after the local MVP proves useful.
- Consider multi-user accounts only after the single-user private workflow works.
- Explore a simple social graph view after the Plot Board is useful.
- Add mobile app or mobile-specific experience later.

## Design

- Add an App Store-safe parody copy pass:
  - Keep primary actions clear and review-safe.
  - Move edgier jokes into secondary labels, empty states, badges, receipts, and flavor text.
  - Use `docs/07-ops/COPY-AUDIT-APP-STORE-PARODY-2026-07-11.md` as the source.
- Explore optional tone packs after the base voice stabilizes:
  - `Bureau Clerk`
  - `Gentle Human`
  - `Maximum Nonsense`
  - Keep any theme toggle purely presentational.
- Continue mobile-specific UX hardening after the first mobile usability pass:
  - Consider a mobile-specific bottom nav if real use shows the current compact top nav still consumes too much space.
  - Consider collapsing Settings secondary panels after repeated mobile use.
- Continue full-browser audit polish after the 2026-06-25 sweep:
  - Add an optional Plot Board focus mode or rail-collapse affordance.
  - Consider a wider/stickier desktop Poster Lab preview column if visual review still feels too paperwork-heavy.
  - Collapse lower-priority Review Panel suggestion groups on mobile if dense reviews feel tiring.
  - Reduce remaining audit scanner false positives around generic input clipping while preserving real clipping checks.
- Continue the controlled CityDesk-inspired main app zany pass after the shell/classified run:
  - Consider more rotating parody widgets for side surfaces.
  - Add more low-risk stamps to metadata/status chips where readability stays strong.
  - Push Evidence Locker styling further without weakening export/import/delete clarity.
  - Keep trust-critical review, privacy, export/import, delete, and provider surfaces plain enough to understand immediately.
  - Use `docs/07-ops/MAIN-SITE-ZANY-CITYDESK-PROPOSAL.md` as the proposal source.
- Add more low-risk easter eggs:
  - Occasional cheeky stamps on empty states or completed actions.
  - A hidden "classified mode" visual flourish that does not change data.
  - Achievement-style toasts for harmless milestones such as adding 10 people or exporting a backup.
- Explore alternate visual skins:
  - Keep the current retro dossier style as the default.
  - Park a future "art deco steampunk private desk" skin as a theme-token exercise.
  - Do not build theme switching until core usability and trust feedback are stronger.
- Create a deeper design foundation after the first branded shell pass.
- Add a compact "Today's Signals" strip if real use confirms it helps orientation.
- Polish dense table/list scanning states after the first UI/UX audit fixes land.
- Refine empty states around real use, not marketing copy.
- Consider a small cursor-effects setting after front-facing demo feedback:
  - Keep the system cursor hidden only for fine-pointer devices when the effect
    is enabled.
  - Preserve the existing reduced-motion guardrail and visible keyboard focus.

## Engineering

- Move local browser storage to IndexedDB, SQLite, or a small backend once persistence needs are clearer.
- Split large UI components into focused modules when behavior stabilizes.
- Expand UI-level tests when new flows land.
- Add more component-level tests for `ReviewPanel`, `ReflectionLog`, and `SettingsView` after the first `PlotBoard` and `PersonRail` coverage pass.

## AI / Automation

- Explore a Clerk Desk review queue:
  - Keep all AI-generated durable records source-backed and user-approved.
  - Frame suggestions as draft clerical paperwork rather than automated judgment.
  - Avoid hidden scoring or unexplainable relationship rankings.
- Add production AI transport after deployment/backend direction is explicit.
- Add client-side AI response validation as defense-in-depth if routes move beyond trusted local development transport.
- Add drift detection using interaction history.

## Backend / Infra

- Add single-user auth only when remote persistence exists.
- Add deployment notes after the MVP is ready for a hosted demo.

## Research

- Repeat the synthetic real-use trial after major brief, next-move, persistence, or mobile workflow changes.
- Run a manual real-data trial after provider-backed extraction or persistence changes land. Parked by user direction on 2026-06-23; do not move back into the active hopper until explicitly requested.

## Ops

- Finalize App Store Review Notes before submission:
  - Explain fake-data demo path.
  - State local-first behavior.
  - State no scraping, no automated outreach, and no hidden scoring.
  - Point reviewers to Evidence/Settings for export/delete/reset controls.
- Add Design Foundation Skill.
- Add App Scaffold Skill.

---

# Future Product Ideas

- Private relationship recovery checklist for neglected important people.
- Lightweight trip/dinner planning mode.
- Relationship-specific boundaries and "do not repeat" review surface.
- A richer Plot Board planning mode for dinners, introductions, trips, soft asks, support, and repair conversations.

---

# Parking Lot

Use this section for raw ideas that are not ready to spec.
