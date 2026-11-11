import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { Terminal, Github, Globe, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
  const sectionOrder = (resumeData.sectionOrder && resumeData.sectionOrder.length > 0)
    ? resumeData.sectionOrder
    : defaultOrder;

  const leftSections = theme.leftSections || ['skills', 'education', 'certifications'];
  const rightSections = theme.rightSections || ['summary', 'experience', 'projects'];
  const layoutMode = theme.layoutMode || 'single-column';

  // Section Renderers
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className="mb-4">
        <p className="leading-relaxed text-slate-700">{summary}</p>
      </section>
    );
  };

  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    const cols = theme.skillsColumns || 2;
    const gridColsClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

    return (
      <section key="skills" className="mb-4 bg-slate-50 p-3 rounded border border-slate-200">
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 mb-2">
          [01] Technical Stack Matrix
        </h2>
        <div className={`grid ${gridColsClass} gap-2 text-xs font-mono`}>
          {skills.languages && skills.languages.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Languages: </span>
              <span className="text-slate-600">{skills.languages.join(', ')}</span>
            </div>
          )}
          {skills.frameworks && skills.frameworks.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Frameworks: </span>
              <span className="text-slate-600">{skills.frameworks.join(', ')}</span>
            </div>
          )}
          {skills.tools && skills.tools.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Cloud & Tools: </span>
              <span className="text-slate-600">{skills.tools.join(', ')}</span>
            </div>
          )}
          {skills.technical && skills.technical.length > 0 && (
            <div>
              <span className="font-bold text-slate-800">Concepts: </span>
              <span className="text-slate-600">{skills.technical.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className="mb-4">
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-1 mb-2.5">
          [02] Work History
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                  <span className="text-teal-700 font-medium"> @ {exp.company}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-1 text-slate-700">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal-600 font-mono text-[10px] mt-0.5">{bulletIcon}</span>
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

  const renderProjects = () => {
    if (visibleSections.projects === false || !projects || projects.length === 0) return null;
    return (
      <section key="projects" className="mb-4">
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-1 mb-2.5">
          [03] Open Source & Systems Architecture
        </h2>
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id} className="border-l-2 border-teal-500 pl-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs text-slate-900">{proj.name}</span>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-teal-700 underline">
                    github_repo ↗
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Stack: {proj.technologies.join(' / ')}
                </p>
              )}
              {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className="mb-4">
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-1 mb-2">
          [04] Education & Credentials
        </h2>
        <div className="space-y-1.5 text-xs">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline">
              <div>
                <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-slate-600"> — {edu.institution}</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className="mb-4">
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-1 mb-2">
          [05] Licenses & Certifications
        </h2>
        <div className="space-y-1 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline text-slate-700">
              <span>{c.name} — {c.issuer}</span>
              <span className="font-mono text-[11px] text-slate-500">{c.date}</span>
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
      case 'skills':
        return renderSkills();
      case 'experience':
        return renderExperience();
      case 'projects':
        return renderProjects();
      case 'education':
        return renderEducation();
      case 'certifications':
        return renderCertifications();
      default:
        return null;
    }
  };

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Terminal Style Header Bar */}
      <header className="border-b-2 pb-4 mb-4" style={{ borderColor: theme.primaryColor }}>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-600" />
              <h1 className={`${sizeClasses.h1} font-bold tracking-tight text-slate-950 font-mono`}>
                {personalInfo.fullName}
              </h1>
            </div>
            {personalInfo.jobTitle && (
              <p className="text-xs font-semibold text-slate-600 font-mono mt-0.5">
                // {personalInfo.jobTitle}
              </p>
            )}
          </div>
          <div className="flex flex-col text-right text-xs font-mono text-slate-600 space-y-0.5">
            {personalInfo.email && (
              <div className="flex items-center justify-end gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center justify-end gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center justify-end gap-1">
                <Github className="w-3 h-3 text-slate-400" />
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github.replace('https://', '')}</a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Row vs Column Body */}
      {layoutMode === 'single-column' ? (
        <div>
          {sectionOrder.map((sec) => renderSectionByKey(sec))}
        </div>
      ) : layoutMode === 'two-column-left' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-4 space-y-4 border-r border-slate-200 pr-4">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-8 space-y-4">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : layoutMode === 'two-column-right' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-8 space-y-4 border-r border-slate-200 pr-4">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-4 space-y-4">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : (
        /* Equal 50/50 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4 border-r border-slate-200 pr-4">
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
