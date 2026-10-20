# Content Style
(The blueprint's CODE_STYLE.md, applied to lessons — lessons are this product's "code". Code rules for the site itself are in CODE_STYLE.md.)

## 1. Reader
A smart 12th-grade student who has never heard of the topic. Also the owner, six months from now, who has forgotten it.

## 2. Hard Rules
- One concept per lesson. If you need more than ~1,200 words (excluding code), split it.
- Reading level: Flesch-Kincaid grade ≤ 12 (prose only, code excluded). Aim for 9–10.
- Sentences ≤ 25 words. Paragraphs ≤ 4 sentences.
- Define every term the first time it appears, in plain words, in the same sentence or the next.
- No unexplained acronyms. Write it out once: "Customer Data Platform (CDP)".
- Active voice. "The agent calls the tool", not "The tool is called by the agent".
- Second person is fine: "you".
- Never invent facts, numbers, quotes, version numbers, prices or feature names. If unsure, leave it out or mark it in the PR's "Doubts" list.
- Every factual claim about a product (features, limits, pricing, versions) must come from a source listed in frontmatter, checked during this run.
- Do not copy text from sources. Explain in your own words. Quotes ≤ 15 words, max one per source, only when exact wording matters.

## 3. Lesson Shape (fixed order — see templates/lesson.mdx)
1. **In 3 lines** — what it is, why it matters, one-line example.
2. **Think of it like…** — one everyday analogy. Then one sentence saying where the analogy breaks.
3. **Real-world example** — a concrete, named-but-generic scenario ("an online shoe store", "a support team"). Real company names only if a source documents it.
4. **How it works** — numbered steps, a table, or a ```text diagram (Mermaid not enabled yet). Code only if it helps; keep it under 30 lines.
5. **Common mistakes** — 3–5 bullets, each: mistake → why it hurts → what to do.
6. **Remember this** — exactly 3 bullets. Must be answerable from memory.
7. **Quiz** — 3–5 questions using `<Quiz>`. Test understanding, not trivia.
8. **Go deeper** — related lessons (internal links) + sources.

## 4. Examples
Good: "An agent is a loop: the model picks an action, a tool runs it, and the result goes back to the model. It repeats until the job is done."
Bad: "Agentic systems leverage iterative LLM-driven orchestration paradigms to autonomously execute multi-step workflows."

## 5. Tone
Friendly, direct, a little curious. No hype ("revolutionary", "game-changing"). No filler intros ("In today's fast-paced world…").

## 6. Freshness
- `last_verified` = the date you actually checked every product fact against its source.
- Fast-moving domains (AI agents, MarTech tools, Claude Code features): re-verify every 90 days.
- If a fact changed, add a short "What changed (YYYY-MM-DD)" note at the end.

## 7. Don't
- Don't write about topics not in `topics.yaml`.
- Don't add opinions as facts. Label opinions: "Many practitioners prefer…" with a source.
- Don't include employer, client, or personal information.
