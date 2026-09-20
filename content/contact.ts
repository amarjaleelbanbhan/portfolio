/**
 * Contact enquiry categories.
 *
 * Canonical because both ends need them: the form renders them and the API
 * validates against them, and a category that exists on one side but not the
 * other is a submission that silently fails or a value nobody can filter by.
 *
 * `routesToStudio` marks the one category that is really a client enquiry. The
 * Studio has its own request flow with the questions a project brief actually
 * needs — budget shape, timeline, what exists today — so the contact form points
 * there instead of collecting half of it badly.
 */
export interface ContactCategory {
  /** Stored value. Kept snake_case to match what the leads table already holds. */
  id: string;
  label: string;
  /** One line telling a visitor whether this is the right box to tick. */
  detail: string;
  /** True when the Studio request form is the better destination. */
  routesToStudio?: boolean;
}

export const contactCategories: ContactCategory[] = [
  {
    id: 'engineering_opportunity',
    label: 'Engineering opportunity',
    detail: 'A role, a contract, or a team looking for someone to build something.',
  },
  {
    id: 'internship_job',
    label: 'Internship or graduate role',
    detail: 'Still a student until mid-2027, so internships and new-graduate roles both apply.',
  },
  {
    id: 'research_collaboration',
    label: 'Research collaboration',
    detail: 'Retrieval evaluation, verification tooling, or anything in the research section.',
  },
  {
    id: 'open_source',
    label: 'Open source',
    detail: 'A bug in something I maintain, or an issue you would like a pull request for.',
  },
  {
    id: 'client_project',
    label: 'Client project',
    detail: 'Independent engineering work. The Studio request form asks the right questions.',
    routesToStudio: true,
  },
  {
    id: 'other',
    label: 'Something else',
    detail: 'Questions, corrections, or anything that does not fit above.',
  },
];
