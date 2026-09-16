import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const initialState = {
  name: '',
  email: '',
  website: '',
  company: '',
  problem: '',
  source: 'studio_request',
};

export default function StudioRequest() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/studio-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || 'Could not submit your request.');

      setStatus('success');
      setMessage('Received. I’ll review the site and reply with the most practical next step.');
      setForm(initialState);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Request a Quick Review · Amar Digital Systems</title>
        <meta
          name="description"
          content="Send your website or workflow to Amar Digital Systems for a focused technical review."
        />
      </Head>

      <main className="min-h-screen bg-[#07111f] text-white px-5 py-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/studio" className="text-sm text-teal-300 hover:text-teal-200">
            ← Back to Amar Digital Systems
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">Quick review</p>
              <h1 className="mt-4 text-5xl font-bold leading-[0.98] tracking-[-0.045em] md:text-7xl">
                Show me what is not working.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                Send the website or workflow and describe the bottleneck. I’ll start with the smallest practical fix instead of pushing a large package.
              </p>
              <div className="mt-8 space-y-3 text-sm text-slate-400">
                <p>✓ Website bugs, forms, mobile issues, performance</p>
                <p>✓ Lead capture, FAQ assistants, inquiry routing</p>
                <p>✓ Email, CRM, spreadsheet, and follow-up automation</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:p-8">
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Name" name="name" value={form.name} onChange={update} required />
                  <Field label="Work email" name="email" type="email" value={form.email} onChange={update} required />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Company" name="company" value={form.company} onChange={update} />
                  <Field label="Website URL" name="website" type="url" value={form.website} onChange={update} required placeholder="https://example.com" />
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">What is the problem?</span>
                  <textarea
                    name="problem"
                    value={form.problem}
                    onChange={update}
                    required
                    rows={7}
                    placeholder="Example: Our inquiry form works, but leads sit in the inbox until the next day."
                    className="w-full rounded-2xl border border-white/10 bg-[#0a1627] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full rounded-full bg-teal-300 px-5 py-3.5 font-bold text-[#05211d] transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'submitting' ? 'Sending…' : 'Request a quick review'}
                </button>

                {message && (
                  <p className={`text-sm ${status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {message}
                  </p>
                )}

                <p className="text-xs leading-5 text-slate-500">
                  No spam. This form is for project inquiries only.
                </p>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#0a1627] px-4 py-3 text-white outline-none transition focus:border-teal-300/60"
      />
    </label>
  );
}
