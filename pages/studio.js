import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Studio.module.css';

const services = [
  {
    number: '01',
    title: 'Website design & development',
    body: 'Fast, responsive service-business websites and landing pages built around trust, inquiries, and clear next steps.',
    items: ['Business websites', 'Landing pages', 'Responsive rebuilds'],
  },
  {
    number: '02',
    title: 'Website repair & performance',
    body: 'Fix broken forms, layout issues, mobile problems, slow pages, and technical friction without forcing a full rebuild.',
    items: ['Bug fixes', 'Speed work', 'Maintenance'],
  },
  {
    number: '03',
    title: 'Lead capture & AI assistants',
    body: 'Answer common questions, qualify inquiries, and capture useful context before a human joins the conversation.',
    items: ['FAQ assistants', 'Lead qualification', 'Appointment capture'],
  },
  {
    number: '04',
    title: 'Business automation',
    body: 'Connect forms, email, CRM steps, reminders, and spreadsheets so repetitive follow-up stops eating the day.',
    items: ['Lead follow-up', 'CRM workflows', 'Admin automation'],
  },
];

const concepts = [
  {
    label: 'Concept build · Local clinic',
    title: 'Appointment-first website redesign',
    body: 'A homepage structure that answers urgent patient questions quickly and shortens the path from visit to appointment request.',
    tags: ['UX', 'Responsive', 'Lead capture'],
  },
  {
    label: 'Concept workflow · Contractor',
    title: 'Inquiry-to-follow-up automation',
    body: 'A simple flow that acknowledges new inquiries immediately, captures job details, and surfaces higher-intent leads first.',
    tags: ['Automation', 'Email', 'CRM-ready'],
  },
  {
    label: 'Concept build · B2B software',
    title: 'Website assistant for qualified inquiries',
    body: 'An assistant flow that handles repetitive questions while collecting the context a sales or support person needs next.',
    tags: ['AI assistant', 'FAQ', 'Lead routing'],
  },
];

const process = [
  ['1', 'Diagnose', 'Identify one concrete bottleneck before proposing work.'],
  ['2', 'Scope', 'Define the smallest useful deliverable and a clear finish line.'],
  ['3', 'Build', 'Implement, test, and document the fix.'],
  ['4', 'Hand off', 'Deliver the result with the context needed to maintain it.'],
];

export default function Studio() {
  return (
    <>
      <Head>
        <title>Amar Digital Systems · Web Development & Automation</title>
        <meta
          name="description"
          content="Amar Digital Systems helps service businesses improve websites, capture more leads, and automate repetitive follow-up work."
        />
        <meta property="og:title" content="Amar Digital Systems" />
        <meta
          property="og:description"
          content="Websites that work. Automations that save time."
        />
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/studio" aria-label="Amar Digital Systems home">
            <span className={styles.brandMark}>A</span>
            <span className={styles.brandText}>
              <strong>Amar Digital Systems</strong>
              <small>Web · Automation · AI Assistants</small>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Studio navigation">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <Link className={styles.navButton} href="/contact">Start a project</Link>
          </nav>
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Small technical studio · remote-first</p>
              <h1>
                Websites that work.
                <span> Automations that save time.</span>
              </h1>
              <p className={styles.lede}>
                Amar Digital Systems helps service businesses fix weak websites,
                capture more inquiries, and remove repetitive admin work with practical
                development and automation.
              </p>

              <div className={styles.actions}>
                <Link className={styles.primaryButton} href="/contact">Tell me what is broken</Link>
                <Link className={styles.secondaryButton} href="/projects">View founder work</Link>
              </div>

              <div className={styles.proofLine}>
                <span>Clear scope</span>
                <span>Fixed deliverables</span>
                <span>No unnecessary software</span>
              </div>
            </div>

            <div className={styles.auditPanel} aria-label="Example lead workflow audit">
              <div className={styles.panelTop}>
                <div><i /><i /><i /></div>
                <span>lead-flow.audit</span>
              </div>
              <div className={styles.auditBody}>
                <p className={styles.auditLabel}>Observed issue</p>
                <h2>Website inquiry arrives after hours</h2>
                <p className={styles.auditMuted}>No instant response · no qualification · manual follow-up next morning</p>

                <div className={styles.flow}>
                  <span>Visitor</span>
                  <b>→</b>
                  <span>Lead form</span>
                  <b>→</b>
                  <span className={styles.wait}>Wait</span>
                </div>

                <div className={styles.fixBox}>
                  <small>Fix</small>
                  <p>Capture → qualify → notify → follow up automatically.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.promise}>
            <p>Built for businesses that need a result, not another tool to manage.</p>
          </section>

          <section className={styles.section} id="services">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Services</p>
              <h2>Fix the bottleneck first.</h2>
              <p>Start with one concrete problem. Expand only when the result justifies it.</p>
            </div>

            <div className={styles.serviceGrid}>
              {services.map((service) => (
                <article className={styles.serviceCard} key={service.number}>
                  <span>{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                  <ul>
                    {service.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.workSection}`} id="work">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Demonstration projects</p>
              <h2>What a finished outcome looks like.</h2>
              <p>
                These are concept projects created to demonstrate the delivery approach —
                not client claims.
              </p>
            </div>

            <div className={styles.workGrid}>
              {concepts.map((concept, index) => (
                <article className={styles.workCard} key={concept.title}>
                  <div className={`${styles.workVisual} ${styles[`visual${index + 1}`]}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <p className={styles.workLabel}>{concept.label}</p>
                    <h3>{concept.title}</h3>
                    <p>{concept.body}</p>
                    <div className={styles.tags}>
                      {concept.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} id="process">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Process</p>
              <h2>Small scope. Fast feedback. Clear finish line.</h2>
            </div>

            <div className={styles.processGrid}>
              {process.map(([number, title, body]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.problemSection}>
            <div>
              <p className={styles.eyebrow}>Good first projects</p>
              <h2>Not sure what to ask for?</h2>
            </div>
            <div className={styles.problemList}>
              <p><span>01</span>“Our form gets inquiries, but follow-up is inconsistent.”</p>
              <p><span>02</span>“The site feels slow or broken on mobile.”</p>
              <p><span>03</span>“Visitors ask the same questions every day.”</p>
              <p><span>04</span>“We copy the same information between tools manually.”</p>
              <p><span>05</span>“Our website looks old and does not build trust.”</p>
            </div>
          </section>

          <section className={styles.contactSection}>
            <div>
              <p className={styles.eyebrow}>Start small</p>
              <h2>Tell me what is not working.</h2>
              <p>
                Share the website or workflow and a short description of the problem.
                I’ll start by identifying the most practical next step.
              </p>
            </div>
            <div className={styles.contactCard}>
              <p>Founder-led delivery</p>
              <h3>Amar Jaleel</h3>
              <span>Software engineering · web systems · automation</span>
              <div className={styles.contactActions}>
                <Link className={styles.primaryButton} href="/contact">Start a conversation</Link>
                <Link className={styles.textLink} href="/">Back to personal portfolio →</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>A</span>
            <span className={styles.brandText}>
              <strong>Amar Digital Systems</strong>
              <small>Websites that work. Automations that save time.</small>
            </span>
          </div>
          <p>Part of amarjaleel.me</p>
        </footer>
      </div>
    </>
  );
}
