/**
 * /resume — the résumé, generated from the same records as the rest of the site.
 *
 * This replaces `public/resume.html`, a hand-maintained mirror that had already
 * drifted: it still called the final-year project **VICE OS**, six months after
 * the site was renamed to SCAR-OS, and it listed skills that the registry does
 * not carry. That is the failure mode a second copy always has, and the reason
 * this is a route rather than a file.
 *
 * Everything here is derived. A project status change, a merged pull request or
 * a new credential updates the résumé in the same commit that updates the site,
 * and content validation fails the build if any reference stops resolving.
 *
 * ── Printing ─────────────────────────────────────────────────────────────────
 * There is no PDF generator. The page is designed to print instead: the print
 * stylesheet in `globals.css` inverts to black on white, drops the navigation,
 * footer, ambient canvas and the print button itself, expands links to show
 * their URLs where that is useful, and prevents entries from breaking across
 * pages. "Save as PDF" in the browser produces the document, which is one fewer
 * dependency and one fewer thing that can silently stop matching the site.
 */
import Link from 'next/link';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { statusLabel } from '@/components/ui/StatusBadge';
import {
  getAllResearch,
  getContributionsForDisplay,
  getContributionStats,
  getCredentialCount,
  getCredentialsByIssuer,
  getEducation,
  getFeaturedCredentials,
  getProfile,
  getResumeProjects,
  getResumeSkills,
  getResumeSummary,
} from '@/lib/content';

const profile = getProfile();
const summary = getResumeSummary();
const resumeProjects = getResumeProjects();
// Flagship work and the final-year project are printed in full; the smaller
// projects are named in one line with a pointer. Four A4 pages of project
// entries is a portfolio, not a résumé, and the site already is the portfolio.
const primaryProjects = resumeProjects.filter((project) => project.tier !== 'secondary');
const furtherProjects = resumeProjects.filter((project) => project.tier === 'secondary');
const contributions = getContributionsForDisplay();
const contributionStats = getContributionStats();
const research = getAllResearch();
const education = getEducation();
const skillGroups = getResumeSkills();
const credentials = getFeaturedCredentials();
const credentialTotal = getCredentialCount();
const credentialsByIssuer = getCredentialsByIssuer();

