import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const ClassicAtsTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  const spacingClass = {
    'compact': 'space-y-2',
    'normal': isSinglePageFit ? 'space-y-2.5' : 'space-y-3.5',
    'spacious': 'space-y-5',
  }[theme.spacing] || (isSinglePageFit ? 'space-y-2.5' : 'space-y-3.5');

  const defaultOrder = ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];
  const baseOrder = (resumeData.sectionOrder && resumeData.sectionOrder.length > 0)
    ? resumeData.sectionOrder
    : defaultOrder;
  const customIds = (resumeData.customSections || []).map((s) => s.id);
  const sectionOrder = [
    ...baseOrder,
    ...customIds.filter((id) => !baseOrder.includes(id)),
  ];

  const leftSections = theme.leftSections || ['skills', 'education', 'certifications'];
  const rightSections = theme.rightSections || ['summary', 'experience', 'projects'];
  const layoutMode = theme.layoutMode || 'single-column';

  // 1. Render Summary
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className="resume-section break-inside-avoid print:break-inside-avoid">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-1.5 leading-snug`} style={{ color: theme.primaryColor }}>
          Professional Summary
        </h2>
        <p className="text-gray-800 text-justify leading-relaxed">{summary}</p>
      </section>
    );
  };

  // 2. Render Experience
  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className="resume-section">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-2 leading-snug`} style={{ color: theme.primaryColor }}>
          Work Experience
        </h2>
        <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-3.5'}>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">{exp.role}</span>
                  <span className="text-gray-700"> — {exp.company}</span>
                  {exp.location && <span className="text-xs text-gray-500 whitespace-nowrap"> ({exp.location})</span>}
                </div>
                <span className="text-xs text-gray-600 font-medium shrink-0 ml-2 whitespace-nowrap text-right">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`mt-1 text-gray-800 ${isSinglePageFit ? 'space-y-0.5' : 'space-y-1'}`}>
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className={`flex items-start gap-1.5 ${isSinglePageFit ? 'leading-snug' : 'leading-relaxed'}`}>
                      <span className="text-gray-500 font-bold shrink-0 mt-0.5">{bulletIcon}</span>
                      <span>{bullet}</span>
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

  // 3. Render Skills (Respecting skillsColumns)
  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    const cols = theme.skillsColumns || 2;
    const gridColsClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

    return (
      <section key="skills" className="resume-section break-inside-avoid print:break-inside-avoid">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-1.5 leading-snug`} style={{ color: theme.primaryColor }}>
          Skills & Competencies
        </h2>
        <div className={`grid ${gridColsClass} gap-x-4 gap-y-1.5 text-gray-800 leading-snug`}>
          {skills.languages && skills.languages.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Languages: </span>
              <span>{skills.languages.join(', ')}</span>
            </div>
          )}
          {skills.frameworks && skills.frameworks.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Frameworks: </span>
              <span>{skills.frameworks.join(', ')}</span>
            </div>
          )}
          {skills.tools && skills.tools.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Cloud & Tools: </span>
              <span>{skills.tools.join(', ')}</span>
            </div>
          )}
          {skills.softSkills && skills.softSkills.length > 0 && (
            <div>
              <span className="font-bold text-gray-900">Competencies: </span>
              <span>{skills.softSkills.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  // 4. Render Projects
  const renderProjects = () => {
    if (visibleSections.projects === false || !projects || projects.length === 0) return null;
    return (
      <section key="projects" className="resume-section">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-2 leading-snug`} style={{ color: theme.primaryColor }}>
          Projects
        </h2>
        <div className={isSinglePageFit ? 'space-y-2' : 'space-y-2.5'}>
          {projects.map((proj) => (
            <div key={proj.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">{proj.name}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-xs text-gray-600"> | {proj.technologies.join(', ')}</span>
                  )}
                </div>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs underline text-gray-700 shrink-0 ml-2 whitespace-nowrap">
                    View Project
                  </a>
                )}
              </div>
              {proj.description && <p className="text-xs text-gray-700 mt-0.5 leading-snug">{proj.description}</p>}
              {proj.bullets && proj.bullets.length > 0 && (
                <ul className={`mt-1 text-gray-800 ${isSinglePageFit ? 'space-y-0.5' : 'space-y-1'}`}>
                  {proj.bullets.map((b, idx) => (
                    <li key={idx} className={`flex items-start gap-1.5 ${isSinglePageFit ? 'leading-snug' : 'leading-relaxed'}`}>
                      <span className="text-gray-500 font-bold shrink-0 mt-0.5">{bulletIcon}</span>
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

  // 5. Render Education
  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className="resume-section break-inside-avoid print:break-inside-avoid">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-2 leading-snug`} style={{ color: theme.primaryColor }}>
          Education
        </h2>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-gray-700"> — {edu.institution}</span>
                  {edu.location && <span className="text-xs text-gray-500 whitespace-nowrap"> ({edu.location})</span>}
                </div>
                <span className="text-xs text-gray-600 font-medium shrink-0 ml-2 whitespace-nowrap text-right">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-xs text-gray-600 mt-0.5">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 6. Render Certifications
  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className="resume-section break-inside-avoid print:break-inside-avoid">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-1.5 leading-snug`} style={{ color: theme.primaryColor }}>
          Certifications
        </h2>
        <ul className="space-y-1 text-gray-800">
          {certifications.map((cert) => (
            <li key={cert.id} className="resume-item flex items-start gap-1.5 leading-snug break-inside-avoid print:break-inside-avoid">
              <span className="text-gray-500 font-bold shrink-0 mt-0.5">{bulletIcon}</span>
              <span className="flex-1">
                <strong className="font-semibold text-gray-900">{cert.name}</strong>
                <span className="text-gray-700"> — {cert.issuer}</span>
                {cert.date && <span className="text-gray-600 whitespace-nowrap"> ({cert.date})</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  // 7. Render Custom Section
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items || sec.items.length === 0) return null;
    return (
      <section key={sec.id} className="resume-section break-inside-avoid print:break-inside-avoid">
        <h2 className={`${sizeClasses.h2} font-bold tracking-wider uppercase border-b-[1.5px] border-gray-800 pb-0.5 mb-1.5 leading-snug`} style={{ color: theme.primaryColor }}>
          {sec.title}
        </h2>
        <div className="space-y-2">
          {sec.items.map((it: any, idx: number) => (
            <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-4">
                <span className="font-bold text-gray-900 flex-1">{it.title}</span>
                {it.date && <span className="text-xs text-gray-600 font-medium shrink-0 whitespace-nowrap ml-2">{it.date}</span>}
              </div>
              {it.subtitle && <p className="text-xs text-gray-700 italic">{it.subtitle}</p>}
              {it.description && <p className="text-xs text-gray-800 mt-0.5 leading-relaxed">{it.description}</p>}
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
      className={`w-full max-w-[800px] mx-auto bg-white text-gray-900 ${isSinglePageFit ? 'py-5 px-6 sm:py-6 sm:px-8' : 'p-7 sm:p-8'} shadow-sm ${sizeClasses.body} ${spacingClass} print:p-0 print:shadow-none`}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-2 sm:pb-2.5 border-gray-400 gap-4 mb-1">
        <div className="flex-1 text-center">
          <h1 
            className={`${sizeClasses.h1} font-bold tracking-tight uppercase`}
            style={{ color: theme.primaryColor }}
          >
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm font-medium text-gray-700 mt-0.5">{personalInfo.jobTitle}</p>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-2.5 text-xs text-gray-600 mt-1.5">
            {personalInfo.location && <span className="whitespace-nowrap">{personalInfo.location}</span>}
            {personalInfo.phone && <span className="whitespace-nowrap">• {personalInfo.phone}</span>}
            {personalInfo.email && (
              <span className="whitespace-nowrap">
                • <a href={`mailto:${personalInfo.email}`} className="text-gray-900 underline">{personalInfo.email}</a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="whitespace-nowrap">
                • <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-gray-900 underline">LinkedIn</a>
              </span>
            )}
            {personalInfo.github && (
              <span className="whitespace-nowrap">
                • <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-gray-900 underline">GitHub</a>
              </span>
            )}
            {personalInfo.website && (
              <span className="whitespace-nowrap">
                • <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-gray-900 underline">Portfolio</a>
              </span>
            )}
          </div>
        </div>
        {theme.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-16 h-16 rounded-xl object-cover border border-gray-300 shadow-xs shrink-0"
          />
        )}
      </header>

      {/* Main Body - Row vs Column Layout */}
      {layoutMode === 'single-column' ? (
        <div className={spacingClass}>
          {theme.sideBySideEducationCert ? (
            <>
              {sectionOrder
                .filter((s) => s !== 'education' && s !== 'certifications')
                .map((sec) => renderSectionByKey(sec))}
              
              {/* Dual Column Row for Education & Certifications */}
              {(visibleSections.education !== false || visibleSections.certifications !== false) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>{renderEducation()}</div>
                  <div>{renderCertifications()}</div>
                </div>
              )}
            </>
          ) : (
            sectionOrder.map((sec) => renderSectionByKey(sec))
          )}
        </div>
      ) : layoutMode === 'two-column-left' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-4 space-y-4 border-r border-gray-200 pr-4">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-8 space-y-4">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : layoutMode === 'two-column-right' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-8 space-y-4 border-r border-gray-200 pr-4">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-4 space-y-4">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : (
        /* Equal 50/50 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4 border-r border-gray-200 pr-4">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="space-y-4">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      )}
    </div>
  );
};
