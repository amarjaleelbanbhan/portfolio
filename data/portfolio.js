/**
 * ============================================
 * 📁 PORTFOLIO DATA - EDIT THIS FILE TO UPDATE YOUR SITE
 * ============================================
 * 
 * Just edit the arrays below to add/remove items.
 * No coding knowledge needed!
 */

// ============================================
// 👤 PERSONAL INFO
// ============================================
export const personalInfo = {
  name: 'Amar Jaleel',
  title: 'AI Product Engineer',
  tagline: 'AI  |  Cybersecurity  |  Data Analytics',
  email: 'banbhanamarjalil@gmail.com',
  phone: '+92 344 443 2197',
  whatsapp: '923444432197',
  location: 'Pakistan',
  
  // Social Links
  social: {
    linkedin: 'https://www.linkedin.com/in/amarjaleel/',
    github: 'https://github.com/amarjaleelbanbhan',
    twitter: 'https://twitter.com/ajbanbhan',
    instagram: 'https://instagram.com/amarjaleel_',
  },
  
  // Resume - Put your HTML resume in /public folder
  resumeFile: '/resume.html',
};

// ============================================
// 📊 STATS - Numbers that appear on homepage
// ============================================
export const stats = [
  { label: 'Certifications', value: 11, suffix: '+' },
  { label: 'Projects Completed', value: 10, suffix: '+' },
  { label: 'GitHub Commits', value: 500, suffix: '+' },
  { label: 'Courses Completed', value: 15, suffix: '+' },
];

// ============================================
// 🚀 PROJECTS - Add your projects here
// ============================================
export const projects = [
  {
    title: 'ZakatLink',
    description: 'Full-stack Zakat management platform with role-based auth, secure payment processing, and real-time beneficiary tracking. Bridges donors and recipients efficiently.',
    tags: ['Node.js', 'TypeScript', 'React', 'PostgreSQL'],
    link: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    github: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    featured: true,
  },
  {
    title: 'Smart Notebook',
    description: 'AI-powered note-taking app that auto-generates Mermaid.js diagrams from plain text. Converts ideas into structured visual representations instantly.',
    tags: ['AI', 'Next.js', 'Mermaid.js', 'OpenAI'],
    link: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    github: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    featured: true,
  },
  {
    title: 'Bus Reservation System',
    description: 'Production-grade backend API for a transport booking platform. Handles seat availability, booking lifecycle, and passenger management with SQL-backed persistence.',
    tags: ['Node.js', 'SQL', 'REST API', 'Express'],
    link: 'https://github.com/amarjaleelbanbhan/Bus-Reservation-System',
    github: 'https://github.com/amarjaleelbanbhan/Bus-Reservation-System',
    featured: true,
  },
  {
    title: 'EduResource Hub',
    description: '306+ free educational resources across 102+ categories with smart search, real-time filtering, and zero dependencies. Helps students find quality learning materials instantly.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'JSON', 'GitHub Pages'],
    link: 'https://amarjaleelbanbhan.github.io/EduResource_Hub/',
    github: 'https://github.com/amarjaleelbanbhan/EduResource_Hub',
    featured: true,
  },
  {
    title: 'MediTalk - AI Voice Agent',
    description: 'Conversational AI voice agent for preliminary medical consultation. Analyzes symptoms using ML (85% accuracy) and delivers diagnosis-style responses via natural speech.',
    tags: ['Python', 'Machine Learning', 'Flask', 'Streamlit', 'Docker'],
    link: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    github: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    featured: true,
  },
  {
    title: 'VeriPatch',
    description: 'npm security CLI that verifies package patches are safe before install. Sandboxes the fix, validates integrity, and generates audit-grade evidence reports — catching supply-chain attacks before they land.',
    tags: ['Node.js', 'CLI', 'npm', 'Security', 'TypeScript'],
    link: 'https://www.npmjs.com/package/veripatch',
    github: 'https://github.com/amarjaleelbanbhan/VeriPatch',
    featured: true,
  },
  {
    title: 'MCTS — MCP Security Scanner',
    description: 'Local-first security scanner for MCP (Model Context Protocol) servers. Static and live tool discovery, multiple analyzers, auditable risk scores, and JSON/SARIF/HTML output. CI-ready, no cloud API required.',
    tags: ['Python', 'CLI', 'AI Security', 'MCP', 'SARIF', 'Static Analysis'],
    link: 'https://github.com/amarjaleelbanbhan/MCTS',
    github: 'https://github.com/amarjaleelbanbhan/MCTS',
    featured: true,
  },
  {
    title: 'CS Learning by Game',
    description: 'AI-powered computer science education engine with gamified mission progression. Interactive automata theory (DFA/NFA) visualizer, step-by-step simulation, and a companion AI that guides you through theory.',
    tags: ['Next.js', 'TypeScript', 'Monorepo', 'Automata Theory', 'AI'],
    link: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game',
    github: 'https://github.com/amarjaleelbanbhan/CS-learning-by-game',
    featured: true,
  },
  {
    title: 'TODO Tracker Pro',
    description: 'VS Code extension that surfaces every TODO, FIXME, and HACK in your codebase via a sidebar panel. Optional Gemini AI triage assigns priority and suggests a fix.',
    tags: ['TypeScript', 'VS Code API', 'Gemini AI', 'Developer Tools'],
    link: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro',
    github: 'https://github.com/amarjaleelbanbhan/todo-tracker-pro',
    featured: true,
  },
  {
    title: 'BuildSphere',
    description: 'Browser-based 3D floor planner built with React Three Fiber. Draft walls, windows, doors, and furniture in real-time. Includes save/load, undo/redo, and material selection.',
    tags: ['Next.js', 'Three.js', 'React Three Fiber', 'WebGL', 'TypeScript'],
    link: 'https://github.com/amarjaleelbanbhan/BuildSphere',
    github: 'https://github.com/amarjaleelbanbhan/BuildSphere',
    featured: true,
  },
];

