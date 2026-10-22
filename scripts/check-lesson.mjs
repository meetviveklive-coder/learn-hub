#!/usr/bin/env node
// Content contract check for lesson files. See docs/TESTING.md.
// Usage: node scripts/check-lesson.mjs [files...]   (no args = all lessons)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse as parseYaml } from 'yaml';

const REQUIRED_H2 = [
  'In 3 lines',
  'Think of it like…',
  'Real-world example',
  'How it works',
  'Common mistakes',
  'Remember this',
  'Quiz',
  'Go deeper',
];
const DOMAINS = ['ai-agents', 'martech', 'jev', 'loop-engineering', 'harness-engineering', 'ai-architect'];
const MAX_GRADE = 12;
const MAX_WORDS = 1200;
const MAX_AGE_DAYS = 90;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : [];
  });
}

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return [null, src];
  return [parseYaml(m[1]), m[2]];
}

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Strip everything that isn't reader prose. */
export function proseOf(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/<Quiz[\s\S]*?\/>/g, ' ') // quiz data
    .replace(/<[^>]+>/g, ' ') // jsx/html tags
    .replace(/^#+ .*$/gm, ' ') // headings
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/[*_>|]/g, ' ');
}

export function fkGrade(text) {
  // Treat list items / lines as sentence boundaries too.
  const sentences = text
    .split(/[.!?]+\s|\n\s*[-\d]+[.)]?\s|\n{2,}/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);
  const words = text.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
  if (!sentences.length || !words.length) return 0;
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
}

function checkQuiz(body, errors) {
  const m = body.match(/<Quiz\s+questions=\{(\[[\s\S]*?\])\}\s*\/>/);
  if (!m) return errors.push('missing <Quiz questions={[...]} />');
  let qs;
  try {
    qs = Function(`"use strict"; return (${m[1]});`)();
  } catch (e) {
    return errors.push(`quiz is not valid JS: ${e.message}`);
  }
  if (qs.length < 3 || qs.length > 5) errors.push(`quiz needs 3–5 questions, has ${qs.length}`);
  qs.forEach((q, i) => {
    const n = i + 1;
    if (!q.q) errors.push(`quiz Q${n}: missing q`);
    if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`quiz Q${n}: needs ≥ 2 options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0))
      errors.push(`quiz Q${n}: answer index out of range`);
    if (!q.why || q.why.length < 20) errors.push(`quiz Q${n}: explanation (why) too short`);
  });
}

export function checkLesson(file, today = new Date()) {
  const errors = [];
  const warnings = [];
  const src = readFileSync(file, 'utf8');
  const [fm, body] = splitFrontmatter(src);

  if (!fm) return { errors: ['missing frontmatter'], warnings, stats: {} };
  if (!fm.domain) return { skip: true }; // index pages, not lessons

  // Frontmatter
  for (const k of ['title', 'description', 'domain', 'level', 'order', 'last_verified', 'status', 'author', 'reading_minutes'])
    if (fm[k] === undefined || fm[k] === '') errors.push(`frontmatter: missing ${k}`);
  if (fm.title && fm.title.length > 60) errors.push('frontmatter: title > 60 chars');
  if (fm.description && fm.description.length > 160) errors.push('frontmatter: description > 160 chars');
  if (fm.domain && !DOMAINS.includes(fm.domain)) errors.push(`frontmatter: unknown domain ${fm.domain}`);
  if (fm.domain && !file.replace(/\\/g, '/').includes(`content/docs/${fm.domain}/`))
    errors.push(`file is not inside content/docs/${fm.domain}/`);
  const sources = fm.sources ?? [];
  if (sources.length < 2) errors.push(`needs ≥ 2 sources, has ${sources.length}`);
  sources.forEach((s, i) => {
    if (!s.url?.startsWith('https://')) errors.push(`source ${i + 1}: url must be https`);
    if (!['official', 'paper', 'article', 'video'].includes(s.type)) errors.push(`source ${i + 1}: bad type`);
  });
  if (fm.last_verified) {
    const d = new Date(fm.last_verified);
    const age = (today - d) / 86400000;
    if (Number.isNaN(d.getTime())) errors.push('last_verified is not a date');
    else if (age < -1) errors.push('last_verified is in the future');
    else if (age > MAX_AGE_DAYS) warnings.push(`last_verified is ${Math.round(age)} days old`);
  }

  // Sections in order
  const h2 = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  let pos = -1;
  for (const s of REQUIRED_H2) {
    const i = h2.indexOf(s);
    if (i === -1) errors.push(`missing section "## ${s}"`);
    else if (i < pos) errors.push(`section "## ${s}" is out of order`);
    else pos = i;
  }

  // Remember: exactly 3 bullets
  const rem = body.match(/<Remember>([\s\S]*?)<\/Remember>/);
  if (!rem) errors.push('missing <Remember> block');
  else {
    const bullets = rem[1].split('\n').filter((l) => /^\s*- /.test(l)).length;
    if (bullets !== 3) errors.push(`<Remember> needs exactly 3 bullets, has ${bullets}`);
  }

  checkQuiz(body, errors);

  // Readability + length
  const prose = proseOf(body);
  const words = (prose.match(/[A-Za-z][A-Za-z'’-]*/g) ?? []).length;
  const grade = Math.round(fkGrade(prose) * 10) / 10;
  if (grade > MAX_GRADE) errors.push(`reading grade ${grade} > ${MAX_GRADE}`);
  if (words > MAX_WORDS) errors.push(`prose is ${words} words > ${MAX_WORDS}; split the lesson`);
  // A whole-lesson average can hide one dense paragraph — check each one too.
  prose
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => (p.match(/[A-Za-z]+/g) ?? []).length >= 25)
    .forEach((p) => {
      const g = fkGrade(p);
      if (g > MAX_GRADE + 4) errors.push(`dense paragraph (grade ${g.toFixed(1)}): "${p.slice(0, 60)}…"`);
    });
  for (const s of prose.split(/(?<=[.!?])\s+/)) {
    const n = (s.match(/[A-Za-z][A-Za-z'’-]*/g) ?? []).length;
    if (n > 35) warnings.push(`long sentence (${n} words): "${s.trim().slice(0, 60)}…"`);
  }

  return { errors, warnings, stats: { grade, words } };
}

// CLI
// pathToFileURL makes this work on Windows too (D:\… → file:///D:/…).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2).filter((a) => a.endsWith('.mdx'));
  const files = args.length ? args : walk('content/docs');
  let failed = 0;
  for (const f of files) {
    const r = checkLesson(f);
    if (r.skip) continue;
    const ok = r.errors.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${f}  (grade ${r.stats.grade}, ${r.stats.words} words)`);
    r.errors.forEach((e) => console.log(`   ✗ ${e}`));
    r.warnings.forEach((w) => console.log(`   ! ${w}`));
  }
  process.exit(failed ? 1 : 0);
}
