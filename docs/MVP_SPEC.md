# Friend CRM - MVP Spec

## Problem

People with dense personal and professional networks lose track of context. They forget promises, miss follow-ups, under-invest in important relationships, and over-rely on scattered memory across texts, notes, calendars, and vibes.

Most CRMs are built for sales teams. Most personal CRMs are too polite and too shallow. Friend CRM should be practical enough to use and distinct enough to remember.

## Target user

Initial user: Marcus.

Secondary users later:

- Founders and operators.
- Artists and creative producers.
- Community builders.
- Freelancers with mixed friend/client/collaborator networks.
- People rebuilding their social life after a major transition.

## Core jobs

1. Remember people.
2. Preserve context.
3. Track promises.
4. Plan next moves.
5. Prepare before contact.
6. Reflect after contact.
7. Notice drift before it becomes neglect.

## Entities

### Person

- id
- name
- aliases
- relationship types
- current city
- timezone
- contact methods
- importance tier
- warmth
- trust level
- strategic relevance
- sensitivity level
- last contact date
- next contact date
- notes summary
- created at
- updated at

### Note

- id
- person ids
- date
- source type: manual, meeting, call, dinner, text-summary, memory
- raw text
- extracted memories
- extracted promises
- extracted dates
- sensitivity level
- created at

### Open Loop

- id
- person id
- title
- description
- due date
- status: open, planned, done, dropped
- source note id

### Next Move

- id
- person id
- type: message, invite, intro, apology, ask, support, check-in, collaboration
- draft
- rationale
- risk
- status: idea, queued, done, dismissed

### Interaction

- id
- person ids
- date
- channel
- summary
- emotional read
- follow-ups
- reflection

## Views

### People

Filterable list by:

- relationship type
- warmth
- importance
- last contact
- next action
- city
- open loops

### Person Detail

Includes:

- summary
- key memories
- last interaction
- open loops
- next moves
- sensitive boundaries
- timeline
- AI brief button

### Radar

Shows:

- neglected important people
- upcoming follow-ups
- active social opportunities
- overdue promises
- fragile or ambiguous relationships
- people to protect

### Plot Board

A planning surface for:

- dinners
- introductions
- collaborations
- trips
- soft asks
- repair conversations
- people to reconnect with

### Reflection Log

Post-interaction capture:

- what happened
- what mattered
- what was promised
- what to remember
- what not to repeat

## AI features

### Memory Extractor

Input: raw note.

Output:

- durable memories
- names mentioned
- promises
- dates
- sensitivities
- suggested tags
- confidence

### Pre-Meeting Brief

Input: person profile plus recent notes.

Output:

- what to remember
- current context
- open loops
- suggested topics
- things to avoid
- one good next move

### Next Move Generator

Input: person profile, desired outcome, relationship context.

Output:

- suggested message
- rationale
- risk flag
- more direct alternative
- warmer alternative

### Drift Detector

Input: people and interaction history.

Output:

- people drifting
- why they matter
- recommended low-pressure action

## MVP exclusions

- Message scraping.
- Automatic send.
- Multi-user accounts.
- Social graph visualization beyond a simple board.
- Calendar/email integrations.
- Mobile app.
- Sentiment surveillance.

## Success metrics

For a private MVP:

- 50 people entered.
- 25 interaction notes captured.
- 20 open loops extracted.
- 10 useful pre-meeting briefs generated.
- 5 neglected relationships recovered or clarified.

The real metric: user comes back before a dinner, call, date, or ask because the app knows useful context.

