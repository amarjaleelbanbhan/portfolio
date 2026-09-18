/**
 * ============================================
 * PORTFOLIO DATA — temporary source of truth
 * ============================================
 *
 * Phase 1 reconciled the duplicated content that used to live in
 * pages/certifications.js and pages/skills.js. Those pages now read from here.
 *
 * Phase 2 replaces this file with the canonical content model. Until then,
 * every claim in this file must be verifiable — see
 * docs/portfolio-2026/content-audit.md for what was checked and how.
 */

// ============================================
// PERSONAL INFO
// ============================================
export const personalInfo = {
  name: 'Amar Jaleel',
  title: 'Software Engineer',
  tagline: 'Product · AI · Security · Systems',
  headline: 'Software Engineer building product, AI, security, and systems software.',
  email: 'banbhanamarjalil@gmail.com',
  phone: '+92 344 443 2197',
  whatsapp: '923444432197',
  location: 'Pakistan',
  site: 'https://amarjaleel.me',

  social: {
    linkedin: 'https://www.linkedin.com/in/amarjaleel/',
    github: 'https://github.com/amarjaleelbanbhan',
    twitter: 'https://twitter.com/ajbanbhan',
    instagram: 'https://instagram.com/amarjaleel_',
  },

  resumeFile: '/resume.html',
};

