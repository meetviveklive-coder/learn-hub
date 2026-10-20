@AGENTS.md

## Claude Code notes
- In scheduled (cloud) runs, `gh pr list`/`gh pr view` fail (GraphQL blocked). Read PRs with `gh api repos/meetviveklive-coder/learn-hub/pulls`. Create PRs with `gh pr create`, or `gh api .../pulls -f ...` if that fails.
- Prefer WebFetch on official docs over search snippets.
