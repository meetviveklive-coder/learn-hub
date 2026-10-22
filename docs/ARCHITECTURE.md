# Architecture

## 1. System Overview
A static documentation site (Fumadocs on Next.js) built from MDX files in a GitHub repo and deployed by Vercel. Claude Code scheduled tasks (formerly "routines") run on Anthropic's cloud using the owner's Claude Pro subscription. They research, write, and check lessons, and open pull requests. The owner merges. Vercel deploys on merge.

There is no backend and no database. The repository *is* the database.

## 2. Architecture Pattern
Pattern: Static site + Git-as-database + agent loops over pull requests.
Reason: Every change is reviewable, reversible (git revert), free to host, and needs no secrets or servers.

## 3. Technology Stack
Frontend: Fumadocs (Next.js App Router), Fumadocs MDX, Tailwind (bundled with Fumadocs UI)
Backend: None
Database: Git repository (MDX + YAML + JSON)
Authentication: None (public site)
Storage: Git; browser localStorage for review schedule
Hosting: Vercel Hobby (personal, non-commercial)
CI: GitHub Actions (free for public repos) — deterministic checks only, no AI
Agents: Claude Code scheduled tasks on claude.ai (Pro subscription)
Analytics: None in MVP (Vercel Web Analytics optional later)

## 4. System Components

### Site (Next.js + Fumadocs)
- Render lessons from `content/docs/**`.
- Sidebar from folder structure + `meta.json`.
- Built-in search.
- Custom MDX components: `<Quiz>`, `<Remember>`, `<Analogy>`. Level/minutes/verified badges, sources list and "Mark as learned" render automatically from frontmatter.
- `/review` page (client component, localStorage).

### Content
- `content/docs/<domain>/<topic>/<lesson>.mdx`
- `topics.yaml` — the owner's queue (source of truth for *what* to learn).
- `progress.md` — agent run log (state between runs).

### CI (GitHub Actions)
- Frontmatter schema check (Fumadocs MDX schema with zod — the build fails on bad frontmatter).
- Reading-level check script on changed lessons.
- Required-sections check.
- Link check on changed lessons.
- `next build`.

### Agent loops (Claude Code scheduled tasks)
| Task | Trigger | Job |
|---|---|---|
| `new-lesson` | Schedule (daily, or N times/day) | Take next queued topic → research → write → self-check → open PR |
| `pr-checker` | GitHub event `pull_request.opened`, head branch starts with `claude/` | Second agent verifies facts, reading level and template; posts a verdict comment |
| `freshness` | Schedule (weekly) | Re-verify the 3 oldest lessons → PR |

## 5. Architecture Diagram
```
 You ──edit──► topics.yaml
                   │
   [new-lesson task, cloud] ──research (web)──► writes MDX on claude/<slug>
                   │
                   ▼
            Pull Request ──► GitHub Actions (CI) ──► Vercel Preview URL
                   │
   [pr-checker task] ──comment: PASS / FAIL + reasons
                   │
            You read preview → Merge (or request changes / close)
                   │
                   ▼
            main ──► Vercel Production deploy
```

## 6. Data Flow (one new lesson)
1. Scheduled task fires; repo cloned at `main`.
2. Agent reads `AGENTS.md`, `docs/CONTENT_STYLE.md`, `topics.yaml`, `progress.md`.
3. Picks the first `status: queued` topic with no open PR.
4. Researches official sources (web search/fetch).
5. Writes the lesson from `templates/lesson.mdx`.
6. Runs local checks (`npm run check:lesson`, `npm run build`).
7. Sets topic `status: in_review`, appends to `progress.md`.
8. Pushes `claude/lesson-<slug>`, opens PR with sources + doubts.
9. CI runs; Vercel posts a preview link; checker task comments.
10. Owner merges → status becomes `published` (set by the next run when it sees the merged PR).

## 7. Project Structure
```
/
├─ AGENTS.md              # agent rules (all tools)
├─ CLAUDE.md              # imports AGENTS.md (Claude Code)
├─ topics.yaml            # learning queue
├─ progress.md            # agent run log
├─ docs/                  # these blueprint docs
├─ templates/lesson.mdx   # lesson skeleton
├─ routines/              # prompts for scheduled tasks (copied into claude.ai)
├─ scripts/               # check-lesson.mjs, etc.
├─ content/docs/          # lessons (MDX)
│   ├─ ai-agents/
│   ├─ martech/
│   ├─ loop-engineering/
│   ├─ harness-engineering/
│   └─ ai-architect/
├─ app/                   # Next.js routes (Fumadocs)
├─ components/            # lesson/ (Quiz, callouts, MarkLearned, lesson-meta), review-list
└─ .github/workflows/ci.yml
```

## 8. Dependency Rules
- Lessons never import React components other than the approved MDX components.
- Agents may edit only: `content/docs/**`, `topics.yaml`, `progress.md`. Anything else needs a human-opened PR.
- Components never fetch remote data at runtime.
- No new npm dependencies from agent PRs.

## 9. Key Technical Decisions

Decision: Claude Code scheduled tasks as the loop runtime
Context: Owner wants no API spend; laptop shouldn't need to be on.
Alternatives: GitHub Actions + API key (costs per token); local `/loop` or Desktop scheduled tasks (machine must be on).
Reason: Runs in Anthropic's cloud on the Pro subscription. Trade-off: research preview, and every run consumes the same usage pool as the owner's chats.

Decision: Fumadocs
Context: Need sidebar, search, MDX, and room for custom React components (quiz, review page).
Alternatives: Astro Starlight (simpler, less React-friendly), custom Next.js.
Reason: Next.js-first, deploys natively on Vercel, scaffolds non-interactively (`create-fumadocs-app --yes`) which suits agents.

Decision: PR approval = owner merges (not GitHub "required approvals")
Context: Agent PRs are authored under the owner's own GitHub account, and GitHub does not let an author approve their own PR.
Reason: Ruleset blocks direct pushes to `main` and requires CI to pass; the merge click is the approval.

Decision: Review schedule in localStorage
Context: No backend in MVP.
Trade-off: Per-device only. Revisit if the owner uses multiple devices.

## 10. Performance Considerations
- Fully static output; no runtime functions needed → stays far inside Hobby limits.
- Images: prefer SVG or ```text diagrams; no large binaries in lessons.

## 11. Scalability Considerations
- ~1,000 lessons is fine for static build and Fumadocs search.
- Real bottleneck is owner review time, not infra. Agent cadence must match it.

## 12. Failure Scenarios
- Scheduled task fails / blocked network → run transcript shows it; status may still be green. Owner checks `progress.md` and the run list weekly.
- GitHub connection expires → tasks skip runs for up to 72h, then turn off. Reconnect and switch them back on.
- Pro usage limit hit → runs are rejected until the window resets. Lower cadence.
- Agent writes something wrong → caught by checker/CI/owner; if merged, `git revert` and add the topic back to the queue with a note.
- Research preview changes behaviour → prompts live in `routines/` so they're easy to re-apply.