// ============================================
// PROJECT STATUS VOCABULARY
// ============================================
// Every status below is backed by repository evidence, not ambition.
// See docs/portfolio-2026/content-audit.md for the evidence per project.
export const PROJECT_STATUS = {
  PRODUCTION: 'Production',
  RELEASED: 'Released',
  ACTIVE: 'Active Development',
  RESEARCH: 'Research',
  PROTOTYPE: 'Prototype',
  PRE_ALPHA: 'Pre-alpha',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

// ============================================
// STATS — verified evidence only
// ============================================
// Vanity counters ("500+ commits", "10+ projects", "15+ courses") were removed
// in Phase 1: they were unverifiable or contradicted the project list.
export const stats = [
  { label: 'Merged Upstream PRs', value: 6 },
  { label: 'Published npm Package', value: 1 },
  { label: 'Verified Credentials', value: 11 },
];

// ============================================
// PROJECTS
// ============================================
// `tier`    — 'primary' | 'secondary' | 'fyp' | 'archive'
// `private` — repository is not public; no repo link is rendered
export const projects = [
  // ---------- Primary engineering work ----------
  {
    title: 'RODIFT',
    description:
      'Enterprise field issue-reporting platform for a field-sales organization. Staff report outlet problems from a mobile app; each issue is geo-matched to the nearest outlet, routed through the org role hierarchy, and driven to resolution with push notifications and an auditable trail. A web dashboard gives management oversight.',
    tags: ['Flutter', 'Next.js', 'Supabase', 'PostgreSQL', 'PostGIS', 'FCM'],
    status: PROJECT_STATUS.PRODUCTION,
    tier: 'primary',
    private: true,
    link: null,
    github: null,
    note: 'Client project — repository private.',
    featured: true,
  },
  {
    title: 'VeriPatch',
    description:
      'Verified remediation for npm vulnerabilities. Scans a project, applies candidate fixes inside a sandbox, proves the vulnerability is eliminated and the fix is safe, then emits an audit-grade evidence report.',
    tags: ['TypeScript', 'Node.js', 'CLI', 'Docker', 'Security'],
    status: PROJECT_STATUS.RELEASED,
    tier: 'primary',
    link: 'https://www.npmjs.com/package/veripatch',
    github: 'https://github.com/amarjaleelbanbhan/VeriPatch',
    note: 'Published on npm (v0.3.1).',
    featured: true,
  },
  {
    title: 'KnowledgeGuard / EGB',
    description:
      'A controlled study asking whether a RAG system can tell how its retrieved evidence is deficient — missing, insufficient, conflicting, outdated, or absent from the corpus — and whether that diagnosis carries actionable information for selecting a repair action.',
    tags: ['Python', 'RAG', 'Evaluation', 'Experiment Design'],
    status: PROJECT_STATUS.RESEARCH,
    tier: 'primary',
    private: true,
    link: null,
    github: null,
    note: 'Benchmark built, factorial executed, analysis complete. Repository private.',
    featured: true,
  },
  {
    title: 'CortexWard',
    description:
      'An AI software-security engineer that understands, verifies, fixes, and secures code. Runs a multi-scanner and agent pipeline with a closed verification loop rather than reporting unverified findings.',
    tags: ['Python', 'Static Analysis', 'Sandboxing', 'LLM Agents'],
    status: PROJECT_STATUS.PRE_ALPHA,
    tier: 'primary',
    link: 'https://github.com/amarjaleelbanbhan/CortexWard',
    github: 'https://github.com/amarjaleelbanbhan/CortexWard',
    note: 'Pre-alpha, per the project’s own status badge.',
    featured: true,
  },
  {
    title: 'SceneForge',
    description:
      'Turns a JSON manifest of HTML/CSS/JS scenes into a single MP4, scene by scene. Headless Chrome renders frames, FFmpeg composes them, and a React/Monaco editor drives it. Runs entirely locally — no cloud APIs, no uploads.',
    tags: ['JavaScript', 'Express', 'Headless Chrome', 'FFmpeg', 'React'],
    status: PROJECT_STATUS.ACTIVE,
    tier: 'primary',
    private: true,
    link: null,
    github: null,
    note: 'Repository private.',
    featured: true,
  },

  // ---------- Strong secondary work ----------
  {
    title: 'Emergency Mesh',
    description:
      'Offline emergency communication. Phones exchange messages directly over Bluetooth Low Energy, relaying for each other, with no internet, no cell service and no server anywhere in the path.',
    tags: ['Flutter', 'Dart', 'Kotlin', 'BLE', 'Cryptography'],
    status: PROJECT_STATUS.ACTIVE,
    tier: 'secondary',
    private: true,
    link: null,
    github: null,
    note: 'Protocol, routing, crypto and BLE transport built and tested; UI just starting. Not yet installable as a finished product, and not suitable for real emergencies. Repository private.',
    featured: false,
  },
  {
    title: 'CS Learning by Game',
    description:
      'AI-powered computer science education engine — an interactive automata theory (DFA/NFA) visualizer with step-by-step simulation and gamified mission progression.',
    tags: ['TypeScript', 'Next.js', 'Automata Theory', 'Monorepo'],
    status: PROJECT_STATUS.ACTIVE,
    tier: 'secondary',
    link: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game',
    github: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game',
    featured: false,
  },
  {
    title: 'BuildSphere',
    description:
      'Browser-based 3D floor planner. Draft walls, add furniture, and export a layout, with save/load and undo/redo. Built with Next.js and React Three Fiber.',
    tags: ['Next.js', 'React Three Fiber', 'WebGL', 'JavaScript'],
    status: PROJECT_STATUS.PROTOTYPE,
    tier: 'secondary',
    link: 'https://github.com/amarjaleelbanbhan/BuildSphere',
    github: 'https://github.com/amarjaleelbanbhan/BuildSphere',
    featured: false,
  },
  {
    title: 'TODO Tracker Pro',
    description:
      'VS Code extension that surfaces every TODO, FIXME and HACK comment in a codebase through a sidebar panel, with optional Gemini-backed priority triage.',
    tags: ['TypeScript', 'VS Code API', 'Developer Tools'],
    status: PROJECT_STATUS.COMPLETED,
    tier: 'secondary',
    link: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro',
    github: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro',
    note: 'Not published to the VS Code Marketplace.',
    featured: false,
  },

  // ---------- Current final-year project ----------
  {
    title: 'VICE OS',
    description:
      'Integrating voice and intent-driven interaction into a developer-oriented operating environment. Final-year project, currently at the research and architecture stage — no implementation yet.',
    tags: ['Research', 'Operating Systems', 'Voice Interaction', 'HCI'],
    status: PROJECT_STATUS.RESEARCH,
    tier: 'fyp',
    private: true,
    link: null,
    github: null,
    note: 'Current FYP — Research & Architecture Stage.',
    featured: false,
  },

  // ---------- Earlier work, kept as archive ----------
  {
    title: 'ZakatLink',
    description:
      'Full-stack Zakat management platform with role-based auth and beneficiary tracking, connecting donors and recipients.',
    tags: ['Node.js', 'TypeScript', 'React', 'PostgreSQL'],
    status: PROJECT_STATUS.ARCHIVED,
    tier: 'archive',
    link: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    github: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    featured: false,
  },
  {
    title: 'MediTalk',
    description:
      'Educational machine-learning prototype: a voice interface over a symptom-classification model. Built to explore speech interfaces and ML classification together. It was never clinically validated and was never intended for medical use.',
    tags: ['Python', 'Machine Learning', 'Flask', 'Streamlit'],
    status: PROJECT_STATUS.ARCHIVED,
    tier: 'archive',
    link: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    github: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    note: 'Historical prototype. Not a diagnostic tool.',
    featured: false,
  },
  {
    title: 'Smart Notebook',
    description:
      'Note-taking experiment that generates Mermaid.js diagrams from plain text, turning written notes into structured visuals.',
    tags: ['Next.js', 'Mermaid.js', 'OpenAI'],
    status: PROJECT_STATUS.ARCHIVED,
    tier: 'archive',
    link: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    github: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    featured: false,
  },
  {
    title: 'EduResource Hub',
    description:
      'Static catalogue of free educational resources with client-side search and filtering, and no runtime dependencies.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'GitHub Pages'],
    status: PROJECT_STATUS.ARCHIVED,
    tier: 'archive',
    link: 'https://amarjaleelbanbhan.github.io/EduResource_Hub/',
    github: 'https://github.com/amarjaleelbanbhan/EduResource_Hub',
    featured: false,
  },
];

// ============================================
// OPEN SOURCE CONTRIBUTIONS
// ============================================
// Every entry verified against the GitHub API on 2026-09-18.
// The dedicated /open-source page is Phase 14; this is the interim record.
export const openSource = [
  {
    repo: 'pydantic/pydantic-ai',
    number: 5969,
    title: 'Fix AGUIAdapter.dump_messages reordering ToolReturnPart after UserPromptPart',
    status: 'Merged',
    mergedAt: '2026-07-01',
    language: 'Python',
    url: 'https://github.com/pydantic/pydantic-ai/pull/5969',
  },
  {
    repo: 'promptfoo/promptfoo',
    number: 9781,
    title: 'Add per-test repeat option',
    status: 'Merged',
    mergedAt: '2026-06-21',
    language: 'TypeScript',
    url: 'https://github.com/promptfoo/promptfoo/pull/9781',
  },
  {
    repo: 'cobusgreyling/loop-engineering',
    number: 395,
    title: 'Harden loop-action command execution against unquoted shell expansion',
    status: 'Merged',
    mergedAt: '2026-07-27',
    language: 'JavaScript',
    url: 'https://github.com/cobusgreyling/loop-engineering/pull/395',
  },
  {
    repo: 'cobusgreyling/loop-engineering',
    number: 437,
    title: 'loop_estimate_cost honors early_exit_required',
    status: 'Merged',
    mergedAt: '2026-07-31',
    language: 'JavaScript',
    url: 'https://github.com/cobusgreyling/loop-engineering/pull/437',
  },
  {
    repo: 'MCP-Audit/MCTS',
    number: 233,
    title: 'Add doctor optional toolchain checks',
    status: 'Merged',
    mergedAt: '2026-06-11',
    language: 'Python',
    url: 'https://github.com/MCP-Audit/MCTS/pull/233',
  },
  {
    repo: 'AcademySoftwareFoundation/dna',
    number: 195,
    title: 'Fix SPI v2 Uvicorn app target',
    status: 'Merged',
    mergedAt: '2026-09-17',
    language: 'Python',
    url: 'https://github.com/AcademySoftwareFoundation/dna/pull/195',
  },
  {
    repo: 'shaal/eye-tracker',
    number: 61,
    title: 'Tell a collapsed axis apart from a uniform offset in describeBiasPattern',
    status: 'Open',
    mergedAt: null,
    language: 'TypeScript',
    url: 'https://github.com/shaal/eye-tracker/pull/61',
  },
];

// ============================================
// CREDENTIALS
// ============================================
// Single source of truth — pages/certifications.js reads from here.
// Every credential URL was checked on 2026-09-18.
// Note: this set is 9 Google + 2 Udemy, so it is not "11 Google certifications".
export const achievements = [
  {
    title: 'Google Cybersecurity Professional',
    organization: 'Google',
    date: 'Nov 2025',
    type: 'certification',
    // Was pointing at U2DN4IX0N6H7 on /certifications, which is the Data
    // Analytics credential. Corrected in Phase 1.
    verifyLink: 'https://www.coursera.org/account/accomplishments/specialization/MDMFD7XJJXL4',
    description: 'Eight-course specialization: network security, Linux, Python, SQL and SIEM tooling.',
    color: '#ef4444',
    icon: '🔒',
  },
  {
    title: 'Google Data Analytics Professional',
    organization: 'Google',
    date: '2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/specialization/W0BZT6HTJXZE',
    description: 'Eight-course specialization: data cleaning, analysis, R, SQL and Tableau.',
    color: '#f59e0b',
    icon: '📊',
  },
  {
    title: 'Google AI Essentials',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/0YL581G13RX6',
    description: 'Generative AI fundamentals, responsible AI practice and practical tool use.',
    color: '#8b5cf6',
    icon: '🤖',
  },
  {
    title: 'Python Bootcamp: Master Python with Real-World Projects',
    organization: 'Udemy',
    date: 'Jun 2025',
    type: 'certification',
    verifyLink: 'https://www.udemy.com/certificate/UC-ea3dcd47-fe5c-4073-b11b-15d417c0f56a/',
    description: 'Python programming from fundamentals through applied projects.',
    color: '#3b82f6',
    icon: '🐍',
  },
  {
    title: 'Discover the Art of Prompting',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/TUEGAHF57ZTM',
    description: 'Prompt design techniques for generative models.',
    color: '#10b981',
    icon: '💬',
  },
  {
    title: 'Introduction to AI',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/2D6R17WJ0GV4',
    description: 'Foundations of artificial intelligence, machine learning and neural networks.',
    color: '#14b8a6',
    icon: '🧠',
  },
  {
    title: 'Maximize Productivity With AI Tools',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/IFKTQQ411CQZ',
    description: 'Applying generative AI tools to everyday working practice.',
    color: '#f97316',
    icon: '⚡',
  },
  {
    title: 'Use AI Responsibly',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/CVLTNGKIT1XW',
    description: 'Bias, fairness and responsible deployment of AI systems.',
    color: '#a855f7',
    icon: '🛡️',
  },
  {
    title: 'Foundations of Cybersecurity',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/50E0LB750MEX',
    description: 'Security domains, threat landscape and core defensive concepts.',
    color: '#ef4444',
    icon: '🔐',
  },
  {
    title: 'Play It Safe: Manage Security Risks',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/2GA0972VLLSD',
    description: 'Risk management frameworks, security audits and controls.',
    color: '#f43f5e',
    icon: '🛡️',
  },
  {
    title: 'HTML Fundamentals',
    organization: 'Udemy',
    date: 'Jun 2021',
    type: 'certification',
    verifyLink: 'https://www.udemy.com/certificate/UC-4c91f9fa-2aee-4eaf-8274-806cce39ca59/',
    description: 'Introductory HTML and document structure.',
    color: '#94a3b8',
    icon: '🌐',
  },
];

// ============================================
// SKILLS
// ============================================
// Phase 1 removed the invented proficiency percentages ("Python 90%").
// Each language now lists where it is actually used. Phase 16 turns this into
// the full evidence-backed skill system.
export const skills = {
  languages: [
    { name: 'Python', color: '#3b82f6', usedIn: ['CortexWard', 'KnowledgeGuard', 'pydantic-ai', 'MCTS'] },
    { name: 'TypeScript', color: '#6366f1', usedIn: ['VeriPatch', 'CS Learning by Game', 'promptfoo', 'This portfolio'] },
    { name: 'JavaScript', color: '#f59e0b', usedIn: ['SceneForge', 'BuildSphere', 'loop-engineering'] },
    { name: 'Dart', color: '#06b6d4', usedIn: ['Emergency Mesh', 'RODIFT'] },
    { name: 'SQL', color: '#10b981', usedIn: ['RODIFT', 'ZakatLink'] },
    { name: 'Kotlin', color: '#a855f7', usedIn: ['Emergency Mesh (native BLE)'] },
    { name: 'HTML / CSS', color: '#f97316', usedIn: ['This portfolio', 'EduResource Hub'] },
  ],

  categories: {
    'Product Engineering': ['Flutter', 'Next.js', 'React', 'Supabase', 'PostgreSQL', 'PostGIS'],
    'Applied AI': ['RAG', 'LLM Agents', 'Evaluation', 'Prompt Engineering'],
    'Security & Dev Tools': ['Static Analysis', 'Sandboxing', 'Docker', 'CLI Design', 'OSV'],
    'Systems': ['BLE', 'Cryptography', 'FFmpeg', 'Headless Chrome', 'Linux'],
  },

  learning: [
    'Program analysis and verification',
    'RAG evaluation methodology',
    'Distributed and offline-first systems',
    'Operating systems and voice interaction (FYP)',
  ],
};

// ============================================
// EXPERIENCE
// ============================================
export const experience = [];

// ============================================
// EDUCATION
// ============================================
export const education = [
  {
    degree: 'Bachelor of Computer Science',
    school: 'Sukkur IBA University',
    period: 'Aug 2023 - Jun 2027',
    description: 'Focus on software engineering, security and applied AI',
    grade: '',
    icon: '🎓',
  },
  {
    degree: 'Intermediate (Pre-Engineering)',
    school: 'Government Degree College Thari Mir Wah',
    period: 'Apr 2020 - Oct 2022',
    description: 'Pre-Engineering with Science subjects',
    grade: 'Grade: A',
    icon: '📚',
  },
];
