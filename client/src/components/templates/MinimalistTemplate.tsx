import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  const defaultOrder = ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];
  const baseOrder = (resumeData.sectionOrder && resumeData.sectionOrder.length > 0)
    ? resumeData.sectionOrder
    : defaultOrder;
  const customIds = (resumeData.customSections || []).map((s) => s.id);
  const sectionOrder = [
    ...baseOrder,
    ...customIds.filter((id) => !baseOrder.includes(id)),
  ];

  // 1. Summary
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <p className="text-zinc-700 leading-relaxed font-light text-justify">{summary}</p>
      </section>
    );
  };

  // 2. Experience
  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-2 leading-snug`}>
          Experience
        </h2>
        <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-3.5'}>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-zinc-900">{exp.role}</span>
                  <span className="text-zinc-400">, </span>
                  <span className="text-zinc-700">{exp.company}</span>
                  {exp.location && <span className="text-zinc-400 text-xs whitespace-nowrap"> ({exp.location})</span>}
                </div>
                <span className="text-[11px] text-zinc-500 font-light shrink-0 ml-2 whitespace-nowrap text-right">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-zinc-600 font-light">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed pl-2 border-l border-zinc-200 flex items-start gap-1.5">
                      <span className="text-zinc-400 font-medium shrink-0">{bulletIcon}</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 3. Skills
  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    return (
      <section key="skills" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-1.5 leading-snug`}>
          Competencies
        </h2>
        <div className="grid grid-cols-2 gap-2 text-zinc-700 font-light text-xs">
          {skills.languages && skills.languages.length > 0 && (
            <div>
              <span className="font-normal text-zinc-900 block mb-0.5">Languages</span>
              <span className="text-zinc-500">{skills.languages.join('  •  ')}</span>
            </div>
          )}
          {skills.frameworks && skills.frameworks.length > 0 && (
            <div>
              <span className="font-normal text-zinc-900 block mb-0.5">Frameworks</span>
              <span className="text-zinc-500">{skills.frameworks.join('  •  ')}</span>
            </div>
          )}
          {skills.tools && skills.tools.length > 0 && (
            <div className="col-span-2">
              <span className="font-normal text-zinc-900 block mb-0.5">Tools & Platforms</span>
              <span className="text-zinc-500">{skills.tools.join('  •  ')}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  // 4. Projects
  const renderProjects = () => {
    if (visibleSections.projects === false || !projects || projects.length === 0) return null;
    return (
      <section key="projects" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-2 leading-snug`}>
          Selected Work
        </h2>
        <div className={isSinglePageFit ? 'space-y-2' : 'space-y-3'}>
          {projects.map((p) => (
            <div key={p.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-medium text-zinc-900 flex-1 min-w-0">{p.name}</span>
                {p.technologies && (
                  <span className="text-[11px] text-zinc-400 font-light shrink-0 ml-2 whitespace-nowrap text-right">{p.technologies.join(', ')}</span>
                )}
              </div>
              {p.description && <p className="text-zinc-600 font-light mt-0.5 text-xs">{p.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 5. Education
  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-1.5 leading-snug`}>
          Education
        </h2>
        <div className="space-y-1.5">
          {education.map((edu) => (
            <div key={edu.id} className="resume-item break-inside-avoid print:break-inside-avoid flex justify-between items-baseline gap-2">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-zinc-900">{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-zinc-500"> — {edu.institution}</span>
                {edu.location && <span className="text-zinc-400 text-xs whitespace-nowrap"> ({edu.location})</span>}
              </div>
              <span className="text-zinc-500 font-light text-xs shrink-0 ml-2 whitespace-nowrap text-right">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 6. Certifications
  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-1.5 leading-snug`}>
          Certifications
        </h2>
        <div className="space-y-1">
          {certifications.map((c) => (
            <div key={c.id} className="resume-item break-inside-avoid print:break-inside-avoid flex justify-between items-baseline gap-2 text-xs">
              <span className="font-medium text-zinc-900 flex-1 min-w-0">{c.name} — <span className="text-zinc-600 font-light">{c.issuer}</span></span>
              {c.date && <span className="text-zinc-500 font-light shrink-0 ml-2 whitespace-nowrap text-right">{c.date}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 7. Custom Section
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items?.length) return null;
    return (
      <section key={sec.id} className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-0.5 mb-1.5 leading-snug`}>
          {sec.title}
        </h2>
        <div className="space-y-1.5">
          {sec.items.map((it, idx) => (
            <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-medium text-zinc-900 flex-1 min-w-0">{it.title}</span>
                {it.date && <span className="text-zinc-500 font-light text-xs shrink-0 ml-2 whitespace-nowrap text-right">{it.date}</span>}
              </div>
              {it.subtitle && <p className="text-zinc-500 font-light text-xs">{it.subtitle}</p>}
              {it.description && <p className="text-zinc-600 font-light mt-0.5 text-xs leading-relaxed">{it.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSectionByKey = (key: string) => {
    switch (key) {
      case 'summary':
        return renderSummary();
      case 'experience':
        return renderExperience();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'education':
        return renderEducation();
      case 'certifications':
        return renderCertifications();
      default: {
        const customSec = (resumeData.customSections || []).find((s) => s.id === key);
        if (customSec) return renderCustomSection(customSec);
        return null;
      }
    }
  };

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white text-zinc-900 ${isSinglePageFit ? 'py-5 px-6 sm:py-6 sm:px-8' : 'p-8 sm:p-10'} shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Clean Minimal Header */}
      <header className={`flex flex-col sm:flex-row justify-between items-start gap-4 ${isSinglePageFit ? 'mb-4' : 'mb-6'}`}>
        <div>
          <h1 className={`${sizeClasses.h1} font-light tracking-tight text-zinc-950 uppercase`}>
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm tracking-widest text-zinc-500 uppercase mt-0.5">
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-2 font-light">
            {personalInfo.location && <span className="whitespace-nowrap">{personalInfo.location}</span>}
            {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-zinc-900 whitespace-nowrap">{personalInfo.email}</a>}
            {personalInfo.phone && <span className="whitespace-nowrap">{personalInfo.phone}</span>}
            {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-900 whitespace-nowrap">LinkedIn</a>}
            {personalInfo.github && <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 whitespace-nowrap">GitHub</a>}
          </div>
        </div>
        {theme.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-16 h-16 rounded-full object-cover border border-zinc-300 shadow-xs shrink-0"
          />
        )}
      </header>

      {/* Render Sections */}
      <div>
        {sectionOrder.map((sec) => renderSectionByKey(sec))}
      </div>
    </div>
  );
};
