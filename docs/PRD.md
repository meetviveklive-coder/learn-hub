# Product Requirements Document

## 1. Product Overview
Product Name: Learn Hub (working name — rename anytime)
One-Line Description: A personal, public learning site that AI agents keep growing with simple, example-led lessons, and that helps its owner remember what he learned.
Product Type: Personal knowledge site (static docs site)
Primary Platform: Web (desktop + mobile)

## 2. Problem
What problem are we solving? The owner learns fast-moving technical topics (AI agents, MarTech, Loop and Harness Engineering) and forgets them quickly.
Why does this problem matter? Re-learning the same thing wastes hours, and martech/AI tooling changes monthly, so notes go stale.
How is it solved today? Scattered notes, chats, bookmarks. Nothing is structured, verified, or reviewed again.

## 3. Goal
Primary Goal: Every topic the owner cares about has one clear, current, example-led lesson he can understand in under 10 minutes and recall a week later.
Secondary Goals:
- Lessons are written so a 12th-grade student could follow them.
- Agents do the research and writing; the owner only decides topics and approves.
- Out-of-date lessons get flagged and refreshed automatically.

## 4. Target Users
### User Type 1 — The Owner (primary)
Description: Technical professional, codes, interested in marketing technology. Forgets details quickly.
Needs:
- Short, structured explanations with real examples.
- A way to test himself later.
- Confidence that a lesson is still accurate.
Pain Points:
- Long docs bury the key idea.
- No reminder to revisit things.

### User Type 2 — Public visitors (secondary)
Description: Anyone who finds the site. Not designed for, but must not be misled.
Needs: Accurate content with sources and a "last verified" date.

## 5. User Stories
- As the owner, I want to add a topic to a queue so that an agent writes a lesson about it.
- As the owner, I want every lesson in the same shape so that I always know where the summary, example and quiz are.
- As the owner, I want to review each new lesson as a pull request with a preview link so that nothing wrong goes live without my approval.
- As the owner, I want to take a short quiz after a lesson so that I actually remember it.
- As the owner, I want a "Review today" page so that I revisit lessons before I forget them.
- As the owner, I want stale lessons re-checked so that I don't memorise outdated facts.

## 6. Core Features

### Feature 1 — Lesson pages
Purpose: Explain one concept per page.
User Flow: Sidebar → Domain → Topic → Lesson.
Inputs: MDX file following `templates/lesson.mdx`.
Outputs: Rendered page with TL;DR, analogy, real-world example, steps, mistakes, "Remember this", quiz, sources, last-verified date.
Acceptance Criteria:
- Every section from the template is present and in order.
- Reading level is grade 12 or lower (Flesch-Kincaid), excluding code blocks.
- At least 2 sources, each a primary or official source where one exists.
- `last_verified` date shown on the page.
Edge Cases:
- Topic too big for one lesson → agent splits it and adds the parts to the queue instead of writing a long page.
- No reliable source found → agent does not write the lesson; it records the reason in `progress.md`.

### Feature 2 — Topic queue and new-lesson loop
Purpose: Agent writes the next lesson from the owner's queue.
User Flow: Owner edits `topics.yaml` → scheduled task picks the next `status: queued` item → writes lesson on a `claude/` branch → opens a PR.
Acceptance Criteria:
- One lesson per PR; PR touches only that lesson, its `meta.json`, `topics.yaml` status, and `progress.md`.
- PR description lists sources, open doubts, and the checker's verdict.
- Agent never merges its own PR.
Edge Cases:
- Queue empty → agent proposes 3 next topics in a PR to `topics.yaml` only, does not write lessons.
- An open lesson PR already exists for the topic → skip it.

### Feature 3 — Quiz on every lesson
Purpose: Retrieval practice right after reading.
Acceptance Criteria:
- 3–5 multiple-choice questions, each with an explanation.
- Wrong options are plausible, not jokes.
- Answers checked in the browser, no server.

### Feature 4 — Review today (spaced repetition)
Purpose: Tell the owner which lessons to revisit.
Acceptance Criteria:
- Marking a lesson "done" schedules reviews at 1, 3, 7, 16 and 35 days.
- Stored in the browser (localStorage). Works without login.
Edge Cases:
- Different device or cleared storage → empty list; page explains why. (Cross-device sync is a Future item.)

### Feature 5 — Freshness loop
Purpose: Keep lessons current.
Acceptance Criteria:
- Weekly task checks the oldest `last_verified` lessons (max 3 per run).
- If facts changed → PR with the fix and a "What changed" note. If not → PR that only bumps `last_verified`.

### Feature 6 — Search
Purpose: Find a lesson fast. Use Fumadocs built-in search.

## 7. Non-Goals (this version)
- User accounts, comments, or multi-author editing.
- Ads, sponsorships, donation buttons (Vercel Hobby is non-commercial only).
- Auto-merging agent PRs.
- Lessons on topics not in the queue.
- Using the Claude API / paid API keys. Everything runs on the owner's Claude Pro subscription.

## 8. MVP Scope
Must Have:
- Fumadocs site deployed on Vercel from GitHub.
- Lesson template + 3 hand-reviewed seed lessons (AI Agents domain).
- CI checks (schema, reading level, links).
- New-lesson scheduled task opening PRs.
- Quiz component.
Nice to Have:
- PR checker task (GitHub-triggered, second agent).
- Review today page.
- Freshness task.
Future:
- Cross-device review sync.
- Flashcard view.
- Diagrams per lesson.

## 9. Success Metrics
Primary Metrics:
- Lessons merged per week (target: 3–5, matched to review capacity, not agent capacity).
- Owner quiz score on a lesson 7+ days after reading (self-reported via the review page).
Secondary Metrics:
- % of lessons verified in the last 90 days.
- % of agent PRs merged without edits.

## 10. Constraints
Technical: Claude Code scheduled tasks only (research preview — behaviour and limits may change). No Claude API. Static site, no database.
Business: Vercel Hobby → personal, non-commercial use.
Design: 12th-grade reading level; mobile-friendly.
Timeline: MVP before scaling to more domains.

## 11. Assumptions
- The owner reviews PRs within 2 days; otherwise the queue stops growing (agent skips when 3+ lesson PRs are open).
- Scheduled-task usage counts against the same Pro usage limits as the owner's normal Claude use.
- The default cloud environment can reach the web for research through Claude's web tools; if not, the environment's network access must be widened.

## 12. Open Questions
- Jev = TypeSafe AI's discriminative model (confirmed). Sources are thin (early access, no paper); keep the domain small.
- Site name and domain (default `*.vercel.app`).
- How many runs per day the owner is willing to spend from his Pro usage.

## 13. Definition of Done
- [ ] Lesson follows the template and passes CI
- [ ] Checker verdict is PASS or every FAIL item is resolved
- [ ] Preview deployment looks right on mobile
- [ ] Owner merged the PR
- [ ] `topics.yaml` and `progress.md` updated
