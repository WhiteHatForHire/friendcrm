# Tablet Breakpoint Regression - 2026-06-25

Agent 2 lane: mobile and responsive QA, tablet breakpoint regression and screenshots.

## Scope

- Viewports: `768x1024` and `834x1112`.
- Views covered: People, selected-person drawer, compact profile editor, Plot Board, Review Panel, Settings / Evidence Locker.
- Core assertions: no horizontal overflow, compact navigation remains reachable, tablet drawer behavior works, Settings hides the person rail, and primary controls remain reachable.

## Result

Passed after fixing the shared compact editor runtime issue and hardening the tablet script assertions.

Validation command:

```bash
FRIEND_CRM_BASE_URL=http://127.0.0.1:5185 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:tablet
```

Result:

- PASS `tablet-768x1024` People, drawer, and compact editor
- PASS `tablet-768x1024` Plot Board remains reachable
- PASS `tablet-768x1024` Review Panel fits
- PASS `tablet-768x1024` Settings safety controls fit
- PASS `tablet-834x1112` People, drawer, and compact editor
- PASS `tablet-834x1112` Plot Board remains reachable
- PASS `tablet-834x1112` Review Panel fits
- PASS `tablet-834x1112` Settings safety controls fit

## Artifacts

- `findings.json`
- `tablet-768x1024-people.png`
- `tablet-768x1024-person-drawer.png`
- `tablet-768x1024-people-editor.png`
- `tablet-768x1024-plot-board.png`
- `tablet-768x1024-review-panel.png`
- `tablet-768x1024-settings.png`
- `tablet-834x1112-people.png`
- `tablet-834x1112-person-drawer.png`
- `tablet-834x1112-people-editor.png`
- `tablet-834x1112-plot-board.png`
- `tablet-834x1112-review-panel.png`
- `tablet-834x1112-settings.png`

## Notes

- The first run found a real React runtime issue in `InlineProfileEditor`: `event.currentTarget.open` was being read inside a state updater after the synthetic event was no longer safe to use.
- The fix captures `event.currentTarget.open` before calling `setOpenEditorSections`.
- The tablet script now waits for the actual quick-add placeholder and uses the Plot Board column `aria-label` instead of matching hidden select option text.
