# Content Model
(Replaces the blueprint's DATABASE.md — this site has no database; files in git are the data.)

## 1. Storage
Engine: Git repository (MDX, YAML, JSON)
Hosting: GitHub (public repo)

## 2. Naming Conventions
Folders and files: `kebab-case`, lowercase, no dates in names.
Slugs: stable forever once published (URLs must not break). Rename = add a redirect.
Domains: `ai-agents`, `martech`, `loop-engineering`, `harness-engineering`, `ai-architect` (+ future).

## 3. Entities

### Domain (folder)
Purpose: Top-level subject. Path: `content/docs/<domain>/`
Contains: `index.mdx` (overview + learning path), `meta.json` (sidebar order).

### Topic (folder)
Purpose: A group of related lessons. Path: `content/docs/<domain>/<topic>/`
Contains: `meta.json`, lessons.

### Lesson (MDX file)
Purpose: One concept, readable in under 10 minutes.
Frontmatter fields:

| Field | Type | Required | Rule |
|---|---|---|---|
| `title` | string | yes | ≤ 60 chars, plain words |
| `description` | string | yes | one sentence, ≤ 160 chars |
| `domain` | enum | yes | one of the domain slugs |
| `level` | enum | yes | `basics` / `intermediate` / `advanced` |
| `order` | number | yes | position in the topic's learning path |
| `prerequisites` | string[] | no | slugs of lessons to read first |
| `tags` | string[] | no | lowercase |
| `sources` | {title, url, type}[] | yes, ≥ 2 | `type`: `official` / `paper` / `article` / `video` |
| `last_verified` | date (YYYY-MM-DD) | yes | date facts were last checked |
| `status` | enum | yes | `draft` / `published` / `needs_update` |
| `author` | enum | yes | `agent` / `owner` / `agent+owner` |
| `reading_minutes` | number | yes | estimated |

### Queue item (`topics.yaml`)
| Field | Type | Rule |
|---|---|---|
| `id` | string | kebab-case, becomes the lesson slug |
| `domain` | enum | domain slug |
| `topic` | string | topic folder |
| `title` | string | working title |
| `why` | string | owner's reason / angle (agent must respect it) |
| `priority` | 1–3 | 1 = next |
| `status` | enum | `queued` / `in_review` / `published` / `blocked` |
| `notes` | string | optional owner hints, preferred sources |

### Run log (`progress.md`)
Append-only. One line per run: date, task name, outcome, PR link or reason skipped.

## 4. Relationships
Domain 1 → many Topics → many Lessons.
Lesson many → many Lessons via `prerequisites`.
Queue item 1 → 0..1 Lesson (by `id` = slug).

## 5. Constraints
- Slug unique across the whole site.
- Every `prerequisites` slug must exist.
- A queue item can be `in_review` only if an open PR exists for it.

## 6. Indexes
Fumadocs search index is built at build time. Nothing else.

## 7. Validation
Enforced at build time by the Fumadocs MDX zod schema (`source.config.ts`) and by `scripts/check-lesson.mjs` (sections, reading level, source count).

## 8. Soft Delete
Yes. Do not delete lessons. Set `status: needs_update` or move to an `archive/` topic hidden from the sidebar. Git history keeps everything anyway.

## 9. Auditing
Git history + PR descriptions + `progress.md`.

## 10. Sensitive Data
None should exist. No personal data, employer data, or client names in lessons (public repo).

## 11. Migration Rules
Changing the frontmatter schema requires: update this doc, update `source.config.ts`, update `templates/lesson.mdx`, migrate all lessons in the same PR. Human-opened PR only.

## 12. Seed Data
3 hand-reviewed AI Agents lessons (see `topics.yaml`, priority 1). They set the quality bar the agent copies.
