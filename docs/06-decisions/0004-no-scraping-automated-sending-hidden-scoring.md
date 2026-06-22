# ADR 0004 - No Scraping, Automated Sending, Or Hidden Scoring

**Status:** Accepted  
**Date:** 2026-06-22

---

## Context

Friend CRM should help the user remember and act thoughtfully. It should not become surveillance, automated persuasion, or a sales CRM with softer labels.

The source docs repeatedly exclude:

- Message scraping
- Automated sending
- Hidden scoring
- Sales CRM language
- Sentiment surveillance

## Decision

Friend CRM will not scrape private messages, send automated outreach, or assign hidden relationship scores.

The product may support:

- Manual note capture.
- User-entered text summaries.
- User-reviewed extraction.
- User-copied or user-edited next moves.
- Visible relationship attributes such as warmth, trust, importance, sensitivity, and strategic relevance.

The product must not support:

- Scraping private chats, email, or social messages.
- Sending messages automatically.
- Dark-pattern nudges or manipulative automation.
- Hidden scores that the user cannot inspect.
- Sales CRM labels such as "lead", "pipeline", "deal", "conversion", or "campaign".

## Consequences

This keeps the app aligned with a private intelligence desk rather than a social automation machine.

It also means:

- Future integrations must be opt-in and privacy-reviewed.
- Next move generation must stop at drafts or suggestions.
- Any scoring-like behavior must be visible, explainable, and user-controlled.
- Product language should remain human and relationship-specific.

## Follow-Ups

- Review future AI and integration work against this ADR.
- Keep `AGENTS.md` and `PROJECT.md` aligned with these constraints.
- Create additional ADRs if calendar/email integrations are reconsidered later.
