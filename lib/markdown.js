import fs from 'fs';
import path from 'path';

/**
 * Parse sections from data.md
 * Returns structured data for projects, skills, certifications, etc.
 */
export function getPortfolioData() {
  const filePath = path.join(process.cwd(), 'data.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return content;
}

/**
 * Extract projects from markdown
 */
export function getProjects() {
  const content = getPortfolioData();
  
  // Simple regex to find project sections
  const projectMatches = content.match(/###\s+(.+?)\n([\s\S]+?)(?=###|---|\n##|$)/g) || [];
  
  return projectMatches.map((block) => {
    const titleMatch = block.match(/###\s+(.+)/);
    const descMatch = block.match(/\n([^*\n]+?)(?=\n\*\*|$)/);
    const techMatch = block.match(/\*\*Technologies\*\*:\s*(.+)/);
    const linkMatch = block.match(/\*\*Link\*\*:\s*\[.+?\]\((.+?)\)/);
    
    return {
      title: titleMatch?.[1]?.trim() || 'Untitled',
      description: descMatch?.[1]?.trim() || '',
      tags: techMatch?.[1]?.split(',').map(t => t.trim()) || [],
      link: linkMatch?.[1] || '#',
    };
  });
}

/**
 * Extract skills from markdown
 */
export function getSkills() {
  const content = getPortfolioData();
  
  const skillsSection = content.match(/## Skills([\s\S]+?)(?=\n##|$)/)?.[1] || '';
  const skillMatches = skillsSection.match(/\*\*(.+?)\*\*\s*-\s*(\d+)%/g) || [];
  
  return skillMatches.map((match) => {
    const parts = match.match(/\*\*(.+?)\*\*\s*-\s*(\d+)%/);
    return {
      label: parts?.[1] || '',
      level: parseInt(parts?.[2] || '0', 10),
    };
  });
}

/**
 * Extract certifications from markdown
 */
export function getCertifications() {
  const content = getPortfolioData();
  
  const certSection = content.match(/## Certifications([\s\S]+?)(?=\n##|$)/)?.[1] || '';
  const certMatches = certSection.match(/###\s+(.+?)\n\*\*(.+?)\*\*\s*-\s*(\d{4})/g) || [];
  
  return certMatches.map((match) => {
    const parts = match.match(/###\s+(.+?)\n\*\*(.+?)\*\*\s*-\s*(\d{4})/);
    return {
      name: parts?.[1] || '',
      org: parts?.[2] || '',
      year: parts?.[3] || '',
    };
  });
}
