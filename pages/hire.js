import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Hire.module.css';

const services = [
  {
    kicker: 'Existing website',
    title: 'Fix bugs, broken pages, forms, speed, or mobile issues',
    text: 'If the site already exists, send the URL and the problem. I can work inside the current codebase instead of pushing a rebuild you do not need.',
    tags: ['Bug fixes', 'Performance', 'Responsive fixes', 'Forms'],
  },
  {
    kicker: 'New website',
    title: 'Build a clear, modern website that helps visitors take action',
    text: 'Business sites, landing pages, service pages, portfolio sites, and lightweight ecommerce experiences designed around a clear next step.',
    tags: ['Design + build', 'Landing pages', 'CMS-ready', 'SEO basics'],
  },
  {
    kicker: 'Web app / MVP',
    title: 'Turn a workflow or idea into a working web application',
    text: 'For dashboards, client portals, internal tools, simple SaaS products, or MVPs that need real functionality instead of just a mockup.',
    tags: ['Frontend', 'Backend', 'Supabase', 'APIs'],
  },
  {
    kicker: 'AI chatbot',
    title: 'Add a useful website assistant, not a decorative chat bubble',
    text: 'Answer common questions, collect lead details, qualify inquiries, or route visitors to the right next step using your actual business information.',
    tags: ['FAQ assistant', 'Lead capture', 'Qualification', 'Handoff'],
  },
  {
    kicker: 'Automation',
    title: 'Remove repetitive follow-up and admin work between your tools',
    text: 'Connect forms, email, CRM, spreadsheets, notifications, review requests, and recurring tasks so routine work moves without manual copying.',
    tags: ['Email follow-up', 'CRM', 'Lead routing', 'Workflows'],
  },
];

const steps = [
  ['01', 'Share the problem', 'Send the website, app idea, workflow, or bug. You do not need to write a technical specification.'],
  ['02', 'I review it', 'I inspect what already exists, identify the smallest useful solution, and ask only the questions needed to scope it properly.'],
  ['03', 'You get scope + price', 'Before implementation starts, you know what I will change, what is included, and what the project will cost.'],
  ['04', 'I build and test it', 'The work is implemented, checked, and handed over with the context you need to keep using it.'],
];

const examples = [
  '“Our website form stopped sending leads.”',
  '“We need a professional site for our business.”',
  '“Can you build a small client dashboard?”',
  '“Customers keep asking the same questions.”',
  '“We manually copy every lead into our CRM.”',
  '“The site is slow and broken on phones.”',
];

