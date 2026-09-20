/**
 * GET /api/site-config — the public projection of `site_settings`.
 *
 * The table has no anonymous read policy and must not get one: it holds
 * presentation settings and operational ones in the same place, and a blanket
 * policy would publish both, plus everything anybody adds later.
 *
 * So this route exists instead. It reads with the publishable key — which means
 * it can only see what `anon` can see, which is nothing — and therefore needs a
 * secret key to work at all. That is deliberate: the route is written so that
 * **without a secret key configured it returns an empty projection rather than
 * failing**, and the site falls back to its compiled defaults. Adding the key
 * is the step that turns this on, and doing so is a conscious decision made in
 * the hosting dashboard, not something a deploy does by accident.
 *
 * Whatever it reads, only keys on `PUBLIC_SETTING_KEYS` are ever returned. A
 * new setting is private until somebody adds it to that list on purpose.
 */
import { PUBLIC_SETTING_KEYS } from '@/lib/cms/contracts';
import { SUPABASE_URL } from '@/lib/supabase';

// Cached briefly at the edge: settings change rarely, and every public page
// would otherwise pay for a round trip.
const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=3600';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Read at request time and never at module scope, so the value cannot be
  // captured into a bundle. This is the one place a secret key belongs, and it
  // never leaves this function.
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!secret) {
    res.setHeader('Cache-Control', CACHE_CONTROL);
    return res.status(200).json({
      settings: {},
      source: 'unconfigured',
      note: 'SUPABASE_SECRET_KEY is not set, so settings are not read. Pages use their compiled defaults.',
    });
  }

  try {
    const query = new URLSearchParams({
      select: 'setting_key,setting_value',
      setting_key: `in.(${PUBLIC_SETTING_KEYS.join(',')})`,
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?${query}`, {
      headers: { apikey: secret, Authorization: `Bearer ${secret}` },
    });

    if (!response.ok) {
      // Never surface the upstream body: it can carry schema detail that has no
      // business on a public endpoint.
      console.error('site-config: read failed', response.status);
      return res.status(200).json({ settings: {}, source: 'error' });
    }

    const rows = await response.json();
    const settings = {};
    for (const row of rows) {
      // Belt and braces: the filter above already restricts the query, and this
      // guarantees it even if that filter is ever edited carelessly.
      if (PUBLIC_SETTING_KEYS.includes(row.setting_key)) {
        settings[row.setting_key] = row.setting_value;
      }
    }

    res.setHeader('Cache-Control', CACHE_CONTROL);
    return res.status(200).json({ settings, source: 'database' });
  } catch (error) {
    console.error('site-config: request failed', error.message);
    return res.status(200).json({ settings: {}, source: 'error' });
  }
}
