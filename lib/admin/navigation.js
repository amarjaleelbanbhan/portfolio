/**
 * The control centre's sections.
 *
 * One list, used by the sidebar, the command palette, the mobile menu and the
 * dashboard. A section that exists in one and not another is how an admin ends
 * up with a page nobody can reach.
 *
 * `table` names the database table a section manages, where it manages one.
 * The dashboard uses it to count rows, and the section pages use it so the
 * generic editor does not need a second mapping.
 */
export const ADMIN_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    group: 'Overview',
    description: 'What is live, what is draft, and what needs attention.',
  },

  // ── Content ──
  {
    id: 'projects',
    label: 'Projects',
    href: '/admin/projects',
    group: 'Content',
    table: 'portfolio_projects',
    description: 'Projects and their case studies.',
  },
  {
    id: 'research',
    label: 'Research',
    href: '/admin/research',
    group: 'Content',
    table: 'research_projects',
    description: 'Research records, findings, corrections and disclosure.',
  },
  {
    id: 'open-source',
    label: 'Open Source',
    href: '/admin/open-source',
    group: 'Content',
    table: 'open_source_contributions',
    description: 'Upstream contributions and their verified status.',
  },
  {
    id: 'skills',
    label: 'Skills',
    href: '/admin/skills',
    group: 'Content',
    table: 'technologies',
    description: 'Technologies and the work that evidences each one.',
  },
  {
    id: 'credentials',
    label: 'Credentials',
    href: '/admin/credentials',
    group: 'Content',
    table: 'credentials',
    description: 'Certificates, with their issuers and verification links.',
  },
  {
    id: 'experience',
    label: 'Experience',
    href: '/admin/experience',
    group: 'Content',
    table: 'experience',
    description: 'Documented work history. Projects are not employment.',
  },
  {
    id: 'content',
    label: 'Site Content',
    href: '/admin/content',
    group: 'Content',
    table: 'site_content',
    description: 'Page sections and reusable copy.',
  },

  // ── Assets and configuration ──
  {
    id: 'media',
    label: 'Media',
    href: '/admin/media',
    group: 'Assets',
    table: 'portfolio_media',
    description: 'The media library, across the public and private buckets.',
  },
  {
    id: 'seo',
    label: 'SEO',
    href: '/admin/seo',
    group: 'Assets',
    description: 'Titles, descriptions and the sitemap.',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    group: 'Assets',
    table: 'site_settings',
    description: 'Site-wide configuration. Only the public projection ships.',
  },

  // ── CRM ──
  {
    id: 'leads',
    label: 'Leads',
    href: '/admin/leads',
    group: 'Enquiries',
    table: 'studio_leads',
    description: 'Enquiries from the contact form and the Studio.',
  },

  // ── Operations ──
  {
    id: 'health',
    label: 'Site Health',
    href: '/admin/health',
    group: 'Operations',
    description: 'What the database says versus what the public site shows.',
  },
  {
    id: 'audit',
    label: 'Audit Log',
    href: '/admin/audit',
    group: 'Operations',
    table: 'admin_audit_log',
    description: 'Every administrative action, append-only.',
  },
];

export const ADMIN_GROUPS = ['Overview', 'Content', 'Assets', 'Enquiries', 'Operations'];

export function sectionsByGroup() {
  return ADMIN_GROUPS.map((group) => ({
    group,
    sections: ADMIN_SECTIONS.filter((section) => section.group === group),
  })).filter((entry) => entry.sections.length > 0);
}

export function findSection(pathname) {
  // Longest match wins, so /admin/projects/new resolves to Projects rather
  // than to the dashboard.
  return (
    [...ADMIN_SECTIONS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((section) => pathname === section.href || pathname.startsWith(`${section.href}/`)) ?? null
  );
}
