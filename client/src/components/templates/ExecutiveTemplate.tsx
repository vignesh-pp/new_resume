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

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { focusSection } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);
  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  const defaultOrder = ['summary', 'experience', 'skills', 'education', 'certifications'];
  const baseOrder = (resumeData.sectionOrder && resumeData.sectionOrder.length > 0)
    ? resumeData.sectionOrder
    : defaultOrder;
  const customIds = (resumeData.customSections || []).map((s) => s.id);
  const sectionOrder = [
    ...baseOrder,
    ...customIds.filter((id) => !baseOrder.includes(id)),
  ];

  // 1. Executive Summary
  const renderSummary = () => {
    if (visibleSections.summary === false || !summary) return null;
    return (
      <section key="summary" className={`resume-section break-inside-avoid print:break-inside-avoid bg-slate-50 border-l-4 ${isSinglePageFit ? 'my-2.5 p-3' : 'my-3.5 p-4'}`} style={{ borderColor: theme.primaryColor }}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 mb-1 leading-snug`}>
          {getSectionTitle(resumeData, 'summary', 'Executive Profile & Leadership Scope')}
        </h2>
        <p className="leading-relaxed text-slate-800 text-justify">{summary}</p>
      </section>
    );
  };

  // 2. Leadership Experience
  const renderExperience = () => {
    if (visibleSections.experience === false || !experience || experience.length === 0) return null;
    return (
      <section key="experience" className={`resume-section ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'experience', 'Professional Experience & Career History')}
        </h2>
        <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-4'}>
          {experience.map((exp) => (
            <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                  <span className="text-slate-700">, {exp.company}</span>
                  {exp.location && <span className="text-xs text-slate-500 whitespace-nowrap"> — {exp.location}</span>}
                </div>
                <span className="text-xs font-semibold text-slate-600 shrink-0 ml-2 whitespace-nowrap text-right">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className={`mt-1 text-slate-800 ${isSinglePageFit ? 'space-y-0.5' : 'space-y-1'}`}>
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className={`pl-2 border-l border-slate-300 flex items-start gap-1.5 ${isSinglePageFit ? 'leading-snug' : 'leading-relaxed'}`}>
                      <span className="text-slate-500 font-bold shrink-0 mt-0.5">{bulletIcon}</span>
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

  // 3. Core Competencies
  const renderSkills = () => {
    if (visibleSections.skills === false) return null;
    return (
      <section key="skills" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-5'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'skills', 'Strategic Competencies & Board Focus')}
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {skills.technical && skills.technical.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Enterprise & Strategy:</span>
              <span className="text-slate-700">{skills.technical.join(', ')}</span>
            </div>
          )}
          {skills.softSkills && skills.softSkills.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Leadership & Governance:</span>
              <span className="text-slate-700">{skills.softSkills.join(', ')}</span>
            </div>
          )}
          {skills.tools && skills.tools.length > 0 && (
            <div className="col-span-2">
              <span className="font-bold text-slate-900 block mb-0.5">Platforms & Ecosystems:</span>
              <span className="text-slate-700">{skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  // 4. Education
  const renderEducation = () => {
    if (visibleSections.education === false || !education || education.length === 0) return null;
    return (
      <section key="education" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'education', 'Education & Executive Credentials')}
        </h2>
        <div className="space-y-1.5 text-xs">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start gap-3 resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-slate-700"> — {edu.institution}</span>
              </div>
              <span className="text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 5. Certifications
  const renderCertifications = () => {
    if (visibleSections.certifications === false || !certifications || certifications.length === 0) return null;
    return (
      <section key="certifications" className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, 'certifications', 'Certifications & Governance')}
        </h2>
        <div className="space-y-1 text-xs">
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-start gap-3 text-slate-700 resume-item break-inside-avoid print:break-inside-avoid">
              <span className="flex-1 min-w-0">{c.name} — {c.issuer}</span>
              <span className="shrink-0 ml-2 whitespace-nowrap text-right">{c.date}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // 6. Custom Section
  const renderCustomSection = (sec: { id: string; title: string; items: any[] }) => {
    if (visibleSections[sec.id] === false || !sec.items?.length) return null;
    return (
      <section key={sec.id} className={`resume-section break-inside-avoid print:break-inside-avoid ${isSinglePageFit ? 'mt-2.5 mb-3' : 'mt-3 mb-4'}`}>
        <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
          {getSectionTitle(resumeData, sec.id, sec.title)}
        </h2>
        <div className="space-y-2 text-xs">
          {sec.items.map((it, idx) => (
            <div key={idx} className="pb-1 resume-item break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-start gap-3">
                <span className="font-bold text-slate-900 flex-1 min-w-0">{it.title}</span>
                {it.date && <span className="text-slate-500 font-medium shrink-0 ml-2 whitespace-nowrap text-right">{it.date}</span>}
              </div>
              {it.subtitle && <p className="text-slate-700 italic">{it.subtitle}</p>}
              {it.description && <p className="text-slate-800 mt-0.5 leading-relaxed">{it.description}</p>}
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
      {/* Executive Double Border Header */}
      <header
        onDoubleClick={() => focusSection('personal')}
        title="Double-click to edit Personal Information in form"
        className={`flex flex-col sm:flex-row items-center justify-between border-b-2 gap-4 cursor-pointer hover:ring-1 hover:ring-blue-400/40 rounded transition-all ${isSinglePageFit ? 'pb-3 mb-2' : 'pb-4 mb-3'}`}
        style={{ borderColor: theme.primaryColor }}
      >
        {theme.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-18 h-18 rounded-full object-cover border-2 border-slate-800 shadow-sm shrink-0"
          />
        )}
        <div className="flex-1 text-center sm:text-left">
          <h1 
            className={`${sizeClasses.h1} font-normal tracking-wide uppercase`}
            style={{ color: theme.primaryColor }}
          >
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-sm tracking-widest text-slate-600 uppercase mt-0.5">
              {personalInfo.jobTitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 text-xs text-slate-600 mt-1.5">
            {personalInfo.location && <span className="whitespace-nowrap">{personalInfo.location}</span>}
            {personalInfo.phone && <span className="whitespace-nowrap">| {personalInfo.phone}</span>}
            {personalInfo.email && (
              <span className="whitespace-nowrap">
                | <a href={`mailto:${personalInfo.email}`} className="text-slate-900 underline">{personalInfo.email}</a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="whitespace-nowrap">
                | <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-900 underline">LinkedIn</a>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Render Dynamic Sections */}
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
