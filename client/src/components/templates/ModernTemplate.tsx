import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';
import { DraggableSection } from '../preview/DraggableSection';
import { getSectionTitle } from '../../utils/sectionTitles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
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

  const leftSections = theme.leftSections || ['skills', 'education', 'certifications'];
  const rightSections = theme.rightSections || ['summary', 'experience', 'projects'];
  const layoutMode = theme.layoutMode || 'single-column';

  // Section Renderers
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'summary', 'About Me')}
          </h2>
        </div>
        <p className="leading-relaxed text-slate-600 pl-4 border-l-2 border-slate-100">{summary}</p>
      </section>
    );
  };

  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className={`resume-section ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'experience', 'Experience')}
          </h2>
        </div>
        <div className={`pl-4 border-l-2 border-slate-100 ${isSinglePageFit ? 'space-y-2.5' : 'space-y-4'}`}>
          {experience.map((exp) => (
            <div key={exp.id} className="relative resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{exp.role}</h3>
                  <p className="text-xs font-semibold" style={{ color: theme.primaryColor }}>
                    {exp.company} {exp.location && <span className="text-slate-400 font-normal whitespace-nowrap">| {exp.location}</span>}
                  </p>
                </div>
                <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0 whitespace-nowrap ml-2">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`mt-1.5 text-slate-600 ${isSinglePageFit ? 'space-y-0.5' : 'space-y-1'}`}>
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${isSinglePageFit ? 'leading-snug' : 'leading-relaxed'}`}>
                      <span className="text-slate-400 font-bold mt-0.5">{bulletIcon}</span>
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

  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    return (
      <section key="skills" className="mt-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'skills', 'Skills & Tech Stack')}
          </h2>
        </div>
        <div className="pl-4 border-l-2 border-slate-100 space-y-2 text-xs">
          {skills.languages && skills.languages.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700 w-24">Languages:</span>
              {skills.languages.map((l, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                  {l}
                </span>
              ))}
            </div>
          )}
          {skills.frameworks && skills.frameworks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700 w-24">Frameworks:</span>
              {skills.frameworks.map((f, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                  {f}
                </span>
              ))}
            </div>
          )}
          {skills.tools && skills.tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-slate-700 w-24">Cloud & Tools:</span>
              {skills.tools.map((t, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (visibleSections.projects === false || !projects || projects.length === 0) return null;
    return (
      <section key="projects" className={`resume-section ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'projects', 'Featured Projects')}
          </h2>
        </div>
        <div className={`pl-4 border-l-2 border-slate-100 ${isSinglePageFit ? 'space-y-2' : 'space-y-3'}`}>
          {projects.map((p) => (
            <div key={p.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                  {p.technologies && p.technologies.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-normal">
                      ({p.technologies.join(', ')})
                    </span>
                  )}
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-xs font-medium hover:underline shrink-0 ml-2 whitespace-nowrap" style={{ color: theme.primaryColor }}>
                    Live Demo ↗
                  </a>
                )}
              </div>
              {p.description && <p className="text-slate-600 mt-0.5 leading-snug text-xs">{p.description}</p>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'education', 'Education')}
          </h2>
        </div>
        <div className="space-y-2 pl-4 border-l-2 border-slate-100">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start text-xs gap-3 resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-slate-600"> — {edu.institution}</span>
              </div>
              <span className="text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>
            {getSectionTitle(resumeData, 'certifications', 'Certifications')}
          </h2>
        </div>
        <div className="space-y-1.5 pl-4 border-l-2 border-slate-100 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline gap-3 resume-item break-inside-avoid print:break-inside-avoid">
              <span className="font-semibold text-slate-800 flex-1 min-w-0">{c.name}</span>
              <span className="text-slate-500 text-[11px] shrink-0 ml-2 whitespace-nowrap">{c.issuer} ({c.date})</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 7. Custom Section Renderer
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items || sec.items.length === 0) return null;
    return (
      <section key={sec.id} className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mt-2.5' : 'mt-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900`}>{sec.title}</h2>
        </div>
        <div className="space-y-2.5 pl-4 border-l-2 border-slate-100">
          {sec.items.map((it: any, idx: number) => (
            <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-3">
                <h3 className="font-bold text-slate-900 flex-1 min-w-0">{it.title}</h3>
                {it.date && <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0 ml-2 whitespace-nowrap">{it.date}</span>}
              </div>
              {it.subtitle && <p className="text-xs font-semibold" style={{ color: theme.primaryColor }}>{it.subtitle}</p>}
              {it.description && <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{it.description}</p>}
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
      className={`w-full max-w-[800px] mx-auto bg-white text-slate-800 ${isSinglePageFit ? 'py-5 px-6 sm:py-6 sm:px-8' : 'p-7 sm:p-8'} shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Top accent line */}
      <div className={`h-1.5 w-full rounded-full ${isSinglePageFit ? 'mb-4' : 'mb-6'}`} style={{ backgroundColor: theme.primaryColor }} />

      {/* Modern Header */}
      <header className={`flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 ${isSinglePageFit ? 'pb-3' : 'pb-5'}`}>
        <div className="flex items-center gap-4">
          {theme.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100 shrink-0"
            />
          )}
          <div>
            <h1 className={`${sizeClasses.h1} font-extrabold tracking-tight text-slate-900`}>
              {personalInfo.fullName}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-sm font-semibold mt-1" style={{ color: theme.primaryColor }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 sm:text-right">
          {personalInfo.email && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center sm:justify-end gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Row vs Column Body */}
      {layoutMode === 'single-column' ? (
        <div className="space-y-2">
          {sectionOrder.map((sec, idx) => (
            <DraggableSection key={sec} sectionId={sec} index={idx} total={sectionOrder.length}>
              {renderSectionByKey(sec)}
            </DraggableSection>
          ))}
        </div>
      ) : layoutMode === 'two-column-left' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-4 space-y-4 border-r border-slate-100 pr-4">
            {leftSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={leftSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
          <div className="md:col-span-8 space-y-4">
            {rightSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={rightSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
        </div>
      ) : layoutMode === 'two-column-right' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          <div className="md:col-span-8 space-y-4 border-r border-slate-100 pr-4">
            {rightSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={rightSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
          <div className="md:col-span-4 space-y-4">
            {leftSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={leftSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
        </div>
      ) : (
        /* Equal 50/50 Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4 border-r border-slate-100 pr-4">
            {leftSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={leftSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
          <div className="space-y-4">
            {rightSections.map((sec, idx) => (
              <DraggableSection key={sec} sectionId={sec} index={idx} total={rightSections.length}>
                {renderSectionByKey(sec)}
              </DraggableSection>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
