#!/usr/bin/env node
// Fails if an agent branch (claude/*) changes files outside the allowed paths.
// Usage: node scripts/path-guard.mjs <head-branch> <file...>
const [branch, ...files] = process.argv.slice(2);
const ALLOWED = [/^content\/docs\//, /^topics\.yaml$/, /^progress\.md$/];

if (!branch?.startsWith('claude/')) {
  console.log(`path-guard: branch "${branch}" is not an agent branch — skipped`);
  process.exit(0);
}
const bad = files.filter((f) => !ALLOWED.some((r) => r.test(f)));
if (bad.length) {
  console.log('path-guard: agent PR changed files outside allowed paths:');
  bad.forEach((f) => console.log(`  ✗ ${f}`));
  process.exit(1);
}
console.log(`path-guard: OK (${files.length} files)`);
