import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Studio.module.css';

const services = [
  {
    number: '01',
    title: 'Website design & development',
    body: 'Fast, responsive websites and landing pages built around trust, inquiries, bookings, and a clear next step.',
    items: ['Business websites', 'Landing pages', 'Responsive rebuilds'],
  },
  {
    number: '02',
    title: 'Website repair & performance',
    body: 'Fix broken forms, mobile issues, layout problems, slow pages, and conversion friction without forcing a full rebuild.',
    items: ['Bug fixes', 'Speed work', 'Maintenance'],
  },
  {
    number: '03',
    title: 'Lead capture & AI assistants',
    body: 'Answer common questions, collect useful context, and keep new inquiries moving when nobody is online.',
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
    body: 'A cleaner patient journey that answers urgent questions quickly and shortens the path from landing page to appointment request.',
    tags: ['UX', 'Responsive', 'Lead capture'],
    visual: 'clinic',
  },
  {
    label: 'Concept workflow · Contractor',
    title: 'Inquiry-to-follow-up automation',
    body: 'A lightweight system that acknowledges new inquiries immediately, captures job details, and surfaces higher-intent leads first.',
    tags: ['Automation', 'Email', 'CRM-ready'],
    visual: 'workflow',
  },
  {
    label: 'Concept build · B2B software',
    title: 'Website assistant for qualified inquiries',
    body: 'An assistant flow that handles repetitive questions while collecting the context a sales or support person needs next.',
    tags: ['AI assistant', 'FAQ', 'Lead routing'],
    visual: 'chat',
  },
];

const process = [
  ['01', 'Diagnose', 'Find the bottleneck before proposing work.'],
  ['02', 'Scope', 'Define the smallest useful deliverable and a clear finish line.'],
  ['03', 'Build', 'Implement, test, and document the fix.'],
  ['04', 'Hand off', 'Deliver the result with the context needed to maintain it.'],
];

