# Code Style & Conventions (site code)

## 1. General Principles
- Keep the Fumadocs defaults; customise only what the PRD needs.
- Prefer readable code over clever code. Consistency over novelty.
- Reuse Fumadocs UI components before writing new ones.

## 2. Naming
Components: PascalCase (`Quiz.tsx`)
Functions/variables: camelCase
Constants: UPPER_SNAKE_CASE
Files: kebab-case except components
Content slugs: kebab-case

## 3. Folder Structure
See ARCHITECTURE.md §7. Custom MDX components live in `components/lesson/` and are registered in `components/mdx.tsx`.

## 4. Imports
- Absolute imports via `@/`.
- No barrel files.

## 5. Components
- Quiz, Analogy, Remember, lesson-meta: presentational, no data fetching.
- Client components (`"use client"`) only where interaction is needed (Quiz, ReviewList).

## 6. Functions
One job each. Scripts in `scripts/` are plain Node ESM (`.mjs`), no extra deps unless unavoidable.

## 7. Error Handling
- localStorage reads/writes wrapped in try/catch; page works without storage.
- Build must fail loudly on bad frontmatter (zod schema), never silently skip a lesson.

## 8. Comments
Explain *why*, not *what*.

## 9. Logging
None in the browser beyond development.

## 10. Formatting
Formatter: Prettier (Fumadocs template default)
Linter: ESLint / Biome — whichever the scaffold generates; don't switch
Type Checking: `tsc --noEmit`

## 11. Do
- Keep changes focused; one concern per PR.
- Update docs/ when behaviour changes.

## 12. Don't
- Add dependencies in agent PRs (agents only touch content).
- Add analytics/ads/trackers without updating SECURITY.md and checking Vercel Hobby terms.
- Change unrelated files.
