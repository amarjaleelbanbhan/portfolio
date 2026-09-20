import Link from 'next/link';
import Seo from '@/components/Seo';
import styles from '@/styles/Studio.module.css';

const services = [
  {
    number: '01',
    title: 'Build or improve your website',
    body: 'For businesses that need a clearer, faster, more trustworthy website that gives visitors an obvious next step.',
    useWhen: 'Your site looks dated, is hard to use on mobile, or does not explain the offer clearly.',
    result: 'A cleaner website or landing page built around calls, bookings, forms, or sales.',
    items: ['Business websites', 'Landing pages', 'Responsive rebuilds'],
  },
  {
    number: '02',
    title: 'Fix what is broken or slow',
    body: 'Repair the parts of an existing site that create friction without forcing you into a complete rebuild.',
    useWhen: 'Forms fail, pages load poorly, layouts break, or customers keep hitting the same technical problem.',
    result: 'A tested fix with the broken path working again and clear hand-off notes.',
    items: ['Bug fixes', 'Performance', 'Maintenance'],
  },
  {
    number: '03',
    title: 'Capture and qualify more inquiries',
    body: 'Add a simple website assistant or lead flow that answers common questions and collects the right context.',
    useWhen: 'Visitors leave without enough information, ask the same questions repeatedly, or inquiries arrive with missing details.',
    result: 'A clearer inquiry path that gathers useful lead information before you reply.',
    items: ['FAQ assistants', 'Lead qualification', 'Appointment capture'],
  },
  {
    number: '04',
    title: 'Automate repetitive follow-up',
    body: 'Connect forms, email, CRM steps, reminders, and spreadsheets so routine admin happens automatically.',
    useWhen: 'Your team copies data between tools, forgets follow-ups, or repeats the same admin work every day.',
    result: 'A documented workflow that reduces manual steps and keeps the next action moving.',
    items: ['Lead follow-up', 'CRM workflows', 'Admin automation'],
  },
];

const concepts = [
  {
    label: 'Demo solution · Local clinic',
    title: 'Appointment-first website redesign',
    body: 'A clearer patient journey that surfaces essential information quickly and shortens the path from landing page to appointment request.',
    tags: ['UX', 'Responsive', 'Lead capture'],
    visual: 'clinic',
  },
  {
    label: 'Demo solution · Contractor',
    title: 'Inquiry-to-follow-up automation',
    body: 'A lightweight workflow that acknowledges new inquiries, captures job details, and creates the next follow-up step automatically.',
    tags: ['Automation', 'Email', 'CRM-ready'],
    visual: 'workflow',
  },
  {
    label: 'Demo solution · B2B software',
    title: 'Website assistant for better-qualified leads',
    body: 'An assistant that handles repetitive questions while collecting the context a sales or support person needs before replying.',
    tags: ['AI assistant', 'FAQ', 'Lead routing'],
    visual: 'chat',
  },
];

const process = [
  ['01', 'You show the problem', 'Send the website, workflow, or repeated task and explain what is going wrong. No technical brief required.'],
  ['02', 'I diagnose the smallest useful fix', 'I review the current setup, ask only the questions that matter, and define a clear scope and finish line.'],
  ['03', 'You approve scope and price', 'You know what will be changed, what is included, and what the project costs before implementation starts.'],
  ['04', 'I build, test, and hand it over', 'The fix is implemented, checked, and delivered with the notes or instructions you need to keep using it.'],
];

