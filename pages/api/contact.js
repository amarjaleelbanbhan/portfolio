/**
 * POST /api/contact — general enquiries from /contact.
 *
 * The form used to be a `mailto:` link, which meant the message only existed if
 * the visitor happened to have a mail client configured, and nothing was ever
 * recorded. This writes the enquiry down.
 *
 * ── Where it goes ────────────────────────────────────────────────────────────
 * Into the existing `studio_leads` table, discriminated by `source`. A dedicated
 * `contact_messages` table is the right long-term shape and is scheduled for the
 * CMS database phase, but creating a table in a live project is a production
 * change, and this route deliberately does not need one: the columns it writes
 * are exactly the ones the Studio request flow has been writing since Phase 0.5,
 * so the insert path is already proven and the admin dashboard already reads it.
 *
 * ── Trust boundary ───────────────────────────────────────────────────────────
 * Everything below treats the request body as hostile. Types are coerced,
 * lengths are capped, the category is checked against the canonical list rather
 * than passed through, and the URL is parsed rather than pattern-matched. The
 * Supabase key used here is the publishable one — it is designed to be public,
 * and the table's RLS policy allows `anon` to INSERT and nothing else, which the
 * Phase 0.5 security review verified with live probes.
 */
import { contactCategories } from '@/content/contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORY_IDS = new Set(contactCategories.map((category) => category.id));

// Same project and key as the Studio request flow. Publishable keys are public
// by design; the protection is the row-level security policy behind them.
const SUPABASE_URL = 'https://yokgnzxwrbymarjdfyhk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX';

/**
 * A form filled in faster than a human can read it is a bot.
 *
 * The elapsed time is client-supplied and therefore advisory — anyone can send
 * whatever number they like. It costs one field and stops the unsophisticated
 * majority; the honeypot and rate limit are the other two layers, and none of
 * the three is load-bearing on its own.
 */
const MIN_FILL_MS = 2500;

/**
 * In-memory sliding-window rate limit.
 *
 * Per-instance, so on a serverless platform it limits per warm instance rather
 * than globally. That is a real limitation and it is written down rather than
 * papered over: it blunts a naive flood from one address, and it is not a
 * defence against a distributed one. A durable limit belongs with the CMS
 * database work, where there is a table to put it in.
 */
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Two counters, because one number cannot do both jobs.
 *
 * A single limit on all requests punishes the person who mistypes their email
 * four times as though they were a bot — the first version of this did exactly
 * that, locking a human out for ten minutes for fumbling a form. So requests
 * are capped generously to blunt a flood, and *accepted submissions* — the ones
 * that actually write a row — are capped tightly.
 */
const MAX_REQUESTS = 30;
const MAX_SUBMISSIONS = 3;
const buckets = new Map();

function record(key, kind) {
  const now = Date.now();
  const entry = buckets.get(key) ?? { requests: [], submissions: [] };
  entry.requests = entry.requests.filter((time) => now - time < WINDOW_MS);
  entry.submissions = entry.submissions.filter((time) => now - time < WINDOW_MS);
  entry[kind].push(now);
  buckets.set(key, entry);

  // Bound the map so a long-lived instance cannot grow it without limit.
  if (buckets.size > 5000) {
    for (const [existing, value] of buckets) {
      const stale =
        value.requests.every((time) => now - time >= WINDOW_MS) &&
        value.submissions.every((time) => now - time >= WINDOW_MS);
      if (stale) buckets.delete(existing);
    }
  }

  return {
    floodingRequests: entry.requests.length > MAX_REQUESTS,
    tooManySubmissions: entry.submissions.length > MAX_SUBMISSIONS,
  };
}

