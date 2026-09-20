/**
 * Media: storage plus the database record that describes it.
 *
 * ── The thing that makes media different ─────────────────────────────────────
 * Every other CMS record is invisible until it is published. Media is not.
 * A file in `portfolio-public` is served by URL **whether or not** its database
 * row says published, because the bucket is public and object storage does not
 * consult a table. So unpublishing a media record hides it from the site and
 * does nothing at all to the file.
 *
 * That is not a bug to work around, it is a fact to design around, and the
 * rules below follow from it:
 *
 * - Anything draft, restricted, client-owned or not yet cleared goes in
 *   `portfolio-private`. That bucket is not public, and access needs a signed
 *   URL with an expiry.
 * - Moving a file from private to public is an explicit, deliberate copy, never
 *   a side effect of ticking "published".
 * - Deleting a record offers to delete the object too, because a row removed
 *   while its file stays reachable is the worst of both.
 *
 * ── SVG ──────────────────────────────────────────────────────────────────────
 * SVG is script-capable. A sanitiser is not implemented here, so **SVG cannot
 * be uploaded to the public bucket at all**. Refusing is honest; accepting it
 * and hoping would be the kind of thing that only shows up once.
 *
 * ── Validation ───────────────────────────────────────────────────────────────
 * The checks below are the fast, helpful ones. The real enforcement is the
 * bucket's own MIME allowlist and 10 MiB limit, which Supabase applies
 * server-side and which a browser cannot talk its way past.
 */
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, supabaseFetch } from '@/lib/supabase';

export const PUBLIC_BUCKET = 'portfolio-public';
export const PRIVATE_BUCKET = 'portfolio-private';

/** Mirrors each bucket's configured allowlist. */
export const BUCKET_MIME = {
  [PUBLIC_BUCKET]: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4'],
  [PRIVATE_BUCKET]: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'video/mp4',
    'application/pdf',
  ],
};

export const MAX_BYTES = 10 * 1024 * 1024;

const MIME_TO_MEDIA_TYPE = {
  'application/pdf': 'document',
  'video/mp4': 'video',
  'image/svg+xml': 'diagram',
};

export const mediaTypeFor = (mime) => MIME_TO_MEDIA_TYPE[mime] ?? 'image';

/** A storage path that cannot escape its folder or collide by accident. */
export function safePath(folder, filename) {
  const cleanFolder = String(folder || 'uploads')
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, '-')
    .replace(/\.{2,}/g, '')
    .replace(/^\/+|\/+$/g, '');

  const dot = filename.lastIndexOf('.');
  const stem = (dot > 0 ? filename.slice(0, dot) : filename)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  const extension = (dot > 0 ? filename.slice(dot + 1) : '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // A short random suffix, so uploading two files called `screenshot.png`
  // from different folders does not silently overwrite one with the other.
  const unique = Math.random().toString(36).slice(2, 8);
  return `${cleanFolder}/${stem || 'file'}-${unique}${extension ? `.${extension}` : ''}`;
}

/**
 * Why a file cannot be uploaded to this bucket, or null.
 */
export function rejectUpload(file, bucket) {
  if (!file) return 'Choose a file first.';
  if (file.size > MAX_BYTES) {
    return `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB.`;
  }
  const allowed = BUCKET_MIME[bucket] ?? [];
  if (!allowed.includes(file.type)) {
    return `${file.type || 'That file type'} is not accepted by this bucket. Allowed: ${allowed.join(', ')}.`;
  }
  if (bucket === PUBLIC_BUCKET && file.type === 'image/svg+xml') {
    return 'SVG can carry scripts, and there is no sanitiser here yet. Upload it to the private bucket, or export a PNG.';
  }
  return null;
}

