/**
 * /contact — a form that actually records the message.
 *
 * The previous version built a `mailto:` URL and navigated to it. That works
 * only if the visitor has a mail client configured, gives no confirmation that
 * anything happened, and leaves no record anywhere. Every enquiry that failed
 * that way failed silently, which is the worst property a contact form can have.
 *
 * Now it posts to `/api/contact`, which validates server-side and writes the
 * enquiry down. The direct email address is still on the page, because some
 * people prefer it and because a form that is the only way to reach someone is
 * its own kind of wall.
 *
 * Preserved from the old page: the social links and the terminal easter egg.
 *
 * ── Accessibility ────────────────────────────────────────────────────────────
 * Errors are reported per field with `aria-invalid` and `aria-describedby`, not
 * only as a toast — a toast is transient and a screen reader user who missed it
 * has no way back to it. The status region is `role="status"` and polite, and
 * the submit button reports its busy state rather than only looking different.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fadeUp } from '@/lib/motion';
import { getContactCategories, getProfile } from '@/lib/content';

const profile = getProfile();
const categories = getContactCategories();

const TerminalGame = dynamic(() => import('@/components/TerminalGame'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel p-6 h-64 flex items-center justify-center">
      <p className="text-slate-400 font-code text-sm">Initializing Secure Terminal...</p>
    </div>
  ),
});

const socials = [
  {
    label: 'LinkedIn',
    handle: 'amarjaleel',
    href: profile.social.linkedin,
    color: '#0077b5',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    handle: 'amarjaleelbanbhan',
    href: profile.social.github,
    color: '#e2e8f0',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    handle: profile.phone,
    href: `https://wa.me/${profile.whatsapp}?text=Hi%20Amar!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.`,
    color: '#25D366',
    icon: (
      <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

const FIELD_CLASS =
  'w-full rounded-lg bg-white/4 border px-4 py-3 text-slate-100 placeholder-slate-600 focus:bg-neon-cyan/5 focus:outline-none transition-colors duration-200 text-sm';

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-red-400 mt-1.5 m-0">
      {message}
    </p>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    organisation: '',
    link: '',
    message: '',
    fax: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [statusMessage, setStatusMessage] = useState('');
  const mountedAt = useRef(0);
  const firstErrorRef = useRef(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const set = (key) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [key]: value }));
    // Clear an error as soon as the visitor starts addressing it. Leaving it up
    // while they type reads as the form arguing with them.
    setFieldErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === form.category),
    [form.category]
  );

  const submit = async (event) => {
    event.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    setStatusMessage('Sending…');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, elapsedMs: Date.now() - mountedAt.current }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState('error');
        setFieldErrors(data.fields ?? {});
        setStatusMessage(data.error ?? 'Something went wrong. Please try again.');
        // Move focus to the problem rather than leaving it on the button.
        requestAnimationFrame(() => firstErrorRef.current?.focus());
        return;
      }

      setState('sent');
      setStatusMessage('Message sent. I read everything and will reply to anything specific.');
      setForm({
        name: '',
        email: '',
        category: '',
        organisation: '',
        link: '',
        message: '',
        fax: '',
      });
    } catch {
      setState('error');
      setStatusMessage(
        'The message could not be sent — the connection failed. Please email me directly.'
      );
    }
  };

  return (
    <>
      <Seo
        title="Contact — Amar Jaleel"
        description="Get in touch about an engineering role, an internship, research collaboration, open source or a client project. Messages are recorded, not routed through a mail client."
        path="/contact"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container max-w-5xl">
          {/* ── Header ── */}
          <motion.div {...fadeUp()} className="mb-10">
            <p className="section-label">{'// reach out'}</p>
            <h1 className="section-heading max-w-3xl text-balance">Get in touch</h1>
            <p className="mt-3 text-slate-400 max-w-2xl leading-relaxed">
              Open to engineering roles, internships, research collaboration and open-source work.
              Tell me which of those this is and the message goes somewhere I will actually see it.
            </p>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
            {/* ── Form ── */}
            <motion.div {...fadeUp({ delay: 0.05 })} className="min-w-0">
              <form onSubmit={submit} noValidate className="space-y-5">
                {/* Category — first, because it changes what the rest is for. */}
                <fieldset className="m-0 p-0 border-0">
                  <legend className="block text-sm font-medium text-slate-300 mb-2 p-0">
                    What is this about?
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {categories.map((category) => {
                      const active = form.category === category.id;
                      return (
                        <label
                          key={category.id}
                          className="flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors min-h-[44px]"
                          style={{
                            borderColor: active ? 'rgba(20,184,166,0.6)' : 'rgba(255,255,255,0.10)',
                            background: active ? 'rgba(20,184,166,0.08)' : 'rgba(255,255,255,0.03)',
                          }}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={active}
                            onChange={set('category')}
                            aria-describedby={
                              fieldErrors.category ? 'contact-category-error' : undefined
                            }
                            className="mt-1 accent-[color:var(--accent)] shrink-0"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm text-slate-200">{category.label}</span>
                            <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">
                              {category.detail}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="contact-category-error" message={fieldErrors.category} />
                </fieldset>

                {/* The one category with a better destination. */}
                {selectedCategory?.routesToStudio && (
                  <div className="surface-card p-4">
                    <p className="text-sm text-slate-300 leading-relaxed m-0">
                      Client work goes through the Studio request form, which asks what a project
                      brief actually needs. You can still send this message here if you would
                      rather start with a question.
                    </p>
                    <Link
                      href="/studio/request"
                      className="mt-2.5 font-code text-xs font-semibold text-neon-cyan hover:text-white transition-colors min-h-[44px] inline-flex items-center"
                    >
                      Open the Studio request form →
                    </Link>
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      ref={fieldErrors.name ? firstErrorRef : undefined}
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={set('name')}
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                      className={FIELD_CLASS}
                      style={{
                        borderColor: fieldErrors.name
                          ? 'rgba(248,113,113,0.6)'
                          : 'rgba(255,255,255,0.10)',
                      }}
                    />
                    <FieldError id="contact-name-error" message={fieldErrors.name} />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      ref={!fieldErrors.name && fieldErrors.email ? firstErrorRef : undefined}
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set('email')}
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                      className={FIELD_CLASS}
                      style={{
                        borderColor: fieldErrors.email
                          ? 'rgba(248,113,113,0.6)'
                          : 'rgba(255,255,255,0.10)',
                      }}
                    />
                    <FieldError id="contact-email-error" message={fieldErrors.email} />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-organisation"
                      className="block text-sm font-medium text-slate-300 mb-1.5"
                    >
                      Company or university{' '}
                      <span className="text-slate-600 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-organisation"
                      type="text"
                      autoComplete="organization"
                      value={form.organisation}
                      onChange={set('organisation')}
                      className={FIELD_CLASS}
                      style={{ borderColor: 'rgba(255,255,255,0.10)' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-link" className="block text-sm font-medium text-slate-300 mb-1.5">
                      A link <span className="text-slate-600 font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-link"
                      type="url"
                      inputMode="url"
                      placeholder="https://"
                      value={form.link}
                      onChange={set('link')}
                      aria-invalid={Boolean(fieldErrors.link)}
                      aria-describedby={fieldErrors.link ? 'contact-link-error' : undefined}
                      className={FIELD_CLASS}
                      style={{
                        borderColor: fieldErrors.link
                          ? 'rgba(248,113,113,0.6)'
                          : 'rgba(255,255,255,0.10)',
                      }}
                    />
                    <FieldError id="contact-link-error" message={fieldErrors.link} />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    ref={!fieldErrors.name && !fieldErrors.email && fieldErrors.message ? firstErrorRef : undefined}
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="What are you working on, and where do I come in?"
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={
                      fieldErrors.message ? 'contact-message-error' : 'contact-message-hint'
                    }
                    className={`${FIELD_CLASS} resize-y`}
                    style={{
                      borderColor: fieldErrors.message
                        ? 'rgba(248,113,113,0.6)'
                        : 'rgba(255,255,255,0.10)',
                    }}
                  />
                  <FieldError id="contact-message-error" message={fieldErrors.message} />
                  {!fieldErrors.message && (
                    <p id="contact-message-hint" className="text-xs text-slate-600 mt-1.5 m-0">
                      Specifics get a better reply than {'“let’s connect”'}.
                    </p>
                  )}
                </div>

                {/* Honeypot. Hidden from sight and from the accessibility tree,
                    and never focusable, so no real visitor can reach it. */}
                <div aria-hidden="true" className="absolute w-px h-px -left-[9999px] overflow-hidden">
                  <label htmlFor="contact-fax">Fax</label>
                  <input
                    id="contact-fax"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.fax}
                    onChange={set('fax')}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    aria-busy={state === 'sending'}
                    className="px-6 py-3 min-h-[44px] inline-flex items-center gap-2 bg-neon-cyan text-midnight font-semibold rounded-lg text-sm hover:bg-neon-green transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {state === 'sending' ? 'Sending…' : 'Send message'}
                  </button>

                  <p className="font-code text-xs text-slate-500 m-0">
                    or{' '}
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-neon-cyan hover:text-white transition-colors"
                    >
                      {profile.email}
                    </a>
                  </p>
                </div>

                {/* Persistent status, not a toast. A toast that has faded is a
                    result the visitor cannot get back to. */}
                <div role="status" aria-live="polite" className="min-h-[1.5rem]">
                  {statusMessage && (
                    <p
                      className="text-sm m-0"
                      style={{
                        color:
                          state === 'sent'
                            ? '#22c55e'
                            : state === 'error'
                              ? '#f87171'
                              : '#94a3b8',
                      }}
                    >
                      {statusMessage}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>

            {/* ── Elsewhere ── */}
            <motion.div {...fadeUp({ delay: 0.1 })} className="space-y-3 min-w-0">
              <p className="text-sm font-medium text-slate-400 mb-4">Find me elsewhere</p>
              {socials.map(({ label, handle, href, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface-card flex items-center gap-4 p-4 group"
                >
                  <span className="p-2.5 rounded-lg shrink-0" style={{ background: `${color}15`, color }}>
                    {icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {label}
                    </span>
                    <span className="block text-xs text-slate-500 font-code truncate">{handle}</span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}

              <div className="surface-card p-4">
                <p className="text-sm font-medium text-slate-200 m-0 mb-1">Independent work</p>
                <p className="text-xs text-slate-400 leading-relaxed m-0">
                  Client projects run through{' '}
                  <span className="text-slate-300">Amar Digital Systems</span> — an independent
                  engineering practice, not an agency or a registered company.
                </p>
                <Link
                  href="/studio"
                  className="mt-2 font-code text-xs text-neon-cyan hover:text-white transition-colors min-h-[44px] inline-flex items-center"
                >
                  About the Studio →
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ── Terminal easter egg. Preserved. ── */}
          <motion.div {...fadeUp({ delay: 0.15 })} className="mt-16">
            <TerminalGame />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