// ============================================
// 🏆 ACHIEVEMENTS & CERTIFICATIONS
// ============================================
export const achievements = [
  // Google Professional Certificates
  {
    title: 'Google Cybersecurity Professional',
    organization: 'Google',
    date: 'Nov 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/specialization/MDMFD7XJJXL4',
    icon: '🔒',
  },
  {
    title: 'Google AI Essentials',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/0YL581G13RX6',
    icon: '🤖',
  },
  {
    title: 'Google Data Analytics Professional',
    organization: 'Google',
    date: '2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/specialization/W0BZT6HTJXZE',
    icon: '📊',
  },
  // Google Individual Courses
  {
    title: 'Discover the Art of Prompting',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/TUEGAHF57ZTM',
    icon: '💬',
  },
  {
    title: 'Introduction to AI',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/2D6R17WJ0GV4',
    icon: '🧠',
  },
  {
    title: 'Maximize Productivity With AI Tools',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/IFKTQQ411CQZ',
    icon: '⚡',
  },
  {
    title: 'Use AI Responsibly',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/CVLTNGKIT1XW',
    icon: '🛡️',
  },
  {
    title: 'Foundations of Cybersecurity',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/50E0LB750MEX',
    icon: '🔐',
  },
  {
    title: 'Play It Safe: Manage Security Risks',
    organization: 'Google',
    date: 'Aug 2025',
    type: 'certification',
    verifyLink: 'https://www.coursera.org/account/accomplishments/verify/2GA0972VLLSD',
    icon: '🛡️',
  },
  // Udemy Certificates
  {
    title: 'Python Bootcamp: Master Python with Real-World Projects',
    organization: 'Udemy',
    date: 'Jun 2025',
    type: 'certification',
    verifyLink: 'https://www.udemy.com/certificate/UC-ea3dcd47-fe5c-4073-b11b-15d417c0f56a/',
    icon: '🐍',
  },
  {
    title: 'HTML Fundamentals',
    organization: 'Udemy',
    date: 'Jun 2021',
    type: 'certification',
    verifyLink: 'https://www.udemy.com/certificate/UC-4c91f9fa-2aee-4eaf-8274-806cce39ca59/',
    icon: '🌐',
  },
];

// ============================================
// 💻 SKILLS
// ============================================
export const skills = {
  // Languages with proficiency percentage
  languages: [
    { name: 'Python', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'C++', level: 80 },
    { name: 'Java', level: 78 },
    { name: 'SQL', level: 80 },
    { name: 'R', level: 75 },
    { name: 'HTML/CSS', level: 88 },
  ],
  
  // Skill categories (shown as chips)
  categories: {
    'AI / Machine Learning': ['TensorFlow', 'Scikit-Learn', 'Pandas', 'NumPy'],
    'Data & Analytics': ['Tableau', 'Power BI', 'Excel', 'Google Analytics'],
    'Cybersecurity': ['Linux', 'Wireshark', 'Kali Linux', 'OWASP'],
    'Web & Cloud': ['Git', 'GitHub', 'Google Cloud', 'VS Code', 'React', 'Next.js', 'Node.js'],
  },
  
  // Currently learning
  learning: [
    'Advanced ML Algorithms & Deep Learning',
    'Cloud Security (AWS/Azure/GCP)',
    'Big Data Analytics & Visualization',
    'Advanced Cybersecurity Concepts',
  ],
};

// ============================================
// 📝 EXPERIENCE (Optional - for future)
// ============================================
export const experience = [
  // {
  //   title: 'Job Title',
  //   company: 'Company Name',
  //   period: 'Jan 2024 - Present',
  //   description: 'What you did there...',
  //   skills: ['Skill1', 'Skill2'],
  // },
];

// ============================================
// 🎓 EDUCATION
// ============================================
export const education = [
  {
    degree: 'Bachelor of Computer Science',
    school: 'Sukkur IBA University',
    period: 'Aug 2023 - Jun 2027',
    description: 'Focus on AI, Cybersecurity, and Data Analytics',
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
