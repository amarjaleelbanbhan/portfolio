/**
 * POST /api/contact — general enquiries from /contact.
 *
 * The form used to be a `mailto:` link, which meant the message only existed if
 * the visitor happened to have a mail client configured, and nothing was ever
 * recorded. This writes the enquiry down.
 *
 * ── Where it goes ────────────────────────────────────────────────────────────
 * Into `studio_leads`, through the one anonymous INSERT policy that exists. That
 * policy's WITH CHECK pins `status` to `'new'` and `source` to
 * `'studio_request'` and validates the intake columns, so a contact enquiry has
 * to arrive in exactly that shape — confirmed by a live test, which rejected
 * `source: 'contact:<category>'` with `401 / 42501`.
 *
 * ── Trust boundary ───────────────────────────────────────────────────────────
 * Everything below treats the request body as hostile. Types are coerced,
 * lengths are capped, the category is checked against the canonical list rather
 * than passed through, and the URL is parsed rather than pattern-matched.
 *
 * The payload is built field by field and the body is **never spread in**. The
 * anonymous INSERT grant is table-wide, so the CRM columns added later —
 * `priority`, `estimated_value_usd`, `internal_tags`, `next_follow_up_at` — are
 * not independently constrained by the intake policy. An allowlist is the only
 * thing standing between a stranger and filing themselves as an urgent lead.
 *
 * The key here is the *publishable* one, which is designed to be public and
 * authorises nothing on its own. A secret key must never appear in this file.
 */
import { contactCategories } from '@/content/contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CATEGORY_IDS = new Set(contactCategories.map((category) => category.id));

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

  /**
   * An explicit allowlist, built field by field on the server.
   *
   * This is the only object that reaches the database, and every value in it is
   * either validated above or a constant. The request body is never spread in.
   * That matters more than it looks: the anonymous INSERT grant on
   * `studio_leads` is table-wide, so the newer CRM columns — `priority`,
   * `estimated_value_usd`, `internal_tags`, `next_follow_up_at` — are not
   * independently constrained by the intake policy. A spread would let a
   * stranger file themselves as an urgent $50,000 lead.
   *
   * `status` and `source` are fixed because the intake policy's WITH CHECK
   * requires exactly `'new'` and `'studio_request'`. A live test in Phase 19
   * confirmed that: `source: 'contact:<category>'` was rejected with
   * `401 / 42501, new row violates row-level security policy`. The category is
   * therefore carried as the first line of the message, where a human reading
   * the enquiry sees it immediately.
   *
   * The cost is that contact enquiries cannot be told apart from Studio
   * requests in SQL. `supabase/schema-reference.sql` carries the narrow policy
   * change that would fix it properly.
   */
  const payload = {
    name: cleanName.slice(0, 120),
    email: cleanEmail,
    company: String(organisation).trim().slice(0, 160) || null,
    website: cleanLink,
    // Not one of the Studio's service options, and the intake policy validates
    // this column, so the honest neutral value is the only correct one.
    service: 'not_sure',
    timeline: null,
    problem: `[Contact form — ${categoryLabel}]\n\n${cleanMessage}`.slice(0, 5000),
    source: 'studio_request',
    status: 'new',
  };

  const insert = (body) =>
    fetch(restUrl('studio_leads'), {
      method: 'POST',
      headers: anonHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(body),
    });

  try {
    const response = await insert(payload);

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
