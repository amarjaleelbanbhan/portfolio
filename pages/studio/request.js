import { useState } from 'react';
import Link from 'next/link';
import Seo from '@/components/Seo';
import styles from '@/styles/Request.module.css';

const initialState = {
  name: '',
  email: '',
  website: '',
  company: '',
  service: 'not_sure',
  timeline: '',
  problem: '',
  fax: '',
};

const services = [
  {
    value: 'website_fix',
    label: 'Fix an existing website',
    detail: 'Bugs, forms, speed, mobile, layout, broken pages',
  },
  {
    value: 'new_website',
    label: 'Build a new website',
    detail: 'Business site, landing page, redesign, ecommerce',
  },
  {
    value: 'web_app',
    label: 'Build a web app / MVP',
    detail: 'Dashboard, portal, internal tool, lightweight SaaS',
  },
  {
    value: 'chatbot',
    label: 'Add an AI chatbot',
    detail: 'FAQ, lead capture, qualification, handoff',
  },
  {
    value: 'automation',
    label: 'Automate a workflow',
    detail: 'Email, CRM, forms, spreadsheets, reminders',
  },
  {
    value: 'not_sure',
    label: 'Not sure yet',
    detail: 'Describe the problem and I will map the technical path',
  },
];

const timelineOptions = [
  ['', 'No fixed date / flexible'],
  ['asap', 'As soon as practical'],
  ['1_2_weeks', 'Within 1–2 weeks'],
  ['this_month', 'Sometime this month'],
  ['flexible', 'Planning ahead / flexible'],
];

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
      setMessage('Thanks — I have the details. I’ll review them and reply with the clearest next step before any work starts.');
      setForm(initialState);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Seo
        title="Start a Project · Amar Digital Systems"
        description="Tell Amar Digital Systems what you need built, fixed, or automated: websites, web apps, AI chatbots, bug fixes, and business workflows."
      />

      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/hire" className={styles.brand} aria-label="Amar Digital Systems">
            <span className={styles.mark}>A</span>
            <span className={styles.brandCopy}>
              <strong>Amar Digital Systems</strong>
              <small>Websites · Apps · AI · Automation</small>
            </span>
          </Link>
          <Link href="/hire" className={styles.backLink}>← Back to services</Link>
        </header>

        <main className={styles.main}>
          <section className={styles.intro}>
            <div className={styles.availability}><span /> Project inquiries open</div>
            <p className={styles.eyebrow}>Start here</p>
            <h1>
              Tell me what you need
              <span>built, fixed, or automated.</span>
            </h1>
            <p className={styles.lede}>
              You do not need a technical brief. Pick the closest project type, share the website or idea if you have one,
              and explain what is not working or what you want to create.
            </p>

            <div className={styles.nextCard}>
              <p className={styles.nextTitle}>What happens after you submit</p>
              <div className={styles.nextStep}><b>01</b><span><strong>I review the current situation</strong><small>Website, workflow, idea, or bug.</small></span></div>
              <div className={styles.nextStep}><b>02</b><span><strong>I ask only what is needed</strong><small>No long discovery form or sales script.</small></span></div>
              <div className={styles.nextStep}><b>03</b><span><strong>You get a clear next step</strong><small>Scope and price are agreed before implementation.</small></span></div>
            </div>

            <div className={styles.exampleCard}>
              <span>Good first message</span>
              <p>“Our website form is unreliable on mobile and we may also need the lead pushed into our CRM. Can you take a look?”</p>
            </div>
          </section>

          <section className={styles.formCard}>
            <div className={styles.formHeader}>
              <div>
                <p>Project request</p>
                <h2>Share enough context to start.</h2>
              </div>
              <span className={styles.securePill}>Private inquiry</span>
            </div>

            <form onSubmit={submit} className={styles.form}>
              <input
                type="text"
                name="fax"
                value={form.fax}
                onChange={update}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className={styles.honeypot}
              />

              <fieldset className={styles.fieldset}>
                <legend>What do you need help with?</legend>
                <p className={styles.fieldHint}>Choose the closest option. “Not sure yet” is completely fine.</p>
                <div className={styles.serviceGrid}>
                  {services.map((service) => (
                    <label
                      key={service.value}
                      className={`${styles.serviceOption} ${form.service === service.value ? styles.serviceSelected : ''}`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.value}
                        checked={form.service === service.value}
                        onChange={update}
                      />
                      <span className={styles.radioMark} />
                      <span>
                        <strong>{service.label}</strong>
                        <small>{service.detail}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.divider} />

              <div className={styles.twoCol}>
                <Field label="Your name" name="name" value={form.name} onChange={update} required placeholder="Jane Smith" />
                <Field label="Work email" name="email" type="email" value={form.email} onChange={update} required placeholder="jane@company.com" />
              </div>

              <div className={styles.twoCol}>
                <Field label="Company" name="company" value={form.company} onChange={update} placeholder="Optional" />
                <Field
                  label="Website / reference link"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={update}
                  placeholder="Optional if starting from scratch"
                />
              </div>

              <label className={styles.field}>
                <span>What should I know?</span>
                <small>Describe the problem, goal, or feature in your own words.</small>
                <textarea
                  name="problem"
                  value={form.problem}
                  onChange={update}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={7}
                  placeholder="Example: We already have a website, but the mobile form is unreliable. We also want every new lead added to our CRM automatically so follow-up is not missed."
                />
              </label>

              <label className={styles.field}>
                <span>When would you like to start? <em>Optional</em></span>
                <select name="timeline" value={form.timeline} onChange={update}>
                  {timelineOptions.map(([value, label]) => <option key={value || 'none'} value={value}>{label}</option>)}
                </select>
              </label>

              <div className={styles.submitArea}>
                <button type="submit" disabled={status === 'submitting'} className={styles.submitButton}>
                  {status === 'submitting' ? 'Sending project details…' : 'Send project details →'}
                </button>
                <p>No payment or commitment at this step. I review the request first.</p>
              </div>

              {message && (
                <div className={`${styles.message} ${status === 'success' ? styles.success : styles.error}`} role="status">
                  {message}
                </div>
              )}
            </form>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>Amar Digital Systems</span>
          <p>Focused web development, AI assistants, and business automation.</p>
        </footer>
      </div>
    </>
  );
}

function Field({ label, name, type = 'text', value, onChange, required = false, placeholder = '' }) {
  return (
    <label className={styles.field}>
      <span>{label}{!required && <em> Optional</em>}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'company' ? 'organization' : 'off'}
      />
    </label>
  );
}
