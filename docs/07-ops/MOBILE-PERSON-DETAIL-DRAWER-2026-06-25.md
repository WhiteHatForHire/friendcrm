# MOBILE-PERSON-DETAIL-DRAWER-2026-06-25.md

**Type:** Mobile UX / App / Browser QA  
**Mode:** Local provider-disabled validation  
**Private data:** None  

---

# Summary

Added a mobile drawer behavior for the selected-person detail rail.

Before this pass, narrow/mobile viewports stacked the full person rail after the main workspace. That worked, but repeated mobile use felt cramped and made the People list less clean.

Now the selected-person file behaves like a mobile drawer:

- Closed by default on mobile.
- Opens when a person is added or selected.
- Opens when a person is selected from Radar or Plot Board.
- Provides a clear mobile-only `Close file` affordance.
- Closes when changing views or using keyboard view shortcuts.
- Desktop behavior remains unchanged.

---

# Files Changed

- `src/App.tsx`
- `src/components/PersonRail.tsx`
- `src/styles.css`
- `scripts/mobile-browser-regression.mjs`

---

# Validation

Passed:

```bash
npm test
npm run build
FRIEND_CRM_BASE_URL=http://127.0.0.1:5183 FRIEND_CRM_DISABLE_PROVIDER=1 npm run regression:mobile
FRIEND_CRM_BASE_URL=http://127.0.0.1:5183 FRIEND_CRM_DISABLE_PROVIDER=1 npm run trial:synthetic:browser
npm run demo:check
```

---

# Notes

- The drawer is CSS-driven and uses existing app state.
- No persistence, AI/provider, privacy, or data-shape changes were made.
- The inline People profile editor still exists; grouping/collapsing that editor remains a separate future mobile polish task.
