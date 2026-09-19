/**
 * The files a pull request actually touched.
 *
 * This is the closest the page gets to showing source, and it stops exactly
 * where the evidence does: paths and line counts, read from the GitHub API,
 * with no diff text reproduced and nothing paraphrased. It answers the question
 * a reader actually has — "was this a real change, and did it come with tests?"
 * — from data rather than from adjectives.
 *
 * A path is marked as a test file purely on the path itself, which is an
 * observation about the filename and not a claim about what the test asserts.
 * The written test evidence beside this is the pull request's own words.
 *
 * The bar is proportional but never zero-width when there are lines, so a
 * one-line change still reads as a change rather than as nothing.
 */
const ADDED = '#22c55e';
const REMOVED = '#f43f5e';

/** True when the path itself says this is a test file. */
export function isTestPath(path) {
  return /(^|\/)(tests?|__tests__|spec)(\/|$)|\.(test|spec)\.[a-z]+$|(^|\/)test_[^/]+$/i.test(path);
}

export default function ChangedFiles({ diff, accent }) {
  if (!diff?.paths?.length) return null;

  const widest = Math.max(...diff.paths.map((file) => file.additions + file.deletions), 1);
  const truncated = diff.paths.length < diff.files;

  return (
    <div className="min-w-0">
      <p className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
        Changed files
        <span className="ml-2 normal-case tracking-normal text-slate-600">
          {diff.files} {diff.files === 1 ? 'file' : 'files'}
          {', '}
          <span style={{ color: ADDED }}>+{diff.additions}</span>{' '}
          <span style={{ color: REMOVED }}>−{diff.deletions}</span>
        </span>
      </p>

      <ul className="list-none m-0 p-0 space-y-1.5">
        {diff.paths.map((file) => {
          const total = file.additions + file.deletions;
          const width = total === 0 ? 0 : Math.max(6, (total / widest) * 100);
          const addShare = total === 0 ? 0 : (file.additions / total) * 100;
          const test = isTestPath(file.path);
          return (
            <li key={file.path} className="flex items-center gap-2.5 min-w-0">
              <span
                className="font-code text-[11px] truncate min-w-0 flex-1"
                style={{ color: test ? accent : '#94a3b8' }}
                title={file.path}
              >
                {file.path}
              </span>
              {test && (
                <span className="font-code text-[9px] uppercase tracking-wider text-slate-600 shrink-0">
                  test
                </span>
              )}
              <span className="font-code text-[10px] tabular-nums text-slate-500 shrink-0 w-[4.5rem] text-right">
                <span style={{ color: ADDED }}>+{file.additions}</span>{' '}
                <span style={{ color: REMOVED }}>−{file.deletions}</span>
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:flex h-1 w-16 shrink-0 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <span
                  className="h-full flex"
                  style={{ width: `${width}%` }}
                >
                  <span style={{ width: `${addShare}%`, background: ADDED }} />
                  <span style={{ width: `${100 - addShare}%`, background: REMOVED }} />
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      {truncated && (
        <p className="font-code text-[10px] text-slate-600 mt-2">
          {`// showing ${diff.paths.length} of ${diff.files} changed files`}
        </p>
      )}
    </div>
  );
}
