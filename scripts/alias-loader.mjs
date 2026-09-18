/**
 * Resolves tsconfig's "@/..." path alias, plus the extensionless and directory
 * imports that bundlers do implicitly, for plain Node.
 *
 * Next handles all of this during the build; the content validation script runs
 * outside Next, so it needs the same resolution to load the content modules.
 */
import { existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSIONS = ['.ts', '.tsx', '.js', '.mjs'];

/** Mirrors bundler resolution: exact file, then +ext, then /index+ext. */
function resolveToFile(absPath) {
  if (existsSync(absPath) && statSync(absPath).isFile()) return absPath;

  for (const ext of EXTENSIONS) {
    const withExt = `${absPath}${ext}`;
    if (existsSync(withExt)) return withExt;
  }

  if (existsSync(absPath) && statSync(absPath).isDirectory()) {
    for (const ext of EXTENSIONS) {
      const indexFile = resolve(absPath, `index${ext}`);
      if (existsSync(indexFile)) return indexFile;
    }
  }

  return null;
}

export function resolve_(specifier, context, nextResolve) {
  let absPath = null;

  if (specifier.startsWith('@/')) {
    absPath = resolve(root, specifier.slice(2));
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    // Relative imports between content modules are extensionless too.
    const parentPath = context.parentURL?.startsWith('file:')
      ? dirname(fileURLToPath(context.parentURL))
      : null;
    if (parentPath) absPath = resolve(parentPath, specifier);
  }

  if (absPath) {
    const file = resolveToFile(absPath);
    if (file) return nextResolve(pathToFileURL(file).href, context);
  }

  return nextResolve(specifier, context);
}

export { resolve_ as resolve };
