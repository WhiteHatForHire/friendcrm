# Friend CRM - Portfolio Case Study

Friend CRM is a tongue-in-cheek retro relationship desk with modern AI-aware workflows, local-first data, and privacy-first product boundaries.

It was built as a playable prototype and portfolio piece for a strange but real product question:

> Can software help someone remember people more thoughtfully without becoming a social surveillance machine?

![Friend CRM desktop people desk](07-ops/portfolio-screenshots-2026-06-29/01-desktop-people-desk.png)

---

# Summary

Friend CRM helps one person remember people, context, promises, boundaries, and next moves. It presents that work through a fake-serious retro private-desk interface: suspicious labels, bureau humor, social debt receipts, dossier panels, and a Poster Lab that goes fully over the top.

The joke matters because the product premise is inherently uncomfortable. The app looks like it might be creepy, then refuses to do the creepy parts. It does not scrape private messages, automate outreach, hide scores, or save AI-generated memory without review.

---

# The Problem

Personal context disappears easily:

- Promises get forgotten.
- Boundaries get fuzzy.
- Useful context is scattered across memory, notes, chats, and calendars.
- Existing CRM patterns feel transactional when applied to friendship or personal life.
- AI tools can make the whole thing feel invasive if they overreach.

The product challenge was to build a tool that helps with memory and follow-through while preserving agency, humor, and privacy.

---

# The Concept

Friend CRM is a private relationship memory desk.

Core loop:

1. Scan the People desk.
2. Capture a reflection note.
3. Review source-backed suggested memories or open loops.
4. Generate a draft brief or next move.
5. Plan follow-through on the Plot Board.
6. Export, restore, or delete user-owned data.

The prototype uses fake seeded data for public/demo use.

---

# Design Direction

The visual language intentionally moved away from sterile productivity software.

The final direction combines:

- Early-2000s web satire.
- Fake intelligence-bureau interfaces.
- Loud sticker typography.
- Glossy blue/yellow controls.
- Classified status labels.
- Cheeky microcopy.
- Modern responsive behavior and browser-tested workflows.

![Friend CRM Poster Lab](07-ops/portfolio-screenshots-2026-06-29/05-desktop-poster-lab.png)

The result is a product that feels memorable at a glance, but still gives clear trust signals around data and AI behavior.

---

# AI And Privacy Choices

The most important product decisions were about refusal.

Friend CRM does not:

- Scrape private messages.
- Send automated outreach.
- Add hidden social scoring.
- Treat AI output as truth.
- Save AI-generated durable memory without confirmation.

Instead:

- The database owns facts.
- AI proposes structure and language.
- Review is explicit.
- Suggestions are source-backed.
- Export and deletion paths remain visible.
- Public demos can run with deterministic fallback behavior.

![Friend CRM review panel](07-ops/portfolio-screenshots-2026-06-29/03-desktop-review-panel.png)

This makes the AI story more interesting than raw generation. The product is about how AI should behave around personal context.

---

# Product Surface

## People Desk

The People desk gives a fast scan of relationship context: vibe, trust, last contact, unresolved business, and current situation.

## Dossier Rail

The selected person panel shows memories, open loops, next moves, and local-only privacy context.

## Debrief Booth

The user captures reflection notes and decides who the note is about.

## Review Panel

Source-backed suggestions can be accepted, edited, or rejected before becoming durable memory.

## Plot Board

Next moves can be planned by status in a playful board interface.

![Friend CRM Plot Board](07-ops/portfolio-screenshots-2026-06-29/04-desktop-plot-board.png)

## Evidence Locker

Export, import, restore, and reset flows keep data ownership visible.

![Friend CRM Evidence Locker](07-ops/portfolio-screenshots-2026-06-29/06-desktop-evidence-locker.png)

## Mobile And Tablet

Mobile and tablet layouts are covered by browser regression scripts and curated screenshots.

![Friend CRM mobile dossier](07-ops/portfolio-screenshots-2026-06-29/07-mobile-people-drawer.png)

---

# Engineering Highlights

- Vite, React, and TypeScript.
- Local browser storage.
- Schema-versioned JSON export/import.
- Deterministic fallback behavior for safe demos.
- Server-side AI provider boundary for development routes.
- Vitest logic and component coverage.
- Browser, mobile, and tablet regression scripts.
- Synthetic fake-data trial harness.
- Repeatable portfolio screenshot capture script.

Validation command:

```bash
FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check
```

---

# What Worked

- The retro parody gave the product a distinctive identity.
- The privacy rules made the joke safer and sharper.
- Review/confirmation flows clarified the AI trust model.
- Browser automation caught real layout and interaction issues.
- Local-first storage kept the prototype easy to run and safe to demo.

---

# What Still Needs Work

- Hosted fake-data demo packaging.
- Final public README polish after demo URL exists.
- Browser audit noise reduction for generic input clipping warnings.
- A short walkthrough video or GIF.
- Production hosting/auth/persistence decisions if the project ever moves beyond portfolio-demo scope.

---

# Final Framing

Friend CRM is best understood as an AI product design case study, not just a quirky app.

Its strongest idea is the contrast:

> A fake-serious retro shell with serious modern product ethics underneath.

