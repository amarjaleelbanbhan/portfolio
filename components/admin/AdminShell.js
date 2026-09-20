/**
 * The control centre frame: authentication gate, sidebar, and the surface every
 * admin page renders into.
 *
 * ── Authorisation, in two steps ──────────────────────────────────────────────
 * Signing in proves who someone is. It does not make them an admin. So after a
 * session is established this checks `portfolio_admins`, and a signed-in
 * non-admin is told plainly that the account is not authorised rather than
 * being dropped into an interface where every panel is mysteriously empty.
 *
 * That check is a convenience, not the boundary. **Row-level security is the
 * boundary.** Anyone can edit client state; nobody can talk their way past a
 * policy. This exists so the interface tells the truth, not so it protects
 * anything.
 *
 * ── No portfolio chrome ──────────────────────────────────────────────────────
 * `lib/routeChrome.js` classifies `/admin` as `admin`, so there is no boot
 * sequence, no particle field and no scanline overlay here. A control centre
 * that plays a cinematic on load is a control centre nobody wants to use twice.
 * Every page is `noindex`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CommandPalette from '@/components/admin/CommandPalette';
import { findSection, sectionsByGroup } from '@/lib/admin/navigation';
import {
  checkAdminMembership,
  restoreSession,
  signIn,
  signOut,
} from '@/lib/admin/session';

/** `idle` → `checking` → `ready` | `unauthorised` | `unreachable` */
function useAdminAuth() {
  const [session, setSession] = useState(null);
  const [state, setState] = useState('checking');
  const [message, setMessage] = useState('');

  const verify = useCallback(async (candidate) => {
    if (!candidate?.access_token) {
      setState('idle');
      return;
    }
    // Deliberately no synchronous state change here: this runs from a mount
    // effect, and the caller has already put the UI into its checking state.
    const { authorised, reachable } = await checkAdminMembership(candidate.access_token);

    if (!reachable) {
      // A network failure is not a refusal. Signing someone out for having bad
      // wifi is a real way to lose work.
      setState('unreachable');
      setMessage('Could not reach the database to confirm this account. Check the connection and retry.');
      return;
    }
    if (!authorised) {
      setState('unauthorised');
      setMessage('That account is signed in but is not an authorised administrator.');
      return;
    }
    setSession(candidate);
    setState('ready');
    setMessage('');
  }, []);

  // Starts on a microtask so the state transitions happen after this effect
  // has committed rather than synchronously inside it. `restoreSession` also
  // strips tokens out of the URL, which is a side effect and has no business
  // running during render.
  //
  // The initial state is `checking` so a returning admin never sees a flash of
  // the sign-in form; the microtask drops it to `idle` immediately when there
  // is no stored session.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const restored = restoreSession();
      if (!restored) {
        setState('idle');
        return;
      }
      verify(restored);
    });
    return () => {
      cancelled = true;
    };
  }, [verify]);

  return {
    session,
    setSession,
    state,
    message,
    setMessage,
    verify,
    async submit(email, password) {
      setState('checking');
      setMessage('');
      try {
        const next = await signIn(email, password);
        await verify(next);
      } catch (error) {
        setState('idle');
        setMessage(error.message);
      }
    },
    async leave() {
      await signOut(session ?? restoreSession());
      setSession(null);
      setState('idle');
      setMessage('Signed out.');
    },
  };
}

