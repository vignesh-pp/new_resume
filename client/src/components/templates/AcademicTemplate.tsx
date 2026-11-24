import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { useResumeStore } from '../../store/useResumeStore';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';
import { DraggableSection } from '../preview/DraggableSection';
import { getSectionTitle } from '../../utils/sectionTitles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { focusSection } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  const defaultOrder = ['summary', 'education', 'experience', 'projects', 'certifications'];
  const baseOrder = (resumeData.sectionOrder && resumeData.sectionOrder.length > 0)
    ? resumeData.sectionOrder
    : defaultOrder;
  const customIds = (resumeData.customSections || []).map((s) => s.id);
  const sectionOrder = [
    ...baseOrder,
    ...customIds.filter((id) => !baseOrder.includes(id)),
  ];

  // 1. Research Statement / Summary
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'summary', 'Research Statement & Academic Focus')}
        </h2>
        <p className="leading-relaxed text-justify text-gray-800">{summary}</p>
      </section>
    );
  };

  // 2. Education & Degrees
  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'education', 'Education')}
        </h2>
        <div className="space-y-1.5">
          {education.map((edu) => (
            <div key={edu.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-950">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-gray-800">, {edu.institution}</span>
                  {edu.location && <span className="text-gray-500 italic whitespace-nowrap"> ({edu.location})</span>}
                </div>
                <span className="text-gray-600 font-sans text-[11px] shrink-0 ml-2 whitespace-nowrap text-right">{edu.startDate} – {edu.endDate}</span>
              </div>
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="mt-0.5 text-xs text-gray-700 space-y-0.5">
                  {edu.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-gray-500 font-bold shrink-0">{bulletIcon}</span>
                      <span>{h}</span>
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

  // 3. Appointments & Research Experience
  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'experience', 'Appointments & Research Experience')}
        </h2>
        <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-3'}>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2 text-xs">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-950">{exp.role}</span>
                  <span className="text-gray-800">, {exp.company}</span>
                  {exp.location && <span className="text-gray-500 italic whitespace-nowrap"> ({exp.location})</span>}
                </div>
                <span className="text-gray-600 font-sans text-[11px] shrink-0 ml-2 whitespace-nowrap text-right">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-gray-800">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-relaxed flex items-start gap-1.5">
                      <span className="text-gray-500 font-bold shrink-0">{bulletIcon}</span>
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

  // 4. Publications / Projects
  const renderProjects = () => {
    if (visibleSections.projects === false || !projects || projects.length === 0) return null;
    return (
      <section key="projects" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'projects', 'Publications & Working Papers')}
        </h2>
        <div className="space-y-1.5 text-xs">
          {projects.map((p) => (
            <div key={p.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <span className="font-bold text-gray-950">{p.name}. </span>
              <span className="text-gray-800 italic">{p.description} </span>
              {p.technologies && <span className="text-gray-600">[{p.technologies.join(', ')}].</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 5. Fellowships, Grants & Honors
  const renderCertifications = () => {
    if (visibleSections.certifications !== false && certifications && certifications.length > 0) {
      return (
        <section key="certifications" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
            {getSectionTitle(resumeData, 'certifications', 'Grants, Fellowships & Honors')}
          </h2>
          <ul className="space-y-1 text-gray-800 text-xs">
            {certifications.map((c) => (
              <li key={c.id} className="resume-item break-inside-avoid print:break-inside-avoid flex items-start gap-1.5">
                <span className="text-gray-500 font-bold shrink-0">{bulletIcon}</span>
                <span className="flex-1 min-w-0">
                  <strong className="font-semibold">{c.name}</strong>, {c.issuer} <span className="whitespace-nowrap">({c.date})</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      );
    }
    return null;
  };

  // 6. Custom Sections
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items?.length) return null;
    return (
      <section key={sec.id} className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, sec.id, sec.title)}
        </h2>
        <div className="space-y-1.5 text-xs text-gray-800">
          {sec.items.map((it, idx) => (
            <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-gray-950 flex-1 min-w-0">{it.title}</span>
                {it.date && <span className="text-gray-600 shrink-0 ml-2 whitespace-nowrap text-right">({it.date})</span>}
              </div>
              {it.subtitle && <p className="italic text-gray-700">{it.subtitle}</p>}
              {it.description && <p className="text-gray-800 mt-0.5 leading-relaxed">{it.description}</p>}
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
      case 'education':
        return renderEducation();
      case 'experience':
        return renderExperience();
      case 'projects':
        return renderProjects();
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
      className={`w-full max-w-[800px] mx-auto bg-white text-gray-900 ${isSinglePageFit ? 'py-5 px-6 sm:py-6 sm:px-8' : 'p-7 sm:p-8'} shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Formal Academic Header */}
      <header
        onDoubleClick={() => focusSection('personal')}
        title="Double-click to edit Personal Information in form"
        className={`flex flex-col sm:flex-row items-center justify-between border-b-2 gap-4 cursor-pointer hover:ring-1 hover:ring-blue-400/40 rounded transition-all ${isSinglePageFit ? 'pb-3 mb-3' : 'pb-4 mb-4'}`}
        style={{ borderColor: theme.primaryColor }}
      >
        <div className="flex-1 text-center sm:text-left">
          <h1 className={`${sizeClasses.h1} font-bold tracking-tight text-gray-950 uppercase`}>
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs italic text-gray-700 mt-0.5">{personalInfo.jobTitle}</p>
          )}
          <div className="text-xs text-gray-600 mt-1.5 flex flex-wrap gap-x-3 gap-y-1 justify-center sm:justify-start">
            {personalInfo.location && <span className="whitespace-nowrap">{personalInfo.location}</span>}
            {personalInfo.email && <span className="whitespace-nowrap">• <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a></span>}
            {personalInfo.phone && <span className="whitespace-nowrap">• {personalInfo.phone}</span>}
            {personalInfo.website && <span className="whitespace-nowrap">• <a href={personalInfo.website} target="_blank" rel="noreferrer" className="underline">Academic Profile</a></span>}
          </div>
        </div>
        {theme.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-16 h-16 rounded-xl object-cover border border-gray-400 shadow-xs shrink-0"
          />
        )}
      </header>

      {/* Render Academic Sections */}
      <div>
        {sectionOrder.map((sec, idx) => (
          <DraggableSection key={sec} sectionId={sec} index={idx} total={sectionOrder.length}>
            {renderSectionByKey(sec)}
          </DraggableSection>
        ))}
      </div>
    </div>
  );
};
