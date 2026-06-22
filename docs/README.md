---
title: "Friend CRM"
status: build-candidate
privacy: working
tags:
  - product-candidate
  - personal-systems
  - social
  - ai
---

# Friend CRM

## One-line concept

Friend CRM is a private relationship intelligence system for remembering people, context, promises, follow-ups, shared interests, and social strategy without pretending human relationships are sales leads.

## Why it is interesting

The product is intentionally uncomfortable in a useful way. A normal personal CRM is bland: birthday reminders, contact notes, "reach out soon." Friend CRM becomes more distinctive if it embraces the tension between care, memory, plotting, and social agency.

The right version is not manipulative automation. It is a private operator console for being more intentional with people:

- Who matters right now?
- What do I owe them?
- What did they tell me that I should not forget?
- What would be thoughtful to send?
- Which relationships are strategic, intimate, creative, professional, or fragile?
- Where am I drifting, avoiding, over-investing, or being extractive?

## Product angle

The wedge is a small, local-first app for one person managing a dense social graph across friends, collaborators, founders, artists, exes, mentors, clients, and weak ties.

It should feel slightly mischievous, but the data model should be careful. The creepiness is the aesthetic hook. The ethics are the product discipline.

## MVP

### Core objects

- Person
- Relationship type
- Last contact
- Next move
- Promises made
- Shared context
- Current warmth
- Strategic relevance
- Sensitive boundaries
- Open loops
- Notes and memories

### Main views

- People list with filters by relationship type, warmth, last contact, and next action
- Person detail page with memory, context, open loops, and suggested next moves
- Radar view showing who is drifting, who is active, and who needs attention
- Plot board for social plans, introductions, collaborations, trips, dinners, and soft asks
- Reflection log for after meaningful interactions

### AI features

- Summarize a note into durable memory
- Extract promises, dates, names, and follow-ups
- Suggest a non-generic next message
- Identify neglected relationships
- Flag potentially extractive or socially risky moves
- Generate "what should I remember before seeing this person?" brief

## Tone

The interface should not feel like enterprise CRM. It should feel like a private intelligence desk for a person with a real social life.

Good labels:

- Plot Board
- Warmth
- Open Loops
- Next Move
- Social Debt
- Weak Signals
- Dinner Candidates
- People To Protect

Avoid:

- Pipeline
- Deal stage
- Lead score
- Conversion
- Campaign

## Guardrails

- No automated outreach in MVP.
- No scraping private messages.
- No scoring people as "value" without human-readable context.
- No dark-pattern persuasion templates.
- Every AI suggestion should be editable and attributable to source notes.
- Sensitive notes should be clearly marked and easy to delete/export.

## Why now

This pairs well with the personal archive and Symposium OS work. The archive remembers documents. Friend CRM remembers people. Practice Mirror rehearses conversations. Together they form a practical personal operating layer.

## Build priority

Medium-high. This is a good portfolio product because it is simple to demo, funny enough to remember, and concrete enough to build quickly. The key risk is taste: if it becomes generic CRM, it loses the reason to exist.