function SignIn({ onSubmit, busy, message, tone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-[#060d18] text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-code text-[10px] uppercase tracking-[0.22em] text-teal-300">
          Amar Digital Systems
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">Control centre</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Private. Every action here is recorded in the audit log.
        </p>

        <form
          className="mt-7 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(email, password);
            setPassword('');
          }}
        >
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:border-teal-400/60"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm outline-none focus:border-teal-400/60"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            aria-busy={busy}
            className="w-full rounded-lg bg-teal-400 px-4 py-3 min-h-[44px] text-sm font-semibold text-[#06121f] transition-colors hover:bg-teal-300 disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Sign in'}
          </button>

          <div role="status" aria-live="polite" className="min-h-[1.25rem]">
            {message && (
              <p
                className="text-sm m-0"
                style={{ color: tone === 'error' ? '#f87171' : '#94a3b8' }}
              >
                {message}
              </p>
            )}
          </div>
        </form>

        <p className="mt-8 font-code text-[11px] text-slate-600">
          <Link href="/" className="hover:text-teal-300 transition-colors">
            ← back to the site
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function AdminShell({ title, description, actions = [], children }) {
  const router = useRouter();
  const auth = useAdminAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const mainRef = useRef(null);

  const groups = useMemo(() => sectionsByGroup(), []);
  const current = findSection(router.pathname);

  // ⌘K / Ctrl-K anywhere, except while typing into a field — a palette that
  // steals the shortcut mid-sentence is worse than no palette.
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) {
          // Still allow it from a field if the field is the palette's own.
          if (!document.activeElement?.closest('[role="dialog"]')) return;
        }
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close the mobile menu on navigation by adjusting state during render, so
  // the menu is never painted open on the new route.
  const [menuRoute, setMenuRoute] = useState(router.pathname);
  if (menuRoute !== router.pathname) {
    setMenuRoute(router.pathname);
    setMenuOpen(false);
  }

  const head = (
    <Head>
      <title>{`${title} · Control centre`}</title>
      <meta name="robots" content="noindex,nofollow,noarchive" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );

  if (auth.state !== 'ready') {
    const busy = auth.state === 'checking';
    const tone = auth.state === 'unauthorised' || auth.state === 'unreachable' ? 'error' : 'info';
    return (
      <>
        {head}
        <SignIn onSubmit={auth.submit} busy={busy} message={auth.message} tone={tone} />
      </>
    );
  }

  const nav = (
    <nav aria-label="Control centre sections" className="p-3">
      {groups.map(({ group, sections }) => (
        <div key={group} className="mb-5 last:mb-0">
          <p className="px-3 mb-1.5 font-code text-[10px] uppercase tracking-[0.2em] text-slate-600">
            {group}
          </p>
          <ul className="list-none m-0 p-0 space-y-0.5">
            {sections.map((section) => {
              const active = current?.id === section.id;
              return (
                <li key={section.id}>
                  <Link
                    href={section.href}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-center rounded-lg px-3 min-h-[40px] text-sm transition-colors"
                    style={{
                      background: active ? 'rgba(20,184,166,0.14)' : 'transparent',
                      color: active ? '#5eead4' : '#cbd5e1',
                    }}
                  >
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {head}
      <div className="min-h-screen bg-[#060d18] text-slate-100">
        {/* Keyboard users should not have to tab the whole sidebar on every
            page to reach the thing they came for. */}
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#06121f]"
        >
          Skip to content
        </a>

        <div className="flex min-h-screen">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-white/8 bg-[#081120]">
            <div className="border-b border-white/8 px-4 py-4">
              <p className="font-code text-[10px] uppercase tracking-[0.22em] text-teal-300 m-0">
                Control centre
              </p>
              <p className="text-sm text-slate-400 m-0 mt-1">Amar Digital Systems</p>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
            <div className="border-t border-white/8 p-3">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="mb-2 flex w-full items-center justify-between rounded-lg border border-white/10 px-3 min-h-[40px] text-sm text-slate-400 transition-colors hover:text-slate-100"
              >
                Search
                <kbd className="font-code text-[10px] text-slate-600">⌘K</kbd>
              </button>
              <button
                type="button"
                onClick={auth.leave}
                className="flex w-full items-center rounded-lg px-3 min-h-[40px] text-sm text-slate-400 transition-colors hover:text-red-300"
              >
                Sign out
              </button>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3 lg:px-8">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-nav"
                className="lg:hidden rounded-lg border border-white/10 px-3 min-h-[44px] text-sm text-slate-300"
              >
                {menuOpen ? 'Close' : 'Menu'}
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-slate-100 m-0">{title}</h1>
                {description && (
                  <p className="truncate text-xs text-slate-500 m-0 mt-0.5">{description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="lg:hidden rounded-lg border border-white/10 px-3 min-h-[44px] text-sm text-slate-300"
              >
                Search
              </button>

              <Link
                href="/"
                className="hidden sm:inline-flex items-center rounded-lg border border-white/10 px-3 min-h-[40px] text-xs font-code text-slate-400 transition-colors hover:text-slate-100"
              >
                View site ↗
              </Link>
            </header>

            {menuOpen && (
              <div id="admin-mobile-nav" className="lg:hidden border-b border-white/8 bg-[#081120]">
                {nav}
                <div className="border-t border-white/8 p-3">
                  <button
                    type="button"
                    onClick={auth.leave}
                    className="flex w-full items-center rounded-lg px-3 min-h-[44px] text-sm text-slate-400"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}

            <main id="admin-main" ref={mainRef} tabIndex={-1} className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
              {children({ session: auth.session, setSession: auth.setSession })}
            </main>
          </div>
        </div>

        <CommandPalette
          open={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          actions={actions}
        />
      </div>
    </>
  );
}
