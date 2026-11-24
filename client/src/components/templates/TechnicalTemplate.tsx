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

  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  const defaultOrder = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];
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

  // Section Renderers
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <p className="leading-relaxed text-slate-700 text-justify">{summary}</p>
      </section>
    );
  };

  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    const cols = theme.skillsColumns || 2;
    const gridColsClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';

    return (
      <section key="skills" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'} bg-slate-50 p-2.5 rounded border border-slate-200`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 mb-1.5 leading-snug">
          [01] Technical Stack Matrix
        </h2>
        <div className={`grid ${gridColsClass} gap-1.5 text-xs font-mono`}>
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
      <section key="experience" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-0.5 mb-2 leading-snug">
          [02] Work History
        </h2>
        <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-3'}>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-xs text-slate-900">{exp.role}</span>
                  <span className="text-teal-700 font-medium"> @ {exp.company}</span>
                  {exp.location && <span className="text-slate-500 text-[11px] whitespace-nowrap"> ({exp.location})</span>}
                </div>
                <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-0.5 space-y-0.5 text-slate-700">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-teal-600 font-mono text-[10px] mt-0.5 shrink-0">{bulletIcon}</span>
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
      <section key="projects" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-0.5 mb-2 leading-snug">
          [03] Open Source & Systems Architecture
        </h2>
        <div className={isSinglePageFit ? 'space-y-2' : 'space-y-2.5'}>
          {projects.map((proj) => (
            <div key={proj.id} className="resume-item break-inside-avoid print:break-inside-avoid border-l-2 border-teal-500 pl-2.5">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-xs text-slate-900 flex-1 min-w-0">{proj.name}</span>
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noreferrer" className="text-[11px] font-mono text-teal-700 underline shrink-0 ml-2 whitespace-nowrap">
                    github_repo ↗
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                  Stack: {proj.technologies.join(' / ')}
                </p>
              )}
              {proj.description && <p className="text-slate-700 mt-0.5 text-xs">{proj.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-0.5 mb-1.5 leading-snug">
          [04] Education & Credentials
        </h2>
        <div className="space-y-1 text-xs">
          {education.map((edu) => (
            <div key={edu.id} className="resume-item break-inside-avoid print:break-inside-avoid flex justify-between items-baseline gap-2">
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-slate-600"> — {edu.institution}</span>
                {edu.location && <span className="text-slate-500 text-[11px] whitespace-nowrap"> ({edu.location})</span>}
              </div>
              <span className="font-mono text-slate-500 text-[11px] shrink-0 ml-2 whitespace-nowrap text-right">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-200 pb-0.5 mb-1.5 leading-snug">
          [05] Licenses & Certifications
        </h2>
        <div className="space-y-1 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="resume-item break-inside-avoid print:break-inside-avoid flex justify-between items-baseline gap-2 text-slate-700">
              <span className="flex-1 min-w-0">{c.name} — {c.issuer}</span>
              <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">{c.date}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Render Custom Section (Terminal style)
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items || sec.items.length === 0) return null;
    return (
      <section key={sec.id} className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-700 border-b border-slate-300 pb-0.5 mb-1.5 leading-snug">
          $ {sec.title.toLowerCase().replace(/\s+/g, '-')}
        </h2>
        <div className="space-y-1.5 text-xs">
          {sec.items.map((it: any, idx: number) => (
            <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid font-mono">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900 flex-1 min-w-0">&gt; {it.title}</span>
                {it.date && <span className="text-[11px] text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">[{it.date}]</span>}
              </div>
              {it.subtitle && <p className="text-slate-600 pl-3"># {it.subtitle}</p>}
              {it.description && <p className="text-slate-700 pl-3 mt-0.5 leading-relaxed">{it.description}</p>}
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
      className={`w-full max-w-[800px] mx-auto bg-white text-slate-900 ${isSinglePageFit ? 'py-5 px-6 sm:py-6 sm:px-8' : 'p-7 sm:p-8'} shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Terminal Style Header Bar */}
      <header className={`border-b-2 ${isSinglePageFit ? 'pb-3 mb-3' : 'pb-4 mb-4'}`} style={{ borderColor: theme.primaryColor }}>
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {theme.showPhoto && personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-14 h-14 rounded-lg object-cover border-2 border-teal-600 shadow-xs shrink-0"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-teal-600 shrink-0" />
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
          </div>
          <div className="flex flex-col text-right text-xs font-mono text-slate-600 space-y-0.5 shrink-0">
            {personalInfo.email && (
              <div className="flex items-center justify-end gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline whitespace-nowrap">{personalInfo.email}</a>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center justify-end gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="whitespace-nowrap">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center justify-end gap-1">
                <Github className="w-3 h-3 text-slate-400" />
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline whitespace-nowrap">{personalInfo.github.replace('https://', '')}</a>
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
          <div className="md:col-span-4 space-y-3.5 border-r border-slate-200 pr-3">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-8 space-y-3.5">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : layoutMode === 'two-column-right' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
          <div className="md:col-span-8 space-y-3.5 border-r border-slate-200 pr-3">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="md:col-span-4 space-y-3.5">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      ) : (
        /* Equal 50/50 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div className="space-y-3.5 border-r border-slate-200 pr-3">
            {leftSections.map((sec) => renderSectionByKey(sec))}
          </div>
          <div className="space-y-3.5">
            {rightSections.map((sec) => renderSectionByKey(sec))}
          </div>
        </div>
      )}
    </div>
  );
};
