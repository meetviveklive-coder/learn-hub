# Setup & Review Workflow

## A. One-time setup (≈ 1 hour)
1. **GitHub repo** — create a public repo (e.g., `learn-hub`). Push this folder.
2. **Scaffold the site** (next step with Claude): `npx create-fumadocs-app@latest . --template +next+fuma-docs-mdx --install --yes`, then add the custom components, `source.config.ts` schema, scripts and CI.
3. **Vercel** — vercel.com → Add New Project → import the repo → Deploy. Hobby plan. Every PR now gets a Preview URL automatically.
4. **Protect `main`** — GitHub → Settings → Rules → Rulesets → New branch ruleset:
   - Target: default branch
   - ✅ Require a pull request before merging (approvals: **0** — see C below)
   - ✅ Require status checks to pass → `ci`
   - ✅ Block force pushes · ✅ Restrict deletions
   - Bypass list: **empty** (don't add yourself — agents push as you)
5. **Claude Code on the web** — claude.ai/code → connect GitHub and grant access to the repo.
6. **Claude GitHub App** — install on the repo (needed only for the pr-checker GitHub trigger).
7. **Scheduled tasks** — claude.ai/code/routines → New task → paste prompts from `routines/`. Remove unneeded connectors.
8. **Notifications** — GitHub mobile app → enable PR notifications for the repo.

## B. How you approve a lesson (daily, ~10 min each)
```
Agent opens PR ─► GitHub notifies you (phone/email)
                 │
                 ├─ CI check: green? (red = don't merge; comment "fix CI")
                 ├─ Checker comment: PASS? (NEEDS CHANGES = read its list)
                 └─ Vercel bot comment: "Preview" link ─► read the lesson as it will look live
                                                           take the quiz ← your first review!
Decide:
  ✅ Good       → "Squash and merge"  → live on the site in ~1 min
  ✏️ Small fix  → edit the file in GitHub's web editor on the same branch → merge
  🔁 Rework     → comment what's wrong, close PR, set the topic back to `queued`
                   in topics.yaml with a note (the next run rewrites it)
  ❌ Not wanted → close PR, set topic `blocked` with a reason
```

## C. Why "approval" = merge, not a GitHub "Approve" button
Scheduled tasks create commits and PRs **as your GitHub user**. GitHub never lets a PR's author approve their own PR, so "Require 1 approval" would block every agent PR forever. The ruleset instead forces: no direct pushes to `main` + CI must pass. The only way content goes live is you clicking Merge.

(If you want a true approval step later: create a separate bot GitHub account for the agents. Not needed for MVP.)

## D. Weekly (~10 min)
- Open claude.ai/code/routines → glance at runs. A green status only means the session ran, not that work succeeded — read `progress.md` too.
- Check claude.ai/settings/usage to see how much of your Pro usage the tasks used.
- Edit `topics.yaml` to add or reorder topics.