const faqs = [
  ['Do I need to know which service I need?', 'No. Start with the business problem. I can map it to the smallest sensible technical fix.'],
  ['Can you work with my existing website or tools?', 'Usually, yes. The first step is to inspect what you already have before suggesting a rebuild or new software.'],
  ['Will I need to buy expensive software?', 'Not by default. I prefer your existing stack or practical free/low-cost tools when they can do the job reliably.'],
  ['What happens after I submit the form?', 'I review the site or workflow, reply with the first useful observations, then ask any questions needed to scope the work.'],
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
          <div><span>01</span><b>New website inquiry</b><small>Contact details captured</small></div>
          <em>↓</em>
          <div><span>02</span><b>Lead details organized</b><small>Job type + location added</small></div>
          <em>↓</em>
          <div><span>03</span><b>Follow-up task created</b><small>Owner has the next action</small></div>
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
      <Seo
        title="Amar Digital Systems · Websites, Lead Capture & Automation"
        description="Amar Digital Systems builds and fixes websites, improves lead capture, and automates repetitive follow-up for service businesses."
      />

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
            <a href="#work">Examples</a>
            <a href="#process">How it works</a>
            <Link className={styles.navButton} href="/studio/request">Request a review</Link>
          </nav>
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.heroGridGlow} aria-hidden="true" />
            <div className={styles.heroCopy}>
              <div className={styles.availability}>
                <span /> Available for focused client projects
              </div>
              <p className={styles.eyebrow}>Websites · lead capture · business automation</p>
              <h1>
                Make it easier for customers to choose you.
                <span>Then automate what happens next.</span>
              </h1>
              <p className={styles.lede}>
                I build and repair business websites, improve how leads are captured, add useful website assistants,
                and automate repetitive follow-up between forms, email, CRM tools, and spreadsheets.
              </p>

              <p className={styles.audienceLine}>
                Best fit for clinics, contractors, agencies, local service businesses, and small SaaS teams that already have a real workflow or website problem to fix.
              </p>

              <div className={styles.actions}>
                <Link className={styles.primaryButton} href="/studio/request">Request a quick review</Link>
                <a className={styles.secondaryButton} href="#work">See example solutions</a>
              </div>

              <div className={styles.proofLine}>
                <span>Start with one problem</span>
                <span>Scope and price before build</span>
                <span>Founder-led delivery</span>
              </div>
            </div>

            <div className={styles.pipelineCard} aria-label="Example automated lead pipeline">
              <div className={styles.exampleBadge}>Example workflow</div>
              <div className={styles.pipelineHeader}>
                <div>
                  <small>Website inquiry</small>
                  <strong>What can happen after someone submits a form</strong>
                </div>
                <span className={styles.statusPill}>Automated</span>
              </div>

              <div className={styles.pipelineLead}>
                <div className={styles.leadAvatar}>JM</div>
                <div>
                  <strong>New inquiry received</strong>
                  <span>Website visitor · after business hours</span>
                </div>
                <b>New lead</b>
              </div>

              <div className={styles.pipelineSteps}>
                <div><i className={styles.done} /> <span>Inquiry stored</span><small>Immediately</small></div>
                <div><i className={styles.done} /> <span>Common questions answered</span><small>Website assistant</small></div>
                <div><i className={styles.done} /> <span>Useful details collected</span><small>Before reply</small></div>
                <div><i className={styles.active} /> <span>Follow-up task created</span><small>Next action</small></div>
              </div>

              <div className={styles.pipelineFooter}>
                <span>The exact workflow depends on your business.</span>
                <b>Less manual chasing →</b>
              </div>
            </div>
          </section>

          <section className={styles.signalBar}>
            <div><span>01</span><p>Need a better website or landing page</p></div>
            <div><span>02</span><p>Need more useful information from new leads</p></div>
            <div><span>03</span><p>Need repetitive follow-up to happen automatically</p></div>
          </section>

          <section className={styles.section} id="services">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>What I can help with</p>
              <h2>You bring the business problem. I handle the technical path.</h2>
              <p>
                You do not need to choose a package or know the implementation. Start with what is broken, slow,
                repetitive, or confusing for customers. We narrow it to one useful first project.
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
                  <p className={styles.useWhen}><strong>Choose this when:</strong> {service.useWhen}</p>
                  <div className={styles.resultLine}>
                    <span>Typical result</span>
                    <b>{service.result}</b>
                  </div>
                  <ul>
                    {service.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.workSection}`} id="work">
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Example solutions</p>
              <h2>See the kind of problem each service is meant to solve.</h2>
              <p>
                These are demonstration concepts created to show the delivery approach. They are examples, not client claims.
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
              <p className={styles.eyebrow}>How a project works</p>
              <h2>No mystery between “contact us” and the finished work.</h2>
              <p>
                The first conversation is about understanding the problem. Implementation starts only after the scope and price are clear.
              </p>
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

            <div className={styles.faqGrid}>
              {faqs.map(([question, answer]) => (
                <article key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.problemSection}>
            <div className={styles.problemIntro}>
              <p className={styles.eyebrow}>Not sure what to ask for?</p>
              <h2>Describe the pain, not the technology.</h2>
              <p>
                A useful first message can be as simple as: “this part is broken,” “we keep doing this manually,”
                or “customers keep getting stuck here.”
              </p>
            </div>
            <div className={styles.problemList}>
              <p><span>01</span>“Our form gets inquiries, but follow-up is inconsistent.”</p>
              <p><span>02</span>“The site feels slow or broken on mobile.”</p>
              <p><span>03</span>“Visitors ask the same questions every day.”</p>
              <p><span>04</span>“We copy the same information between tools manually.”</p>
              <p><span>05</span>“Our website does not clearly explain why customers should choose us.”</p>
            </div>
          </section>

          <section className={styles.auditCta}>
            <div>
              <p className={styles.eyebrow}>Simple first step</p>
              <h2>Send the website or workflow and explain what is not working.</h2>
              <p className={styles.auditCopy}>I’ll review it first, then reply with the clearest next step before we talk about building anything.</p>
            </div>
            <Link className={styles.auditButton} href="/studio/request">Request a quick review →</Link>
          </section>

          <section className={styles.contactSection}>
            <div>
              <p className={styles.eyebrow}>Amar Digital Systems</p>
              <h2>One problem. One clear next step.</h2>
              <p>
                Share the website or workflow and a short description of what is not working.
                We can start with a focused fix and only expand if there is a clear reason to.
              </p>
            </div>
            <div className={styles.contactCard}>
              <span className={styles.contactBadge}>Founder-led</span>
              <h3>Amar Jaleel</h3>
              <p>Software engineering · web systems · automation</p>
              <div className={styles.contactActions}>
                <Link className={styles.darkButton} href="/studio/request">Tell me what is broken</Link>
                <Link className={styles.textLink} href="/work">View technical work →</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>A</span>
            <span className={styles.brandText}>
              <strong>Amar Digital Systems</strong>
              <small>An independent engineering practice by Amar Jaleel</small>
            </span>
          </div>
          <p>amarjaleel.me/studio</p>
        </footer>
      </div>
    </>
  );
}