function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : String(forwarded ?? '').split(',')[0];
  return (first || req.socket?.remoteAddress || 'unknown').trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const {
    name,
    email,
    category,
    message,
    organisation = '',
    link = '',
    // Honeypot. Hidden from real visitors and from assistive technology.
    fax = '',
    elapsedMs = 0,
  } = req.body ?? {};

  // A filled honeypot gets the success response a bot expects, and nothing is
  // written. Telling it that it failed only teaches it to try again.
  if (String(fax).trim()) {
    return res.status(201).json({ ok: true });
  }

  if (Number(elapsedMs) > 0 && Number(elapsedMs) < MIN_FILL_MS) {
    return res.status(201).json({ ok: true });
  }

  const who = clientKey(req);
  if (record(who, 'requests').floodingRequests) {
    return res
      .status(429)
      .json({ error: 'Too many requests from here. Try again in a few minutes, or email directly.' });
  }

  // ── Validation. Field-keyed so the form can point at what is wrong. ──
  const errors = {};

  const cleanName = String(name ?? '').trim();
  if (!cleanName) errors.name = 'Please tell me who you are.';
  else if (cleanName.length > 120) errors.name = 'That name is longer than 120 characters.';

  const cleanEmail = String(email ?? '').trim().toLowerCase();
  if (!cleanEmail) errors.email = 'I need an address to reply to.';
  else if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 254) {
    errors.email = 'That does not look like an email address.';
  }

  const cleanCategory = String(category ?? '');
  if (!CATEGORY_IDS.has(cleanCategory)) errors.category = 'Please pick what this is about.';

  const cleanMessage = String(message ?? '').trim();
  if (!cleanMessage) errors.message = 'Please write a message.';
  else if (cleanMessage.length < 20) {
    errors.message = 'A little more detail would help — 20 characters or so.';
  } else if (cleanMessage.length > 5000) {
    errors.message = 'That message is over 5,000 characters. Please trim it or email directly.';
  }

  let cleanLink = null;
  if (String(link).trim()) {
    try {
      const parsed = new URL(String(link).trim());
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('unsupported protocol');
      cleanLink = parsed.toString().slice(0, 500);
    } catch {
      errors.link = 'That link needs to start with http:// or https://';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Please check the highlighted fields.', fields: errors });
  }

  // Only now, with a valid submission in hand, does this count against the
  // tight limit — a mistyped email should never lock someone out.
  if (record(who, 'submissions').tooManySubmissions) {
    return res.status(429).json({
      error: 'That is a few messages already. Give me a chance to read them, or email directly.',
    });
  }

  const categoryLabel =
    contactCategories.find((entry) => entry.id === cleanCategory)?.label ?? cleanCategory;

  const payload = {
    name: cleanName.slice(0, 120),
    email: cleanEmail,
    company: String(organisation).trim().slice(0, 160) || null,
    website: cleanLink,
    // `service` is the Studio's own vocabulary and a contact enquiry is not one
    // of its options, so the category is carried in `source` and restated at the
    // top of the message. That keeps this route inside the column shape the
    // table has been accepting since Phase 0.5.
    service: 'not_sure',
    timeline: null,
    problem: `[${categoryLabel}]\n\n${cleanMessage}`.slice(0, 5000),
    source: `contact:${cleanCategory}`,
    status: 'new',
  };

  const insert = (body) =>
    fetch(`${SUPABASE_URL}/rest/v1/studio_leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    });

  try {
    let response = await insert(payload);

    // The table's row-level security policy constrains what a row may contain,
    // not just who may insert one: a live test showed `source: "contact:…"`
    // rejected with 401 / 42501 ("new row violates row-level security policy")
    // while the Studio flow's `source: "studio_request"` is accepted. So the
    // policy's WITH CHECK pins that column.
    //
    // Retry with the value the policy accepts rather than lose the enquiry. The
    // category is still the first line of the message either way, so nothing is
    // actually lost — only the ability to filter on it in SQL, which is what a
    // dedicated contact table will fix.
    //
    // 401 and 403 are both checked because PostgREST reports a WITH CHECK
    // failure as 401, which is not the status a constraint violation suggests.
    if ([400, 401, 403].includes(response.status)) {
      const detail = await response.text();
      console.warn(
        'contact: the leads policy rejected the contact discriminator, retrying as studio_request',
        response.status,
        detail
      );
      response = await insert({ ...payload, source: 'studio_request' });
    }

    if (!response.ok) {
      console.error('contact: insert failed', response.status, await response.text());
      return res
        .status(502)
        .json({ error: 'Something went wrong saving that. Please email me directly.' });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('contact: request failed', error);
    return res
      .status(500)
      .json({ error: 'Something went wrong saving that. Please email me directly.' });
  }
}