export const publicUrl = (bucket, path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURI(path)}`;

export function createMedia(cms, getToken) {
  async function storage(path, init = {}) {
    const response = await supabaseFetch(`${SUPABASE_URL}/storage/v1/${path}`, {
      ...init,
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${getToken()}`,
        ...(init.headers ?? {}),
      },
    });
    if (!response.ok) {
      let detail = '';
      try {
        detail = (await response.json())?.message ?? '';
      } catch {
        /* storage errors are not always JSON */
      }
      throw new Error(detail || `Storage refused that (${response.status}).`);
    }
    return response;
  }

  return {
    async list() {
      return cms.list('portfolio_media', {
        select: 'id,storage_bucket,storage_path,media_type,alt_text,caption,metadata,is_published,created_at',
        order: 'created_at.desc',
        limit: '500',
      });
    },

    /**
     * Upload, then record it.
     *
     * Storage first: a row pointing at a file that failed to upload is a broken
     * reference, whereas a file with no row is merely an orphan the library can
     * clean up.
     */
    async upload({ file, bucket, folder, altText, caption }) {
      const refusal = rejectUpload(file, bucket);
      if (refusal) throw new Error(refusal);

      const path = safePath(folder, file.name);
      await storage(`object/${bucket}/${encodeURI(path)}`, {
        method: 'POST',
        headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
        body: file,
      });

      return cms.create(
        'portfolio_media',
        {
          storage_bucket: bucket,
          storage_path: path,
          media_type: mediaTypeFor(file.type),
          alt_text: String(altText ?? '').slice(0, 500),
          caption: String(caption ?? '').slice(0, 500),
          metadata: {
            bytes: file.size,
            mimeType: file.type,
            // Anything in the private bucket is restricted until somebody says
            // otherwise, not the other way round.
            restricted: bucket === PRIVATE_BUCKET,
          },
        },
        { entityLabel: path }
      );
    },

    /** A time-limited URL for a private object. */
    async signedUrl(item, seconds = 300) {
      const response = await storage(`object/sign/${item.storage_bucket}/${encodeURI(item.storage_path)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresIn: seconds }),
      });
      const { signedURL, signedUrl } = await response.json();
      return `${SUPABASE_URL}/storage/v1${signedURL ?? signedUrl}`;
    },

    async updateRecord(item, patch) {
      return cms.update('portfolio_media', { id: `eq.${item.id}` }, patch, { entityLabel: item.storage_path });
    },

    /**
     * Publish a media record.
     *
     * `portfolio_media` has no `published_at` — its public read rule is just
     * `is_published`. Worth stating because it is the one publishable table
     * that does not follow the two-column rule, and assuming otherwise would
     * write a column that does not exist.
     */
    async setPublished(item, published) {
      if (published && item.storage_bucket === PRIVATE_BUCKET) {
        throw new Error(
          'That file is in the private bucket. Publishing the record would advertise an object the public cannot fetch — copy it to the public bucket first.'
        );
      }
      return cms.update('portfolio_media', { id: `eq.${item.id}` }, { is_published: published }, {
        entityLabel: item.storage_path,
      });
    },

    /**
     * Copy a private file into the public bucket.
     *
     * Deliberately a copy and a new record rather than a flag: making something
     * public is a decision, and it should leave a trace that it was made.
     */
    async makePublic(item) {
      if (item.storage_bucket === PUBLIC_BUCKET) throw new Error('That is already in the public bucket.');
      if (item.metadata?.mimeType === 'image/svg+xml') {
        throw new Error('SVG is not allowed in the public bucket while there is no sanitiser.');
      }

      await storage('object/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketId: item.storage_bucket,
          sourceKey: item.storage_path,
          destinationBucket: PUBLIC_BUCKET,
          destinationKey: item.storage_path,
        }),
      });

      return cms.create(
        'portfolio_media',
        {
          storage_bucket: PUBLIC_BUCKET,
          storage_path: item.storage_path,
          media_type: item.media_type,
          alt_text: item.alt_text,
          caption: item.caption,
          metadata: { ...(item.metadata ?? {}), restricted: false, copiedFrom: PRIVATE_BUCKET },
        },
        { entityLabel: item.storage_path }
      );
    },

    /**
     * Remove the record, and optionally the object.
     *
     * Offered together because deleting only the row leaves a public URL that
     * still works — which is exactly the situation somebody would be deleting
     * it to avoid.
     */
    async remove(item, { deleteObject }) {
      if (deleteObject) {
        await storage(`object/${item.storage_bucket}/${encodeURI(item.storage_path)}`, { method: 'DELETE' });
      }
      await cms.remove('portfolio_media', { id: `eq.${item.id}` }, { entityLabel: item.storage_path });
      await cms.audit('delete-media', 'portfolio_media', item.id, {
        path: item.storage_path,
        bucket: item.storage_bucket,
        objectDeleted: Boolean(deleteObject),
      });
    },
  };
}
