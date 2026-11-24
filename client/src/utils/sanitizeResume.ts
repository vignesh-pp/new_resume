import { ResumeSchema } from '../types/resume';

/**
 * Sanitizes and normalizes any resume data object to guarantee it strictly
 * complies with ResumeSchema, preventing any undefined.map(), undefined.join()
 * or blank-page rendering crashes.
 */
export function sanitizeResumeData(raw: any): ResumeSchema {
  if (!raw || typeof raw !== 'object') {
    return createEmptyResume();
  }

  const pInfo = raw.personalInfo || {};
  const skills = raw.skills || {};

  return {
    personalInfo: {
      fullName: String(pInfo.fullName || 'Alex Rivera').trim(),
      jobTitle: String(pInfo.jobTitle || 'Full Stack Engineer').trim(),
      email: String(pInfo.email || '').trim(),
      phone: String(pInfo.phone || '').trim(),
      location: String(pInfo.location || '').trim(),
      website: pInfo.website ? String(pInfo.website).trim() : '',
      linkedin: pInfo.linkedin ? String(pInfo.linkedin).trim() : '',
      github: pInfo.github ? String(pInfo.github).trim() : '',
      photoUrl: pInfo.photoUrl ? String(pInfo.photoUrl) : undefined,
    },
    summary: String(raw.summary || ''),
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((exp: any, idx: number) => ({
          id: String(exp?.id || `exp-${idx}-${Date.now()}`),
          company: String(exp?.company || 'Company'),
          role: String(exp?.role || 'Role'),
          location: exp?.location ? String(exp.location) : '',
          startDate: String(exp?.startDate || '2022'),
          endDate: String(exp?.endDate || 'Present'),
          current: Boolean(exp?.current),
          bullets: Array.isArray(exp?.bullets)
            ? exp.bullets.map((b: any) => String(b || '')).filter(Boolean)
            : [],
        }))
      : [],
    education: Array.isArray(raw.education)
      ? raw.education.map((edu: any, idx: number) => ({
          id: String(edu?.id || `edu-${idx}-${Date.now()}`),
          institution: String(edu?.institution || 'University'),
          degree: String(edu?.degree || 'Degree'),
          fieldOfStudy: String(edu?.fieldOfStudy || 'Field of Study'),
          location: edu?.location ? String(edu.location) : '',
          startDate: String(edu?.startDate || '2018'),
          endDate: String(edu?.endDate || '2022'),
          gpa: edu?.gpa ? String(edu.gpa) : undefined,
          highlights: Array.isArray(edu?.highlights)
            ? edu.highlights.map((h: any) => String(h || '')).filter(Boolean)
            : [],
        }))
      : [],
    skills: {
      technical: Array.isArray(skills.technical)
        ? skills.technical.map((s: any) => String(s || '')).filter(Boolean)
        : [],
      languages: Array.isArray(skills.languages)
        ? skills.languages.map((s: any) => String(s || '')).filter(Boolean)
        : [],
      frameworks: Array.isArray(skills.frameworks)
        ? skills.frameworks.map((s: any) => String(s || '')).filter(Boolean)
        : [],
      tools: Array.isArray(skills.tools)
        ? skills.tools.map((s: any) => String(s || '')).filter(Boolean)
        : [],
      softSkills: Array.isArray(skills.softSkills)
        ? skills.softSkills.map((s: any) => String(s || '')).filter(Boolean)
        : [],
    },
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((proj: any, idx: number) => ({
          id: String(proj?.id || `proj-${idx}-${Date.now()}`),
          name: String(proj?.name || 'Project Name'),
          description: String(proj?.description || ''),
          role: proj?.role ? String(proj.role) : undefined,
          technologies: Array.isArray(proj?.technologies)
            ? proj.technologies.map((t: any) => String(t || '')).filter(Boolean)
            : [],
          url: proj?.url ? String(proj.url) : undefined,
          github: proj?.github ? String(proj.github) : undefined,
          bullets: Array.isArray(proj?.bullets)
            ? proj.bullets.map((b: any) => String(b || '')).filter(Boolean)
            : [],
        }))
      : [],
    certifications: Array.isArray(raw.certifications)
      ? raw.certifications.map((cert: any, idx: number) => ({
          id: String(cert?.id || `cert-${idx}-${Date.now()}`),
          name: String(cert?.name || 'Certification'),
          issuer: String(cert?.issuer || 'Issuer'),
          date: String(cert?.date || '2023'),
          url: cert?.url ? String(cert.url) : undefined,
        }))
      : [],
    customSections: Array.isArray(raw.customSections)
      ? raw.customSections.map((sec: any, idx: number) => ({
          id: String(sec?.id || `custom-${idx}`),
          title: String(sec?.title || 'Custom Section'),
          items: Array.isArray(sec?.items)
            ? sec.items.map((it: any) => ({
                title: String(it?.title || 'Item Title'),
                subtitle: it?.subtitle ? String(it.subtitle) : undefined,
                date: it?.date ? String(it.date) : undefined,
                description: it?.description ? String(it.description) : undefined,
                bullets: Array.isArray(it?.bullets)
                  ? it.bullets.map((b: any) => String(b || '')).filter(Boolean)
                  : [],
              }))
            : [],
        }))
      : [],
    sectionOrder: Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0
      ? raw.sectionOrder.map((s: any) => String(s))
      : ['personal', 'summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    visibleSections: raw.visibleSections && typeof raw.visibleSections === 'object'
      ? { ...raw.visibleSections }
      : {
          summary: true,
          experience: true,
          projects: true,
          skills: true,
          education: true,
          certifications: true,
        },
    sectionTitles: raw.sectionTitles && typeof raw.sectionTitles === 'object'
      ? { ...raw.sectionTitles }
      : {},
  };
}

export function createEmptyResume(): ResumeSchema {
  return {
    personalInfo: {
      fullName: 'Alex Rivera',
      jobTitle: 'Senior Full Stack & Cloud Architect',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com/in/alexrivera-tech',
      github: 'https://github.com/alexrivera-io',
      website: 'https://alexrivera.dev',
    },
    summary: 'Senior Software Engineer with 7+ years of experience architecting resilient distributed cloud applications.',
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: ['TypeScript', 'JavaScript', 'Python', 'Go'],
      frameworks: ['React', 'Node.js', 'Express', 'FastAPI'],
      tools: ['Docker', 'Kubernetes', 'AWS', 'PostgreSQL'],
      softSkills: ['Team Leadership', 'System Design', 'Agile/Scrum'],
    },
    projects: [],
    certifications: [],
    customSections: [],
    sectionOrder: ['personal', 'summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    visibleSections: {
      summary: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      certifications: true,
    },
    sectionTitles: {},
  };
}
