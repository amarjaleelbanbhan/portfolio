const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Supabase publishable keys are designed to be public. Database access is
// protected by Row Level Security; anonymous users can INSERT only.
const SUPABASE_URL = 'https://yokgnzxwrbymarjdfyhk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, website, company = '', problem, fax = '' } = req.body || {};

  // Honeypot for basic bot traffic. Real visitors never see or fill this field.
  if (String(fax).trim()) {
    return res.status(201).json({ ok: true });
  }

  if (!name?.trim() || !email?.trim() || !website?.trim() || !problem?.trim()) {
    return res.status(400).json({ error: 'Please complete the required fields.' });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  let normalizedWebsite;
  try {
    normalizedWebsite = new URL(website.trim());
    if (!['http:', 'https:'].includes(normalizedWebsite.protocol)) throw new Error('bad protocol');
  } catch {
    return res.status(400).json({ error: 'Please enter a valid website URL.' });
  }

  const cleanName = name.trim().slice(0, 120);
  const cleanEmail = email.trim().toLowerCase().slice(0, 254);
  const cleanCompany = company.trim().slice(0, 160) || null;
  const cleanProblem = problem.trim().slice(0, 5000);

  if (cleanProblem.length < 10) {
    return res.status(400).json({ error: 'Please add a little more detail about the problem.' });
  }

  const payload = {
    name: cleanName,
    email: cleanEmail,
    company: cleanCompany,
    website: normalizedWebsite.toString().slice(0, 500),
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
