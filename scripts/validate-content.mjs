/**
 * Content integrity gate.
 *
 *   npm run validate:content
 *
 * The rules live in lib/content/validation.ts so the same checks can be reused
 * elsewhere later; this file only reports them. Requires a Node with TypeScript
 * type-stripping (Node 22.18+ / 24+), which is what CI and the Next build use.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The content modules import each other through the "@/..." alias that
// tsconfig/Next resolve. Node does not know about it, so teach the loader.
register(pathToFileURL(resolve(root, 'scripts/alias-loader.mjs')));

const { validateContent } = await import(pathToFileURL(resolve(root, 'lib/content/validation.ts')).href);

const issues = validateContent();

if (issues.length === 0) {
  console.log('content ok — no integrity issues found');
  process.exit(0);
}

const byEntity = new Map();
for (const issue of issues) {
  if (!byEntity.has(issue.entity)) byEntity.set(issue.entity, []);
  byEntity.get(issue.entity).push(issue);
}

console.error(`\ncontent validation failed — ${issues.length} issue(s)\n`);
for (const [entity, list] of byEntity) {
  console.error(`  ${entity}`);
  for (const issue of list) {
    console.error(`    ${issue.id}: ${issue.message}`);
  }
  console.error('');
}

process.exit(1);
