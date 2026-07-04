import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { personalInfo } from '@/data/portfolio';

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
    href: personalInfo.social.linkedin,
    color: '#0077b5',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    handle: 'amarjaleelbanbhan',
    href: personalInfo.social.github,
    color: '#e2e8f0',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    handle: '@ajbanbhan',
    href: personalInfo.social.twitter,
    color: '#e2e8f0',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    handle: '+92 344 443 2197',
    href: `https://wa.me/${personalInfo.whatsapp}?text=Hi%20Amar!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.`,
    color: '#25D366',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

function Toast({ message, type, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl border shadow-xl flex items-center gap-3 text-sm font-medium ${
        type === 'success'
          ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
          : 'bg-red-500/10 border-red-500/40 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 text-lg leading-none">&times;</button>
    </motion.div>
  );
}

export default function Contact() {
  const [email, setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast]   = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    showToast('Opening your email client...', 'success');
    const subject = encodeURIComponent(`Portfolio Contact from ${email}`);
    const body    = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`);
    setTimeout(() => {
      window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    }, 500);
  };

  return (
    <>
      <Head>
        <title>Contact — Amar Jaleel</title>
        <meta name="description" content="Get in touch with Amar Jaleel — open to collaborations, opportunities, and conversations." />
      </Head>
      <div className="min-h-screen flex flex-col bg-midnight">
        <AnimatePresence>
          {toast && (
            <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          )}
        </AnimatePresence>

        <Navbar />
        <main className="flex-1 section-container max-w-4xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="section-label mb-2">// reach out</p>
            <h1 className="section-heading mb-3">Let's Build Something</h1>
            <p className="text-slate-400 max-w-xl leading-relaxed">
              Open to collaborations, internships, and interesting conversations. I reply within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* ─── Left: Form ─── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-lg bg-white/4 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-neon-cyan/60 focus:bg-neon-cyan/5 focus:outline-none transition-all duration-200 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me what's on your mind..."
                    className="w-full rounded-lg bg-white/4 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-600 focus:border-neon-cyan/60 focus:bg-neon-cyan/5 focus:outline-none transition-all duration-200 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-neon-cyan text-midnight font-semibold rounded-lg shadow-lg shadow-neon-cyan/20 hover:bg-neon-green hover:shadow-neon-green/20 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Message
                </button>
              </form>

              <p className="text-slate-500 mt-4 text-xs font-code">
                Or email directly:{' '}
                <a href={`mailto:${personalInfo.email}`} className="text-neon-cyan hover:underline">
                  {personalInfo.email}
                </a>
              </p>
            </motion.div>

            {/* ─── Right: Social links ─── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-slate-400 mb-4">Find me on the internet</p>
              {socials.map(({ label, handle, href, color, icon }, idx) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all duration-200 group"
                >
                  <div
                    className="p-2.5 rounded-lg shrink-0"
                    style={{ background: `${color}15`, color }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-slate-500 font-code truncate">{handle}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ─── Terminal Easter Egg ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <TerminalGame />
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}