export default function Hire() {
  return (
    <>
      <Head>
        <title>Hire Amar · Websites, Apps, Chatbots & Automation</title>
        <meta
          name="description"
          content="Hire Amar Digital Systems to build or repair websites, create web apps, add AI chatbots, and automate repetitive business workflows."
        />
        <meta property="og:title" content="Need something built or fixed?" />
        <meta property="og:description" content="Websites, web apps, AI chatbots, bug fixes, and business automation — one clear place to start." />
        <meta property="og:url" content="https://amarjaleel.me/hire" />
        <link rel="canonical" href="https://amarjaleel.me/hire" />
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/hire" className={styles.brand} aria-label="Amar Digital Systems hire page">
            <span className={styles.mark}>A</span>
            <span>
              <strong>Amar Digital Systems</strong>
              <small>Build · Fix · Automate</small>
            </span>
          </Link>
          <div className={styles.headerActions}>
            <Link href="/studio" className={styles.textLink}>Studio</Link>
            <Link href="/studio/request" className={styles.headerButton}>Tell me what you need</Link>
          </div>
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.glowOne} aria-hidden="true" />
            <div className={styles.glowTwo} aria-hidden="true" />

            <div className={styles.heroCopy}>
              <div className={styles.availability}><span /> Available for focused client work</div>
              <p className={styles.eyebrow}>One link for anything you need built or fixed</p>
              <h1>
                Need something
                <span>built, fixed, or automated?</span>
              </h1>
              <p className={styles.lede}>
                I help businesses with websites, web apps, AI chatbots, technical repairs, and workflow automation.
                Send the problem first — I will help figure out the right technical solution.
              </p>

              <div className={styles.heroButtons}>
                <Link href="/studio/request" className={styles.primaryButton}>Share your project →</Link>
                <a href="#services" className={styles.secondaryButton}>See what I can help with</a>
              </div>

              <div className={styles.trustRow}>
                <span>No long contract required</span>
                <span>Scope before build</span>
                <span>Founder-led delivery</span>
              </div>
            </div>

            <div className={styles.heroPanel}>
              <div className={styles.panelTop}>
                <span className={styles.panelDot} />
                <span>What can I send?</span>
              </div>
              <div className={styles.promptCard}>
                <small>Example message</small>
                <p>“Our current site is slow on mobile and the contact form sometimes fails. Can you take a look?”</p>
              </div>
              <div className={styles.replyCard}>
                <small>What happens next</small>
                <div><b>1</b><span>I inspect the current setup</span></div>
                <div><b>2</b><span>I explain the practical fix</span></div>
                <div><b>3</b><span>You approve scope before work starts</span></div>
              </div>
              <Link href="/studio/request" className={styles.panelCta}>Send your problem</Link>
            </div>
          </section>

          <section className={styles.quickStrip}>
            <span>Website</span>
            <span>Bug fix</span>
            <span>Web app</span>
            <span>AI chatbot</span>
            <span>Automation</span>
          </section>

          <section className={styles.section} id="services">
            <div className={styles.sectionHead}>
              <p className={styles.eyebrow}>What you can hire me for</p>
              <h2>Start with the outcome you need.</h2>
              <p>If you are not sure which category fits, that is fine. Describe the problem and I will map it to the smallest sensible project.</p>
            </div>

            <div className={styles.serviceGrid}>
              {services.map((service, index) => (
                <article className={styles.serviceCard} key={service.title}>
                  <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <p className={styles.cardKicker}>{service.kicker}</p>
                  <h3>{service.title}</h3>
                  <p className={styles.cardText}>{service.text}</p>
                  <div className={styles.tags}>
                    {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.problemSection}>
            <div className={styles.problemIntro}>
              <p className={styles.eyebrow}>You can send a simple message</p>
              <h2>You do not need to speak “developer.”</h2>
              <p>Real projects usually start with a business problem, a broken page, or a repeated task — not a perfect technical brief.</p>
            </div>
            <div className={styles.exampleList}>
              {examples.map((example, index) => (
                <div key={example}><span>{String(index + 1).padStart(2, '0')}</span><p>{example}</p></div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <p className={styles.eyebrow}>How it works</p>
              <h2>A clear path from “I have a problem” to finished work.</h2>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map(([number, title, body]) => (
                <article key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.fitSection}>
            <div>
              <p className={styles.eyebrow}>Good fit</p>
              <h2>Small enough to move quickly. Technical enough to need real implementation.</h2>
            </div>
            <div className={styles.fitCards}>
              <article><b>Existing business</b><p>You already have a site or workflow and need something repaired, improved, or automated.</p></article>
              <article><b>New build</b><p>You need a website, web app, landing page, chatbot, or lightweight system built from scratch.</p></article>
              <article><b>Focused first project</b><p>You want to start with one useful deliverable before committing to a larger engagement.</p></article>
            </div>
          </section>

          <section className={styles.finalCta}>
            <p className={styles.eyebrow}>Ready when you are</p>
            <h2>Send me the website, idea, or workflow.</h2>
            <p>I will start by understanding what is actually wrong or missing — not by pushing a package you may not need.</p>
            <Link href="/studio/request" className={styles.primaryButton}>Tell me what you need →</Link>
            <div className={styles.finalLinks}>
              <Link href="/studio">View agency page</Link>
              <Link href="/projects">View technical work</Link>
              <Link href="/">About Amar</Link>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.brand}>
            <span className={styles.mark}>A</span>
            <span><strong>Amar Digital Systems</strong><small>Websites · Apps · AI · Automation</small></span>
          </div>
          <p>amarjaleel.me/hire</p>
        </footer>
      </div>
    </>
  );
}