function WorkVisual({ type }) {
  if (type === 'clinic') {
    return (
      <div className={`${styles.workVisual} ${styles.clinicVisual}`} aria-hidden="true">
        <div className={styles.browserMock}>
          <div className={styles.browserTop}><i /><i /><i /></div>
          <div className={styles.browserBody}>
            <span className={styles.mockKicker}>Same-day appointments</span>
            <strong>Care that starts with a clear next step.</strong>
            <p>Book a visit without searching through five pages.</p>
            <span className={styles.mockButton}>Request appointment</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'workflow') {
    return (
      <div className={`${styles.workVisual} ${styles.workflowVisual}`} aria-hidden="true">
        <div className={styles.workflowStack}>
          <div><span>01</span><b>New website inquiry</b><small>9:41 PM</small></div>
          <em>↓</em>
          <div><span>02</span><b>Lead qualified</b><small>Job type + location captured</small></div>
          <em>↓</em>
          <div><span>03</span><b>Follow-up queued</b><small>Owner notified instantly</small></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.workVisual} ${styles.chatVisual}`} aria-hidden="true">
      <div className={styles.chatWindow}>
        <div className={styles.chatTop}><span className={styles.liveDot} /> Website assistant</div>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>Does this work with HubSpot?</div>
        <div className={`${styles.bubble} ${styles.bubbleBot}`}>Yes. Which part do you want to automate first — lead capture, routing, or follow-up?</div>
        <div className={`${styles.bubble} ${styles.bubbleUser}`}>Follow-up.</div>
      </div>
    </div>
  );
}

export default function Studio() {
  return (
    <>
      <Head>
        <title>Amar Digital Systems · Websites, Automation & AI Assistants</title>
        <meta
          name="description"
          content="Amar Digital Systems helps service businesses improve websites, capture more leads, and automate repetitive follow-up work."
        />
        <meta property="og:title" content="Amar Digital Systems" />
        <meta property="og:description" content="Fix the site. Capture the lead. Automate the follow-up." />
        <meta property="og:url" content="https://amarjaleel.me/studio" />
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
            <div className={styles.heroGridGlow} aria-hidden="true" />
            <div className={styles.heroCopy}>
              <div className={styles.availability}>
                <span /> Available for focused client projects
              </div>
              <p className={styles.eyebrow}>Founder-led technical studio · remote-first</p>
              <h1>
                Fix the site.
                <span> Capture the lead. Automate the follow-up.</span>
              </h1>
              <p className={styles.lede}>
                I help service businesses turn slow, outdated, or manual customer journeys into
                cleaner websites and simple systems that keep inquiries moving.
              </p>

              <div className={styles.actions}>
                <Link className={styles.primaryButton} href="/contact">Show me the problem</Link>
                <Link className={styles.secondaryButton} href="/projects">View technical work</Link>
              </div>

              <div className={styles.proofLine}>
                <span>Clear scope before build</span>
                <span>No long contract required</span>
                <span>Founder-led delivery</span>
              </div>
            </div>

            <div className={styles.pipelineCard} aria-label="Example automated lead pipeline">
              <div className={styles.pipelineHeader}>
                <div>
                  <small>Lead pipeline</small>
                  <strong>After-hours inquiry</strong>
                </div>
                <span className={styles.statusPill}>Automated</span>
              </div>

              <div className={styles.pipelineLead}>
                <div className={styles.leadAvatar}>JM</div>
                <div>
                  <strong>New website inquiry</strong>
                  <span>9:41 PM · mobile visitor</span>
                </div>
                <b>High intent</b>
              </div>

              <div className={styles.pipelineSteps}>
                <div><i className={styles.done} /> <span>Inquiry captured</span><small>0 sec</small></div>
                <div><i className={styles.done} /> <span>Questions answered</span><small>18 sec</small></div>
                <div><i className={styles.done} /> <span>Lead qualified</span><small>42 sec</small></div>
                <div><i className={styles.active} /> <span>Follow-up scheduled</span><small>Next step</small></div>
              </div>

              <div className={styles.pipelineFooter}>
                <span>No one had to be online.</span>
                <b>Lead kept moving →</b>
              </div>
            </div>
          </section>

          <section className={styles.signalBar}>
            <div><span>01</span><p>Website problems that quietly lose trust</p></div>
            <div><span>02</span><p>Leads that wait too long for a reply</p></div>
            <div><span>03</span><p>Admin work that should be automatic</p></div>
          </section>

          <section className={styles.section} id="services">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Services</p>
              <h2>Start with the bottleneck, not a package.</h2>
              <p>
                One visible problem is enough to begin. The goal is a useful result you can point to,
                not a pile of software you have to manage later.
              </p>
            </div>

            <div className={styles.serviceGrid}>
              {services.map((service) => (
                <article className={styles.serviceCard} key={service.number}>
                  <div className={styles.serviceTop}>
                    <span>{service.number}</span>
                    <i>↗</i>
                  </div>
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
              <h2>Concrete outcomes, not vague “digital transformation.”</h2>
              <p>
                These are concept projects created to demonstrate the delivery approach — not client claims.
              </p>
            </div>

            <div className={styles.workGrid}>
              {concepts.map((concept) => (
                <article className={styles.workCard} key={concept.title}>
                  <WorkVisual type={concept.visual} />
                  <div className={styles.workCopy}>
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
            <div className={styles.problemIntro}>
              <p className={styles.eyebrow}>Good first projects</p>
              <h2>Start where money or time is leaking.</h2>
              <p>You do not need to know the technical solution. Describe what feels slow, broken, repetitive, or hard to manage.</p>
            </div>
            <div className={styles.problemList}>
              <p><span>01</span>“Our form gets inquiries, but follow-up is inconsistent.”</p>
              <p><span>02</span>“The site feels slow or broken on mobile.”</p>
              <p><span>03</span>“Visitors ask the same questions every day.”</p>
              <p><span>04</span>“We copy the same information between tools manually.”</p>
              <p><span>05</span>“Our website looks old and does not build trust.”</p>
            </div>
          </section>

          <section className={styles.auditCta}>
            <div>
              <p className={styles.eyebrow}>Low-friction first step</p>
              <h2>Send your website. I’ll tell you the first three things I would fix.</h2>
            </div>
            <Link className={styles.auditButton} href="/contact">Request a quick review →</Link>
          </section>

          <section className={styles.contactSection}>
            <div>
              <p className={styles.eyebrow}>Amar Digital Systems</p>
              <h2>One problem. One clear next step.</h2>
              <p>
                Share the website or workflow and a short description of what is not working.
                We can start small and only expand if the first result earns it.
              </p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactBadge}>Founder-led</span>
              <h3>Amar Jaleel</h3>
              <p>Software engineering · web systems · automation</p>
              <div className={styles.contactActions}>
                <Link className={styles.darkButton} href="/contact">Start a conversation</Link>
                <Link className={styles.textLink} href="/">Personal portfolio →</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>A</span>
            <span className={styles.brandText}>
              <strong>Amar Digital Systems</strong>
              <small>Websites · automation · AI assistants</small>
            </span>
          </div>
          <p>amarjaleel.me/studio</p>
        </footer>
      </div>
    </>
  );
}
