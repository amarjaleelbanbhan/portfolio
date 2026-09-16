import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SUPABASE_URL = 'https://yokgnzxwrbymarjdfyhk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h1nOLJv7TuuOqbWkKbiMnQ_LkM8VdcX';
const SESSION_KEY = 'ads-admin-session';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'won', 'closed'];

export default function StudioAdmin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('idle');
  const [authMessage, setAuthMessage] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const accessToken = hash.get('access_token');
      if (accessToken) {
        const expiresIn = Number(hash.get('expires_in') || 3600);
        const hashSession = {
          access_token: accessToken,
          refresh_token: hash.get('refresh_token') || '',
          expires_at: Math.floor(Date.now() / 1000) + expiresIn,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(hashSession));
        setSession(hashSession);
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        return;
      }

      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      if (!stored?.access_token || !stored?.expires_at || stored.expires_at * 1000 <= Date.now()) {
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      setSession(stored);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    if (session?.access_token) loadLeads(session.access_token);
  }, [session?.access_token]);

  const filteredLeads = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatch = filter === 'all' || lead.status === filter;
      if (!statusMatch) return false;
      if (!needle) return true;
      return [lead.name, lead.email, lead.company, lead.website, lead.problem]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [leads, filter, search]);

  async function authenticate(event) {
    event.preventDefault();
    setAuthStatus('submitting');
    setAuthMessage('');

    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.msg || data?.error_description || data?.message || 'Authentication failed.');
      }

      if (!data?.access_token) {
        throw new Error('No login session was returned.');
      }

      const nextSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
        user: data.user,
      };

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setPassword('');
      setAuthStatus('success');
    } catch (err) {
      setAuthStatus('error');
      setAuthMessage(err.message || 'Authentication failed.');
    }
  }

  async function loadLeads(token) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        select: 'id,created_at,name,email,company,website,problem,source,status,notified_at',
        order: 'created_at.desc',
      });
      const response = await fetch(`${SUPABASE_URL}/rest/v1/studio_leads?${params.toString()}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error('Your session expired. Sign in again.');
      }
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Could not load leads.');
      }
      setLeads(await response.json());
    } catch (err) {
      setError(err.message || 'Could not load leads.');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(leadId, status) {
    if (!session?.access_token) return;
    const previous = leads;
    setLeads((current) => current.map((lead) => lead.id === leadId ? { ...lead, status } : lead));

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/studio_leads?id=eq.${encodeURIComponent(leadId)}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Could not update lead status.');
    } catch (err) {
      setLeads(previous);
      setError(err.message || 'Could not update lead status.');
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setLeads([]);
    setEmail('');
    setPassword('');
  }

  return (
    <>
      <Head>
        <title>Studio Admin · Amar Digital Systems</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="description" content="Private lead dashboard for Amar Digital Systems." />
      </Head>

      <main className="min-h-screen bg-[#07111f] text-white px-5 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Private workspace</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Studio leads</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/studio" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/25 hover:text-white">
                Studio
              </Link>
              {session && (
                <button onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-300/30 hover:text-rose-200">
                  Sign out
                </button>
              )}
            </div>
          </div>

          {!session ? (
            <section className="mx-auto mt-14 max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
              <p className="text-sm text-slate-400">Authorized owner access only</p>
              <h2 className="mt-2 text-2xl font-bold">Sign in to view leads</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Registration is not available from this page. Lead data is protected by Supabase authentication and Row Level Security, and only the authorized owner account can read or update it.
              </p>

              <form onSubmit={authenticate} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0a1627] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#0a1627] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={authStatus === 'submitting'}
                  className="w-full rounded-full bg-teal-300 px-5 py-3.5 font-bold text-[#05211d] transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {authStatus === 'submitting' ? 'Please wait…' : 'Sign in'}
                </button>
              </form>

              {authMessage && (
                <p className={`mt-4 text-sm ${authStatus === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>{authMessage}</p>
              )}
            </section>
          ) : (
            <section className="mt-8">
              <div className="grid gap-4 md:grid-cols-4">
                <Metric label="Total leads" value={leads.length} />
                <Metric label="New" value={leads.filter((lead) => lead.status === 'new').length} />
                <Metric label="Qualified" value={leads.filter((lead) => lead.status === 'qualified').length} />
                <Metric label="Won" value={leads.filter((lead) => lead.status === 'won').length} />
              </div>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {['all', ...STATUS_OPTIONS].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`rounded-full px-3.5 py-2 text-xs font-semibold capitalize transition ${filter === status ? 'bg-teal-300 text-[#05211d]' : 'border border-white/10 text-slate-300 hover:border-white/25'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search leads…"
                    className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#0a1627] px-4 py-2 text-sm text-white outline-none focus:border-teal-300/50 md:w-64"
                  />
                  <button
                    onClick={() => loadLeads(session.access_token)}
                    disabled={loading}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-white/25 hover:text-white disabled:opacity-50"
                  >
                    {loading ? 'Refreshing…' : 'Refresh'}
                  </button>
                </div>
              </div>

              {error && <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

              <div className="mt-5 space-y-4">
                {!loading && filteredLeads.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-slate-400">
                    No leads match this view yet.
                  </div>
                )}

                {filteredLeads.map((lead) => (
                  <article key={lead.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold">{lead.name}</h2>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs capitalize text-slate-300">{lead.status || 'new'}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                          <a className="hover:text-teal-300" href={`mailto:${lead.email}`}>{lead.email}</a>
                          {lead.company && <span>{lead.company}</span>}
                          <span>{formatDate(lead.created_at)}</span>
                        </div>

                        <a
                          href={safeWebsite(lead.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex max-w-full items-center gap-2 break-all text-sm font-medium text-teal-300 hover:text-teal-200"
                        >
                          {lead.website} ↗
                        </a>

                        <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-200">{lead.problem}</p>
                      </div>

                      <div className="w-full lg:w-52">
                        <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Lead status</label>
                        <select
                          value={lead.status || 'new'}
                          onChange={(event) => updateStatus(lead.id, event.target.value)}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1627] px-3 py-2.5 text-sm text-white outline-none focus:border-teal-300/50"
                        >
                          {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent('Re: your Amar Digital Systems inquiry')}`}
                          className="mt-3 block w-full rounded-xl bg-teal-300 px-3 py-2.5 text-center text-sm font-bold text-[#05211d] hover:bg-teal-200"
                        >
                          Reply by email
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

function safeWebsite(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '#';
  } catch {
    return '#';
  }
}
