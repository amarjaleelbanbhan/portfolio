/**
 * /work/[slug] — engineering case studies.
 *
 * Routes are generated only for projects that actually have a `caseStudy` block
 * in canonical content. A project without reviewed evidence has no page rather
 * than a page full of empty headings, and `fallback: false` makes every other
 * slug a real 404 instead of a thin shell.
 *
 * Every section below renders conditionally. The template is written out in
 * full, and the content decides what appears — so adding evidence to a project
 * record is all it takes to grow its case study, and nothing has to be
 * special-cased per project.
 */
import { useMemo } from 'react';
import Seo from '@/components/Seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectHero from '@/components/case-study/ProjectHero';
import ProjectArchitecture from '@/components/case-study/ProjectArchitecture';
import RelatedWork from '@/components/case-study/RelatedWork';
import ExperimentMatrix from '@/components/case-study/ExperimentMatrix';
import { ResearchCorrection, ResearchFindings } from '@/components/case-study/ResearchFindings';
import {
  ConcernSection,
  ConstraintBlock,
  ProjectLimitations,
  ProjectMetrics,
  ProjectTimeline,
  ProseSection,
  ResultsSection,
  TechnicalDecisions,
  TestEvidence,
} from '@/components/case-study/sections';
import { getProjectVisual } from '@/components/project-visuals';
import { usePrefersReducedMotion } from '@/lib/useMediaQuery';
import {
  getAllProjects,
  getCaseStudyProjects,
  getProjectBySlug,
  getRelatedProjects,
  getSkillBySlug,
} from '@/lib/content';

export async function getStaticPaths() {
  return {
    // Only real slugs that have case-study content.
    paths: getCaseStudyProjects().map((p) => ({ params: { slug: p.slug } })),
    // Anything else is a genuine 404, not a runtime-rendered placeholder.
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project?.caseStudy) return { notFound: true };

  const caseStudySlugs = new Set(getCaseStudyProjects().map((p) => p.slug));

  return {
    props: {
      project,
      related: getRelatedProjects(project.slug, 4).map((p) => ({
        slug: p.slug,
        title: p.title,
        shortTitle: p.shortTitle ?? null,
        summary: p.summary,
        status: p.status,
        hasCaseStudy: caseStudySlugs.has(p.slug),
      })),
    },
  };
}

export default function CaseStudy({ project, related }) {
  const reduced = usePrefersReducedMotion();
  const accent = getProjectVisual(project.slug).accent;
  const study = project.caseStudy ?? {};

  const technologies = useMemo(
    () =>
      (project.technologies ?? [])
        .map((slug) => ({ slug, skill: getSkillBySlug(slug) }))
        .filter((e) => Boolean(e.skill))
        .map((e) => ({ key: e.slug, label: e.skill.shortName ?? e.skill.name })),
    [project.technologies]
  );

  const seo = project.seo ?? {};

  return (
    <>
      <Seo
        title={seo.title ?? `${project.title} — Engineering Case Study`}
        description={seo.description ?? project.summary}
        path={`/work/${project.slug}`}
        type="article"
      />
      <div className="min-h-screen flex flex-col bg-transparent">
        <Navbar />
        <main className="flex-1 section-container">
          <article>
            <ProjectHero project={project} technologies={technologies} reduced={reduced} />

            <ProseSection id="problem" title="The problem" body={project.problem} />

            <ConstraintBlock
              context={study.context}
              constraints={study.constraints}
              accent={accent}
            />

            <ProseSection id="built" title="What I built" body={study.built ?? project.solution} />

            <ProjectArchitecture
              architecture={study.architecture}
              accent={accent}
              reduced={reduced}
            />

            <ProseSection id="contribution" title="My contribution" body={project.role} />

            <ExperimentMatrix experiment={study.experiment} accent={accent} reduced={reduced} />

            <ResearchFindings findings={study.findings} accent={accent} />

            <ResearchCorrection correction={study.correction} accent={accent} />

            <TechnicalDecisions decisions={study.decisions} accent={accent} />

            <ConcernSection concerns={study.concerns} />

            <TestEvidence items={study.verification} accent={accent} />

            <ProjectMetrics metrics={project.metrics} accent={accent} />

            <ResultsSection results={study.results} />

            <ProjectTimeline entries={study.timeline} accent={accent} />

            <ProjectLimitations
              limitations={project.limitations}
              disclosure={study.disclosure}
            />
          </article>

          <RelatedWork projects={related} />
        </main>
        <Footer />
      </div>
    </>
  );
}
