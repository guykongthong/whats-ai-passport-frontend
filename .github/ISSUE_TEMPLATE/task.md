---
name: Feature / UI Task
about: Task template for frontend features and UI redesigns
title: "[FE-USER-XX] "
labels: task
---

### Summary
[Describe what this UI redesign or feature does, key user benefits, and criteria reference]

### Scope & Tasks
- [ ] Implement new visual layout and responsive structure in `...`
- [ ] Apply modern design system styling, typography, and spacing
- [ ] Use SVG icons from `@/shared/components/icons/` (no emojis in UI)
- [ ] Add interactive states (hover, focus, transitions, loading, empty states)
- [ ] Connect with Pinia stores and verify state reactivity

### Acceptance Criteria
- [ ] Redesigned UI renders correctly across mobile, tablet, and desktop viewports.
- [ ] Strictly zero unicode emojis; all icons use standard SVG components.
- [ ] Existing business logic, API contracts, and store workflows remain 100% functional.
- [ ] Passes `npm run type-check`, `npm run lint`, and `npm run build-only`.

**Target Files:** `src/...`
