# Testing

## 1. Testing Goals
Critical functionality:
- Site builds and every lesson renders.
- Every lesson meets the content contract (frontmatter, sections, reading level, sources).
- Quiz works by mouse, touch, and keyboard.
- Agent PRs touch only allowed paths.

## 2. Test Types

### Content checks (most important — run on every PR)
`scripts/check-lesson.mjs <files…>` checks each changed lesson for:
- All 8 required H2 sections, in order (see CONTENT_STYLE.md §3).
- `<Quiz>` with 3–5 questions; each has exactly one correct answer and an explanation.
- "Remember this" has exactly 3 bullets.
- ≥ 2 sources; each `url` is https.
- Flesch-Kincaid grade ≤ 12 on prose (strip code, frontmatter, MDX tags).
- `last_verified` not in the future and not older than 90 days for new/edited lessons.
- Prose word count ≤ 1,200.

### Path guard (agent PRs)
For PRs whose head branch starts with `claude/`: fail if any changed file is outside `content/docs/**`, `topics.yaml`, `progress.md`.

### Schema
Fumadocs MDX zod schema in `source.config.ts` → `next build` fails on bad frontmatter.

### Links
Link check on changed lessons only (external links can be flaky; mark as warning, not failure).

### Unit
`Quiz` and spaced-repetition scheduler (`lib/review.ts`) — small Vitest suite.

### End-to-end (manual for MVP)
On the Vercel preview: open the new lesson on phone width, take the quiz, check sidebar placement.

## 3. Testing Tools
Content: Node script (+ `text-readability`-style formula implemented in the script, no network)
Unit: Vitest
E2E: Manual on Vercel Preview (Playwright later if needed)

## 4. Test File Structure
```
scripts/check-lesson.mjs
scripts/path-guard.mjs
tests/unit/review.test.ts
tests/unit/quiz.test.tsx
```

## 5. Critical User Flows
Flow: Read and quiz
1. Open a lesson from the sidebar
2. Read; answer quiz
3. See correct/incorrect + explanation
Expected: all 8 sections visible; quiz usable by keyboard.

Flow: Review
1. Click "Mark as learned"
2. Visit `/review` on the due date
Expected: lesson listed as due.

## 6. Coverage
Not a % target. Must cover: check-lesson rules, path guard, review scheduler.

## 7. Commands
Test: `npm test`
Content check: `npm run check:lesson -- <files>`
Lint: `npm run lint`
Build: `npm run build`
Type Check: `npm run typecheck`

## 8. Definition of Done
- [ ] CI green (build, typecheck, content check, path guard)
- [ ] Checker verdict PASS (agent PRs)
- [ ] Preview checked on mobile width
- [ ] No unintended files changed
