import type { Profile } from './types';

export const profile: Profile = {
  name: 'Amar Jaleel',
  title: 'Software Engineer',
  headline: 'Software Engineer building product, AI, security, and systems software.',
  tagline: 'Product · AI · Security · Systems',

  university: 'Sukkur IBA University',
  degree: 'Bachelor of Computer Science',
  educationPeriod: 'Aug 2023 - Jun 2027',
  location: 'Pakistan',

  email: 'banbhanamarjalil@gmail.com',
  phone: '+92 344 443 2197',
  whatsapp: '923444432197',

  siteUrl: 'https://amarjaleel.me',
  resumeUrl: '/resume.html',

  // twitter/x removed 2026-09-18: twitter.com/ajbanbhan and x.com/ajbanbhan
  // both return 404, while a control handle returns 200 — the account does not
  // exist. Restore with the correct handle if there is one; every surface reads
  // this object, so adding the key back is all that is needed.
  social: {
    github: 'https://github.com/amarjaleelbanbhan',
    linkedin: 'https://www.linkedin.com/in/amarjaleel/',
  },
};
