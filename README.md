# Learn Hub

Personal learning site. Lessons are researched and written by Claude Code scheduled tasks, checked by a second agent and CI, and approved by me via pull requests.

- What & why → `docs/PRD.md`
- How it works → `docs/ARCHITECTURE.md`
- Setup & how to review → `docs/SETUP.md`
- Lesson rules → `docs/CONTENT_STYLE.md`, `templates/lesson.mdx`
- What to learn next → `topics.yaml`
- Agent prompts → `routines/`

Status: v0.1 — site scaffolded, 1 seed lesson, CI, quiz and review page. Not yet deployed.

## Run locally
```bash
npm ci
npm run dev        # http://localhost:3000
npm run check:lesson
npm test
```
