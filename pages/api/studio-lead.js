const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICE_OPTIONS = new Set([
  'website_fix',
  'new_website',
  'web_app',
  'chatbot',
  'automation',
  'not_sure',
]);

const TIMELINE_OPTIONS = new Set(['asap', '1_2_weeks', 'this_month', 'flexible']);

// Supabase publishable keys are designed to be public. Database access is
// protected by Row Level Security; anonymous users can INSERT only.
const SUPABASE_URL = 'https://yokgnzxwrbymarjdfyhk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const {
    name,
    email,
    website = '',
    company = '',
    service = 'not_sure',
    timeline = '',
    problem,
    fax = '',
  } = req.body || {};

  // Honeypot for basic bot traffic. Real visitors never see or fill this field.
  if (String(fax).trim()) {
    return res.status(201).json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !problem?.trim()) {
    return res.status(400).json({ error: 'Please complete the required fields.' });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const cleanService = SERVICE_OPTIONS.has(service) ? service : 'not_sure';
  const cleanTimeline = TIMELINE_OPTIONS.has(timeline) ? timeline : null;

  let normalizedWebsite = null;
  if (String(website).trim()) {
    try {
      normalizedWebsite = new URL(String(website).trim());
      if (!['http:', 'https:'].includes(normalizedWebsite.protocol)) throw new Error('bad protocol');
    } catch {
      return res.status(400).json({ error: 'Please enter a valid website or reference URL.' });
    }
  }

  const cleanName = name.trim().slice(0, 120);
  const cleanEmail = email.trim().toLowerCase().slice(0, 254);
  const cleanCompany = String(company).trim().slice(0, 160) || null;
  const cleanProblem = problem.trim().slice(0, 5000);

  if (cleanProblem.length < 10) {
    return res.status(400).json({ error: 'Please add a little more detail about the project.' });
  }

  const payload = {
    name: cleanName,
    email: cleanEmail,
    company: cleanCompany,
    website: normalizedWebsite ? normalizedWebsite.toString().slice(0, 500) : null,
    service: cleanService,
    timeline: cleanTimeline,
    problem: cleanProblem,
    source: 'studio_request',
    status: 'new',
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/studio_leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Supabase lead insert failed:', response.status, detail);
      return res.status(502).json({ error: 'Could not save the inquiry. Please try again.' });
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Studio lead capture failed:', error);
    return res.status(500).json({ error: 'Could not save the inquiry. Please try again.' });
  }
}
