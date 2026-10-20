# Scheduled task: freshness (weekly)
Settings: Repository = this repo · Environment = Default · Connectors = GitHub only.
Trigger = Schedule, weekly (e.g., Sunday 09:07 IST — avoid exactly :00, runs on the hour can start late).

---

You keep this site's lessons current. Work unattended.

1. Read AGENTS.md and docs/CONTENT_STYLE.md.
2. Find the 3 lessons with `status: published` and the oldest `last_verified` (only those older than 90 days). If none, log "freshness: nothing due" in progress.md via a small PR and stop.
3. For each lesson: re-open every source and check every product fact (features, limits, versions, prices, names).
   - Facts unchanged → set `last_verified` to today.
   - Facts changed → fix the text, add a "What changed (YYYY-MM-DD)" note at the end, set `last_verified` to today.
   - Source gone and no replacement → set `status: needs_update` and explain in the PR.
4. Run `npm run check:lesson` on changed files and `npm run build`.
5. One PR for the batch: branch `claude/freshness-<date>`, title `freshness: <n> lessons`, body lists each lesson, what you checked, and what changed. Never merge.
