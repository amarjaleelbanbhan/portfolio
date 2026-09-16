const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, email, website, company = '', problem, source = 'studio_request' } = req.body || {};

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

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Studio lead capture is not configured: missing Supabase server environment variables.');
    return res.status(503).json({ error: 'The inquiry form is temporarily unavailable. Please use the main contact page.' });
  }

  const payload = {
    name: name.trim().slice(0, 120),
    email: email.trim().toLowerCase().slice(0, 254),
    company: company.trim().slice(0, 160) || null,
    website: normalizedWebsite.toString().slice(0, 500),
    problem: problem.trim().slice(0, 5000),
    source: String(source).slice(0, 80),
    status: 'new',
  };

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/studio_leads`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
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