/** Strip the protocol for print: a résumé shows amarjaleel.me, not https://. */
const bare = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="resume-section mb-8">
      <h2
        id={id}
        className="resume-h2 text-xs font-code uppercase tracking-[0.22em] text-neon-cyan border-b border-white/10 pb-1.5 mb-3"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Resume() {
  return (
    <>
      <Seo
        title="Résumé — Amar Jaleel, Software Engineer"
        description="Selected engineering work with its real status, upstream contributions, research and credentials — generated from the same records as the rest of the site."
        path="/resume"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <div className="resume-chrome">
          <Navbar />
        </div>

        <main id="main-content" tabIndex={-1} className="flex-1 section-container">
          {/* ── Screen-only controls ── */}
          <div className="resume-chrome mb-8 flex flex-wrap items-center gap-3">
            <PrintButton />
            <p className="font-code text-[11px] text-slate-600 m-0 max-w-xl leading-relaxed">
              {
                '// generated from the same records as the rest of the site — statuses, contributions and credentials cannot drift from the project pages'
              }
            </p>
          </div>

          <article className="resume-doc max-w-3xl">
            {/* ── Header ── */}
            <header className="mb-8">
              <h1 className="resume-h1 text-3xl sm:text-4xl font-bold text-slate-50 tracking-tight m-0">
                {profile.name}
              </h1>
              <p className="text-base text-neon-cyan font-medium mt-1 mb-3">
                {profile.title} — {profile.tagline}
              </p>
              <ul className="resume-contact list-none m-0 p-0 flex flex-wrap gap-x-4 gap-y-1 font-code text-xs text-slate-400">
                <li>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </li>
                {profile.phone && <li>{profile.phone}</li>}
                <li>
                  <a href={profile.siteUrl} target="_blank" rel="noopener noreferrer">
                    {bare(profile.siteUrl)}
                  </a>
                </li>
                <li>
                  <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                    {bare(profile.social.github)}
                  </a>
                </li>
                <li>
                  <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                    {bare(profile.social.linkedin)}
                  </a>
                </li>
                <li>{profile.location}</li>
              </ul>
            </header>

            {/* ── Summary ── */}
            <Section id="resume-summary" title="Summary">
              <p className="text-sm text-slate-300 leading-relaxed m-0">{summary}</p>
            </Section>

            {/* ── Selected work ── */}
            <Section id="resume-work" title="Selected engineering work">
              <ul className="list-none m-0 p-0 space-y-4">
                {primaryProjects.map((project) => (
                  <li key={project.slug} className="resume-entry">
                    <p className="flex items-baseline gap-2 flex-wrap m-0 mb-1">
                      <span className="text-sm font-semibold text-slate-100">{project.title}</span>
                      <span className="font-code text-[10px] uppercase tracking-wider text-slate-500">
                        {statusLabel(project.status)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed m-0">{project.summary}</p>
                    {project.technologies.length > 0 && (
                      <p className="font-code text-[11px] text-slate-500 m-0 mt-1">
                        {project.technologies.join(' · ')}
                      </p>
                    )}
                    <p className="font-code text-[11px] m-0 mt-1 flex flex-wrap gap-x-3">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:text-white transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                      {project.sourceNote && (
                        <span className="text-slate-600">{project.sourceNote}</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
              {furtherProjects.length > 0 && (
                <p className="text-xs text-slate-500 leading-relaxed m-0 mt-3">
                  <span className="font-code text-[10px] uppercase tracking-wider text-slate-600">
                    Also{' '}
                  </span>
                  {furtherProjects
                    .map((project) => `${project.title} (${statusLabel(project.status)})`)
                    .join(' · ')}
                  {`. Full detail at ${bare(profile.siteUrl)}/work.`}
                </p>
              )}
            </Section>

            {/* ── Open source ── */}
            <Section id="resume-open-source" title="Open-source contributions">
              <p className="text-xs text-slate-500 leading-relaxed m-0 mb-2.5">
                {contributionStats.merged} merged into repositories maintained by other people
                {contributionStats.open > 0 && `, ${contributionStats.open} open`}. Statuses
                verified against the GitHub API
                {contributionStats.verifiedAsOf && ` on ${contributionStats.verifiedAsOf}`}.
              </p>
              <ul className="list-none m-0 p-0 space-y-1.5">
                {contributions.map((contribution) => (
                  <li key={contribution.id} className="resume-entry text-xs leading-relaxed">
                    <a
                      href={contribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-code text-slate-200 hover:text-neon-cyan transition-colors"
                    >
                      {contribution.repository}#{contribution.prNumber}
                    </a>
                    <span className="text-slate-500">
                      {' — '}
                      {contribution.status === 'merged' ? 'Merged' : 'Open'}.{' '}
                    </span>
                    <span className="text-slate-400">{contribution.title}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ── Research ── */}
            <Section id="resume-research" title="Research">
              <ul className="list-none m-0 p-0 space-y-2.5">
                {research.map((entry) => (
                  <li key={entry.slug} className="resume-entry">
                    <p className="m-0">
                      <span className="text-sm font-semibold text-slate-100">
                        {entry.title.split(' — ')[0]}
                      </span>
                      <span className="font-code text-[10px] uppercase tracking-wider text-slate-500">
                        {' · '}
                        {entry.publicStage}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed m-0 mt-0.5">
                      {entry.results ?? entry.researchQuestion}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>

            {/* ── Skills ── */}
            <Section id="resume-skills" title="Technical skills">
              <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 m-0">
                {skillGroups.map((group) => (
                  <div key={group.category} className="resume-entry">
                    <dt className="font-code text-[10px] uppercase tracking-wider text-slate-500">
                      {group.category}
                    </dt>
                    <dd className="text-xs text-slate-300 leading-relaxed m-0">
                      {group.names.join(' · ')}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-[11px] text-slate-600 leading-relaxed mt-2.5 m-0">
                Every technology listed is attached to a project, a pull request or a research
                entry on {bare(profile.siteUrl)}/skills. No proficiency percentages.
              </p>
            </Section>

            {/* ── Education ── */}
            <Section id="resume-education" title="Education">
              <ul className="list-none m-0 p-0 space-y-2.5">
                {education.map((entry) => (
                  <li key={entry.id} className="resume-entry">
                    <p className="m-0">
                      <span className="text-sm font-semibold text-slate-100">{entry.degree}</span>
                      <span className="text-xs text-slate-400">
                        {' · '}
                        {entry.school}
                        {' · '}
                        {entry.period}
                      </span>
                    </p>
                    {(entry.description || entry.grade) && (
                      <p className="text-xs text-slate-400 leading-relaxed m-0 mt-0.5">
                        {[entry.description, entry.grade].filter(Boolean).join('. ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </Section>

            {/* ── Credentials ── */}
            <Section id="resume-credentials" title="Selected credentials">
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                {credentials.map((credential) => credential.title).join(' · ')}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 m-0">
                {credentialTotal} in total —{' '}
                {credentialsByIssuer.map((group) => `${group.count} ${group.issuer}`).join(', ')}.
                Verification links at {bare(profile.siteUrl)}/certifications.
              </p>
            </Section>

            {/* ── Languages ── */}
            <Section id="resume-languages" title="Languages">
              <p className="text-xs text-slate-400 m-0">
                {profile.spokenLanguages
                  .map((language) => `${language.name} (${language.level})`)
                  .join(' · ')}
              </p>
            </Section>
          </article>

          <p className="resume-chrome mt-8 text-sm text-slate-500">
            The full case studies, with the evidence and the limitations, are on the{' '}
            <Link
              href="/work"
              className="text-neon-cyan hover:text-white underline decoration-dotted underline-offset-4"
            >
              work page
            </Link>
            .
          </p>
        </main>

        <div className="resume-chrome">
          <Footer />
        </div>
      </div>
    </>
  );
}

/**
 * Print control.
 *
 * A plain button rather than a link to a file: the browser's own print dialog
 * produces the PDF, which means there is no artifact to regenerate and no way
 * for a downloaded copy to disagree with the site.
 */
function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-neon-cyan text-midnight font-semibold text-sm hover:bg-neon-green transition-colors"
    >
      <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      Print or save as PDF
    </button>
  );
}
