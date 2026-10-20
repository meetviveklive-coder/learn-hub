@AGENTS.md

## Claude Code notes
- In scheduled (cloud) runs, every `gh pr ...` command fails (GraphQL is blocked). Use REST: read PRs with `gh api repos/meetviveklive-coder/learn-hub/pulls`, create them with `gh api repos/meetviveklive-coder/learn-hub/pulls -f title=... -f head=<branch> -f base=main -F body=@file`.
- Prefer WebFetch on official docs over search snippets.
