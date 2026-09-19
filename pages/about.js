/**
 * /about — who this engineer is, and why any of it should be believed.
 *
 * The temptation on an about page is to assert character: careful, detail-
 * oriented, passionate about clean code. Anyone can type that, so none of it is
 * here. Instead the page's centrepiece is **four real engineering decisions,
 * read from the case studies, each shown with what it cost** — because a
 * decision with its trade-off attached is the only honest evidence of judgement
 * a portfolio can offer.
 *
 * Everything checkable is derived: education from the canonical record, the
 * merged-PR count from the contributions, the current focus from project and
 * research status, the credential split from the credential list. There is no
 * claimed employment, no client, no award, no testimonial and no outcome that
 * is not already evidenced somewhere else on the site.
 *
 * Reused rather than rebuilt: `PortraitOrbit` (the identity anchor from the
 * hero) and `Education` (the timeline from the homepage). A second copy of
 * either would be one more thing to keep in sync.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Education from '@/components/Education';
import PortraitOrbit from '@/components/PortraitOrbit';
import DecisionCard from '@/components/about/DecisionCard';
import TechTag from '@/components/ui/TechTag';
import { statusLabel } from '@/components/ui/StatusBadge';
import { fadeUp } from '@/lib/motion';
import {
  getAboutIntro,
  getContributionStats,
  getCredentialsByIssuer,
  getCredentialCount,
  getCurrentFocus,
  getEngineeringPrinciples,
  getFeaturedCredentials,
  getFeaturedDecisions,
  getOpportunities,
  getProfile,
  getSocialLinks,
} from '@/lib/content';

const profile = getProfile();
const intro = getAboutIntro();
const principles = getEngineeringPrinciples();
const decisions = getFeaturedDecisions();
const focus = getCurrentFocus();
const opportunities = getOpportunities();
const featuredCredentials = getFeaturedCredentials();
const credentialTotal = getCredentialCount();
const credentialsByIssuer = getCredentialsByIssuer();
const contributions = getContributionStats();
const socials = getSocialLinks();

/**
 * The supporting areas from the positioning brief. `profile.title` stays the
 * single primary identity; these say what kind of software engineer, and each
 * one is visible in the work.
 */
const SUPPORTING_AREAS = [
  { label: 'Product engineering', href: '/work' },
  { label: 'Security & developer tools', href: '/work#veripatch' },
  { label: 'Applied AI & research engineering', href: '/research' },
  { label: 'Mobile & systems engineering', href: '/work#emergency-mesh' },
];

