/**
 * /admin/media — the media library.
 *
 * The screen is built around the one thing that is easy to get wrong: **a file
 * in the public bucket is reachable by URL regardless of what its database row
 * says.** So the bucket is the first choice on upload, not an afterthought, the
 * private default is explained, and "make public" is a separate, deliberate
 * copy rather than a checkbox.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';
import { createCms } from '@/lib/cms/client';
import {
  BUCKET_MIME,
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  createMedia,
  publicUrl,
  rejectUpload,
} from '@/lib/cms/media';

function Library({ session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);
  const media = useMemo(() => createMedia(cms, () => session?.access_token), [cms, session]);

  const [items, setItems] = useState(null);
  const [bucket, setBucket] = useState(PRIVATE_BUCKET);
  const [folder, setFolder] = useState('uploads');
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [previews, setPreviews] = useState({});

  const load = useCallback(async () => {
    setError('');
    try {
      setItems(await media.list());
    } catch (err) {
      setError(err.message);
      setItems([]);
    }
  }, [media]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) load();
    });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const refusal = file ? rejectUpload(file, bucket) : null;

  async function submit(event) {
    event.preventDefault();
    if (!file || refusal) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      await media.upload({ file, bucket, folder, altText, caption });
      setFile(null);
      setAltText('');
      setCaption('');
      event.target.reset();
      setMessage('Uploaded.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function preview(item) {
    if (item.storage_bucket === PUBLIC_BUCKET) {
      setPreviews((current) => ({ ...current, [item.id]: publicUrl(item.storage_bucket, item.storage_path) }));
      return;
    }
    try {
      const url = await media.signedUrl(item);
      setPreviews((current) => ({ ...current, [item.id]: url }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function act(run) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await run();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {error && (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ── Upload ── */}
      <section aria-labelledby="upload-heading" className="rounded-xl border border-white/8 p-5">
        <h2 id="upload-heading" className="text-sm font-semibold text-slate-200 m-0">
          Upload
        </h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed m-0 max-w-2xl">
          A file in the public bucket is fetchable by URL whether or not its record is published, so
          the default is private. Move something to public only when it is genuinely cleared for it.
        </p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <fieldset className="m-0 p-0 border-0">
            <legend className="mb-2 block text-sm font-medium text-slate-300 p-0">Bucket</legend>
            <div className="flex flex-wrap gap-2">
              {[
                { id: PRIVATE_BUCKET, label: 'Private', hint: 'Drafts, client material, anything restricted.' },
                { id: PUBLIC_BUCKET, label: 'Public', hint: 'Cleared assets only. Permanently fetchable.' },
              ].map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-[44px] flex-1 min-w-[200px] cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5"
                  style={{
                    borderColor: bucket === option.id ? 'rgba(20,184,166,0.6)' : 'rgba(255,255,255,0.10)',
                    background: bucket === option.id ? 'rgba(20,184,166,0.08)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="bucket"
                    value={option.id}
                    checked={bucket === option.id}
                    onChange={() => setBucket(option.id)}
                    className="mt-1 accent-teal-400"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-slate-200">{option.label}</span>
                    <span className="block text-[11px] leading-snug text-slate-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="media-file" className="mb-1.5 block text-sm font-medium text-slate-300">
                File
              </label>
              <input
                id="media-file"
                type="file"
                accept={BUCKET_MIME[bucket].join(',')}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                aria-describedby="media-file-help"
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:text-slate-200"
              />
              <p id="media-file-help" className="mt-1.5 text-xs text-slate-500 m-0">
                Up to 10 MB. {BUCKET_MIME[bucket].join(', ')}.
              </p>
              {refusal && <p className="mt-1.5 text-xs text-red-400 m-0">{refusal}</p>}
            </div>

            <div>
              <label htmlFor="media-folder" className="mb-1.5 block text-sm font-medium text-slate-300">
                Folder
              </label>
              <input
                id="media-folder"
                type="text"
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-400/60"
              />
            </div>

            <div>
              <label htmlFor="media-alt" className="mb-1.5 block text-sm font-medium text-slate-300">
                Alt text
              </label>
              <input
                id="media-alt"
                type="text"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                aria-describedby="media-alt-help"
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-400/60"
              />
              <p id="media-alt-help" className="mt-1.5 text-xs text-slate-500 m-0">
                What the image conveys. Leave empty only if it is purely decorative.
              </p>
            </div>

            <div>
              <label htmlFor="media-caption" className="mb-1.5 block text-sm font-medium text-slate-300">
                Caption
              </label>
              <input
                id="media-caption"
                type="text"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                className="w-full rounded-lg border border-white/12 bg-white/5 min-h-[44px] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-400/60"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy || !file || Boolean(refusal)}
              className="rounded-lg bg-teal-400 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300 disabled:opacity-50"
            >
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            <div role="status" aria-live="polite">
              {message && <p className="text-sm text-slate-400 m-0">{message}</p>}
            </div>
          </div>
        </form>
      </section>

      {/* ── Library ── */}
      <section aria-labelledby="library-heading">
        <h2 id="library-heading" className="text-sm font-semibold text-slate-200 m-0 mb-3">
          Library {items ? `· ${items.length}` : ''}
        </h2>

        {items?.length === 0 && (
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-slate-300 m-0">Nothing uploaded yet.</p>
          </div>
        )}

        <ul className="list-none m-0 p-0 space-y-2">
          {(items ?? []).map((item) => {
            const isPublicBucket = item.storage_bucket === PUBLIC_BUCKET;
            return (
              <li key={item.id} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-code text-xs text-slate-200 m-0">{item.storage_path}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 font-code text-[10px] uppercase tracking-wider m-0">
                      <span style={{ color: isPublicBucket ? '#f59e0b' : '#64748b' }}>
                        {isPublicBucket ? 'public bucket' : 'private bucket'}
                      </span>
                      <span className="text-slate-600">{item.media_type}</span>
                      <span style={{ color: item.is_published ? '#22c55e' : '#64748b' }}>
                        {item.is_published ? 'published' : 'draft'}
                      </span>
                      {item.metadata?.restricted && <span className="text-amber-300">restricted</span>}
                    </p>
                    {!item.alt_text && item.media_type === 'image' && (
                      <p className="mt-1 text-xs text-amber-300 m-0">No alt text.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => preview(item)}
                      className="rounded-lg border border-white/12 px-3 min-h-[40px] text-xs text-slate-300 transition-colors hover:border-white/25"
                    >
                      Preview
                    </button>
                    {!isPublicBucket && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          window.confirm(
                            'Copy this file into the public bucket? It will then be fetchable by anyone with the URL, permanently, regardless of publish state.'
                          ) && act(() => media.makePublic(item))
                        }
                        className="rounded-lg border border-amber-400/40 px-3 min-h-[40px] text-xs text-amber-200 transition-colors hover:bg-amber-400/10 disabled:opacity-50"
                      >
                        Make public
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => act(() => media.setPublished(item, !item.is_published))}
                      className="rounded-lg border border-white/12 px-3 min-h-[40px] text-xs text-slate-300 transition-colors hover:border-white/25 disabled:opacity-50"
                    >
                      {item.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const also = window.confirm(
                          'Delete the stored file as well?\n\nOK = delete the file and the record.\nCancel = remove the record only, leaving the file reachable by URL.'
                        );
                        act(() => media.remove(item, { deleteObject: also }));
                      }}
                      className="rounded-lg px-3 min-h-[40px] text-xs text-slate-500 transition-colors hover:text-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {previews[item.id] && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-white/8 bg-black/30 p-2">
                    {item.media_type === 'video' ? (
                      <video src={previews[item.id]} controls className="max-h-64 w-full" />
                    ) : item.media_type === 'document' ? (
                      <a
                        href={previews[item.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-code text-xs text-teal-300"
                      >
                        Open document ↗
                      </a>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[item.id]}
                        alt={item.alt_text || ''}
                        className="max-h-64 w-auto"
                      />
                    )}
                    {!isPublicBucket && (
                      <p className="mt-2 font-code text-[10px] text-slate-600 m-0">
                        {'// signed link, expires in five minutes'}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default function AdminMedia() {
  return (
    <AdminShell title="Media" description="The media library, across the public and private buckets">
      {({ session, setSession }) => <Library session={session} setSession={setSession} />}
    </AdminShell>
  );
}
