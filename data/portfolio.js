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
  title: 'Full-Stack Tech Enthusiast',
  tagline: 'AI | Cybersecurity | Data Analytics',
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
    description: 'Full-Stack Zakat management platform with auth & payments.',
    tags: ['Node.js', 'TypeScript', 'React'],
    link: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    github: 'https://github.com/amarjaleelbanbhan/ZakatLink',
    image: '/projects/zakatlink.png', // Optional: add image in /public/projects/
    featured: true, // Shows on homepage
  },
  {
    title: 'Smart Notebook',
    description: 'AI-powered web app with auto-diagram generation.',
    tags: ['AI', 'Next.js', 'Mermaid.js'],
    link: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    github: 'https://github.com/amarjaleelbanbhan/Smart-Notebook',
    image: '/projects/notebook.png',
    featured: true,
  },
  {
    title: 'Bus Reservation System',
    description: 'Robust backend for transport booking.',
    tags: ['Node.js', 'SQL', 'API'],
    link: 'https://github.com/amarjaleelbanbhan/Bus-Reservation-System',
    github: 'https://github.com/amarjaleelbanbhan/Bus-Reservation-System',
    image: '/projects/bus.png',
    featured: true,
  },
  {
    title: 'EduResource Hub',
    description: 'A comprehensive web platform helping students discover 306+ free educational resources across 102+ categories with smart search and real-time filtering.',
    tags: ['JavaScript', 'HTML5', 'CSS3', 'JSON', 'GitHub Pages'],
    link: 'https://amarjaleelbanbhan.github.io/EduResource_Hub/',
    github: 'https://github.com/amarjaleelbanbhan/EduResource_Hub',
    image: '/projects/eduresource.png',
    featured: true,
  },
  {
    title: 'MediTalk - AI Voice Agent',
    description: 'AI-powered voice agent for medical consultation that analyzes symptoms and provides preliminary diagnosis using ML (85% accuracy).',
    tags: ['Python', 'Machine Learning', 'Flask', 'Streamlit', 'Docker'],
    link: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    github: 'https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent',
    image: '/projects/meditalk.png',
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
