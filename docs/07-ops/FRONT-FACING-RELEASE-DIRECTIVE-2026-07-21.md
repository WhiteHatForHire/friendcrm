# Front-Facing Release Directive — 2026-07-21

## Objective

Ship Friend CRM as a polished public fake-data demo that communicates the
product in under a minute, preserves the local-first privacy boundary, and
feels intentional on a desktop browser.

## Approved Scope

1. First-run mode choice
   - Offer `Take the 60-second tour` and `Open a blank desk` before a new
     browser sees the seeded dataset.
   - Persist the choice locally and keep restore/clear behavior deterministic.
2. Curated sample stories
   - Present three legible story threads covering a pending introduction, a
     private boundary, and an active collaboration.
   - Use only synthetic data already contained in the local demo.
3. Guided orientation
   - Give each primary destination a plain-language purpose and one useful
     first action.
   - Keep the existing bureau flavor in secondary copy.
4. Progressive dossier detail
   - Make the People desk easier to scan by prioritizing the most useful
     dossier sections before lower-priority detail.
5. Public Evidence Locker
   - Keep the public surface focused on local privacy, export, clear, and
     sample restore.
   - Hide inactive hosted-sync and prototype-trial scaffolding from public demo
     presentation without changing the local development capability.
6. Desktop interaction polish
   - Keep the concise shell, persistent clear/restore data control, and the
     rainbow pointer trail with a hidden fine-pointer system cursor.

## Required Quality Gates

- `npm test`
- `npm run build`
- `npm run mobile:check`
- `FRIEND_CRM_DISABLE_PROVIDER=1 npm run demo:check`
- `git diff --check`
- Browser smoke for first-run tour, blank desk, clear, restore, navigation,
  reduced-motion behavior, keyboard access, and a desktop visual review.
- Regenerate the relative-asset static package only after the source gates pass.
- Run the Symposium publication command only from a clean, intended release
  worktree. Do not overwrite unrelated work.

## Multi-Agent Execution Lanes

| Lane | Responsibility | Delivery Gate |
| --- | --- | --- |
| Product implementation | First-run tour, blank desk, curated stories, guided destination copy, progressive dossier detail | Source tests and build pass |
| Public release package | Public Evidence Locker posture, relative static build, Symposium route integration | Fake-data-only package and protected-route contract pass |
| Independent QA | Desktop and responsive visual review, first-run, clear/restore, keyboard, reduced motion, and navigation smoke | Reproducible findings are fixed or explicitly documented |
| Release owner | Reconcile fixes, rerun all gates, publish from clean canonical `main`, and verify live routes | Live URL and production verification receipt |

## Completion Standard

The final handoff must include the live public URL, the source and static
package commit or working-tree state, validation results, design/functionality
audit findings, and any issue fixed during QA.