function SectionHeading({ id, label, title, lede }) {
  return (
    <motion.div {...fadeUp()} className="mb-6">
      {label && <p className="section-label">{label}</p>}
      <h2 id={id} className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight">
        {title}
      </h2>
      {lede && <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl">{lede}</p>}
    </motion.div>
  );
}

export default function About() {
  return (
    <>
      <Seo
        title="About — Amar Jaleel, Software Engineer"
        description="Software engineer working across product, security tooling, applied AI research and systems. Engineering philosophy shown through real recorded decisions and what each one cost."
        path="/about"
        type="profile"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container">
          {/* ── Identity ── */}
          <section aria-labelledby="about-heading" className="mb-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <motion.div {...fadeUp()} className="min-w-0 order-2 lg:order-1">
                <p className="section-label">{'// about'}</p>
                <h1 id="about-heading" className="section-heading max-w-3xl text-balance">
                  {profile.name}
                </h1>
                <p className="mt-2 text-lg text-neon-cyan font-medium">{profile.title}</p>

                <ul className="list-none m-0 p-0 mt-4 flex flex-wrap gap-2">
                  {SUPPORTING_AREAS.map((area) => (
                    <li key={area.label}>
                      <Link
                        href={area.href}
                        className="inline-flex items-center min-h-[44px] sm:min-h-[32px] px-2.5 rounded-md font-code text-[11px] border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors"
                      >
                        {area.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-4 max-w-2xl">
                  {intro.map((paragraph) => (
                    <p key={paragraph.id} className="text-base text-slate-300 leading-relaxed">
                      {paragraph.body}
                    </p>
                  ))}
                </div>

                <dl className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2 max-w-2xl m-0">
                  {[
                    { term: 'Studying', value: `${profile.degree} — ${profile.university}` },
                    { term: 'Since', value: profile.educationPeriod },
                    { term: 'Based in', value: `${profile.location} · remote-friendly` },
                    {
                      term: 'Upstream',
                      value: `${contributions.merged} merged pull requests across ${contributions.repositories} repositories`,
                    },
                  ].map((item) => (
                    <div key={item.term} className="flex items-baseline gap-2">
                      <dt className="font-code text-[10px] uppercase tracking-wider text-slate-500 shrink-0">
                        {item.term}
                      </dt>
                      <dd className="text-sm text-slate-300 m-0">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>

              <motion.div
                {...fadeUp({ delay: 0.08 })}
                // The orbit rings are square elements rotating 360°, so their bounding box
                // is √2 × their width even though what you see is a circle that fits.
                // `overflow-x: clip` removes that decorative excess from the page's
                // scrollable width and, unlike `hidden`, leaves the vertical axis
                // visible so the badge below the portrait is not cut off.
                className="order-1 lg:order-2 flex justify-center lg:justify-end lg:pt-4 [overflow-x:clip]"
              >
                {/* The hero's identity anchor, reused at portrait size. */}
                <PortraitOrbit size="lg" showBadge badgeLabel="Open to Work" />
              </motion.div>
            </div>
          </section>

          {/* ── How I work ── */}
          <section aria-labelledby="principles-heading" className="mb-16 pt-10 border-t border-white/5">
            <SectionHeading
              id="principles-heading"
              label={'// how i work'}
              title="Problems where implementation quality is the whole problem"
              lede="Each of these points at work you can open and disagree with. That is the test I would want applied to anyone else's version of this section."
            />
            <ol className="list-none m-0 p-0 space-y-3">
              {principles.map((principle, index) => (
                <motion.li
                  key={principle.id}
                  {...fadeUp({ delay: Math.min(index, 4) * 0.04 })}
                  className="surface-card p-5"
                >
                  <h3 className="text-base font-semibold text-slate-100 m-0 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed m-0 max-w-3xl">
                    {principle.body}
                  </p>
                  <ul className="list-none m-0 p-0 mt-3 flex flex-wrap items-center gap-2">
                    <li className="font-code text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      Visible in
                    </li>
                    {principle.projects.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={project.href}
                          className="inline-flex items-center min-h-[44px] sm:min-h-[30px] px-2 rounded-md font-code text-[11px] border border-neon-cyan/25 text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                        >
                          {project.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </section>

          {/* ── Decisions ── */}
          <section aria-labelledby="decisions-heading" className="mb-16 pt-10 border-t border-white/5">
            <SectionHeading
              id="decisions-heading"
              label={'// judgement'}
              title="Four decisions, with what they cost"
              lede="Read from the case studies rather than written for this page. A decision without its trade-off is a feature list, so the cost is the part in amber."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {decisions.map((decision, index) => (
                <DecisionCard key={decision.id} decision={decision} index={index} />
              ))}
            </div>
          </section>

          {/* ── Current focus ── */}
          <section aria-labelledby="focus-heading" className="mb-16 pt-10 border-t border-white/5">
            <SectionHeading
              id="focus-heading"
              label={'// right now'}
              title="What I am actually working on"
              lede="Derived from project and research status, so nothing stays here because a paragraph went stale."
            />
            <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2">
              {focus.map((item, index) => (
                <motion.li
                  key={item.key}
                  {...fadeUp({ delay: Math.min(index, 4) * 0.04 })}
                  className="surface-card p-4"
                >
                  <div className="flex items-baseline gap-2 flex-wrap mb-1.5">
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-slate-100 hover:text-neon-cyan transition-colors min-h-[44px] sm:min-h-[28px] inline-flex items-center"
                    >
                      {item.label}
                    </Link>
                  </div>
                  <p className="font-code text-[10px] uppercase tracking-wider text-slate-500 m-0 mb-1.5">
                    {statusLabel(item.stage) ?? item.stage}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">{item.detail}</p>
                </motion.li>
              ))}
            </ul>
          </section>

          {/* ── Education ──
              The homepage timeline, reused. One implementation, one source. */}
          <section aria-labelledby="education-heading" className="pt-10 border-t border-white/5">
            <h2 id="education-heading" className="sr-only">
              Education
            </h2>
            <Education />
          </section>

          {/* ── Collaboration and research ── */}
          <section
            aria-labelledby="collaboration-heading"
            className="mb-16 pt-10 border-t border-white/5"
          >
            <SectionHeading
              id="collaboration-heading"
              label={'// working with others'}
              title="Upstream, and in the open"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div {...fadeUp()} className="surface-card p-5">
                <h3 className="text-base font-semibold text-slate-100 m-0 mb-2">
                  Open-source collaboration
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed m-0">
                  {contributions.merged} merged pull requests into codebases maintained by other
                  people, across {contributions.repositories} repositories
                  {contributions.open > 0 && `, with ${contributions.open} still open`}. Reading an
                  unfamiliar codebase well enough to change it safely — under someone else&apos;s
                  review and standards — is the part that transfers directly to a team.
                </p>
                <Link
                  href="/open-source"
                  className="mt-3 font-code text-xs font-semibold text-neon-green hover:text-white transition-colors min-h-[44px] inline-flex items-center"
                >
                  See every contribution →
                </Link>
              </motion.div>

              <motion.div {...fadeUp({ delay: 0.05 })} className="surface-card p-5">
                <h3 className="text-base font-semibold text-slate-100 m-0 mb-2">
                  Research and the final-year project
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed m-0">
                  One completed controlled study that published a correction against its own
                  headline result, plus research-driven engineering and systems experiments at
                  earlier stages. SCAR-OS, my final-year project, is at the research and
                  architecture stage — a proposal, not an implementation, and the research page
                  says so.
                </p>
                <Link
                  href="/research"
                  className="mt-3 font-code text-xs font-semibold text-neon-cyan hover:text-white transition-colors min-h-[44px] inline-flex items-center"
                >
                  Read the research →
                </Link>
              </motion.div>
            </div>
          </section>

          {/* ── Credentials ──
              Deliberately near the bottom and deliberately small. Supporting
              evidence, and the issuer split is counted rather than claimed —
              this set was once described as "11 Google certifications" and is
              nine Google and two Udemy. */}
          <section aria-labelledby="credentials-heading" className="mb-16 pt-10 border-t border-white/5">
            <SectionHeading
              id="credentials-heading"
              label={'// supporting evidence'}
              title="Selected credentials"
              lede={`${credentialTotal} in total — ${credentialsByIssuer
                .map((group) => `${group.count} ${group.issuer}`)
                .join(', ')}. They are supporting evidence, not the argument; the engineering above is what I would rather be judged on.`}
            />
            <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2">
              {featuredCredentials.map((credential, index) => (
                <motion.li
                  key={credential.id}
                  {...fadeUp({ delay: Math.min(index, 4) * 0.04 })}
                  className="surface-card p-4 flex items-start gap-3"
                >
                  <span className="text-xl shrink-0" role="img" aria-hidden="true">
                    {credential.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-100 m-0 leading-snug">
                      {credential.title}
                    </p>
                    <p className="font-code text-[11px] text-slate-500 m-0 mt-1">
                      {credential.issuer} · {credential.issuedAt}
                    </p>
                    <a
                      href={credential.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-code text-[11px] mt-1.5 min-h-[44px] sm:min-h-[28px] inline-flex items-center hover:brightness-125 transition-[filter]"
                      style={{ color: credential.color }}
                    >
                      Verify ↗
                    </a>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Link
              href="/certifications"
              className="mt-4 font-code text-xs text-slate-400 hover:text-neon-cyan transition-colors min-h-[44px] inline-flex items-center"
            >
              {`All ${credentialTotal} credentials →`}
            </Link>
          </section>

          {/* ── Work with me ── */}
          <section aria-labelledby="contact-heading" className="pt-10 border-t border-white/5">
            <SectionHeading
              id="contact-heading"
              label={'// get in touch'}
              title="What I am open to"
            />
            <ul className="list-none m-0 p-0 grid gap-3 sm:grid-cols-2 mb-6">
              {opportunities.map((opportunity, index) => (
                <motion.li
                  key={opportunity.id}
                  {...fadeUp({ delay: Math.min(index, 4) * 0.04 })}
                  className="surface-card p-4"
                >
                  <p className="text-sm font-medium text-slate-100 m-0 mb-1">{opportunity.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed m-0">{opportunity.detail}</p>
                </motion.li>
              ))}
            </ul>

            <motion.div {...fadeUp()} className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-3 min-h-[44px] inline-flex items-center bg-neon-cyan text-midnight font-semibold rounded-lg text-sm hover:bg-neon-green transition-colors"
              >
                Start a conversation
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="px-5 py-3 min-h-[44px] inline-flex items-center rounded-lg border border-white/12 text-slate-300 hover:text-white hover:border-white/28 transition-colors text-sm font-code"
              >
                {profile.email}
              </a>
              {socials.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 min-h-[44px] inline-flex items-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors text-sm font-code"
                >
                  {social.label}
                </a>
              ))}
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-2">
              <TechTag accent="#14b8a6">{profile.tagline}</TechTag>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
