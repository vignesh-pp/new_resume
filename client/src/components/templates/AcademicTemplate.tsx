import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white text-gray-900 p-8 shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Formal Academic Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-gray-400 mb-4 gap-4">
        <div className="flex-1 text-center sm:text-left">
          <h1 className={`${sizeClasses.h1} font-bold tracking-tight text-gray-950 uppercase`}>
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs italic text-gray-700 mt-0.5">{personalInfo.jobTitle}</p>
          )}
          <div className="text-xs text-gray-600 mt-1.5 space-x-2">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.email && <span>• <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a></span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.website && <span>• <a href={personalInfo.website} target="_blank" rel="noreferrer" className="underline">Academic Profile</a></span>}
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

      {/* Research Statement / Summary */}
      {visibleSections.summary !== false && summary && (
        <section className="mb-4">
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5`}>
            Research Statement & Academic Focus
          </h2>
          <p className="leading-relaxed text-justify text-gray-800">{summary}</p>
        </section>
      )}

      {/* Education & Degrees */}
      {visibleSections.education !== false && education && education.length > 0 && (
        <section className="mb-4">
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2`}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-gray-950">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-gray-800">, {edu.institution}</span>
                    {edu.location && <span className="text-gray-500 italic"> ({edu.location})</span>}
                  </div>
                  <span className="text-gray-600 font-sans text-[11px]">{edu.startDate} – {edu.endDate}</span>
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
      )}

      {/* Academic & Research Appointments */}
      {visibleSections.experience !== false && experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2`}>
            Appointments & Research Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-gray-950">{exp.role}</span>
                    <span className="text-gray-800">, {exp.company}</span>
                  </div>
                  <span className="text-gray-600 font-sans text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-1 text-gray-800">
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
      )}

      {/* Publications / Projects */}
      {visibleSections.projects !== false && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2`}>
            Publications & Working Papers
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((p) => (
              <div key={p.id}>
                <span className="font-bold text-gray-950">{p.name}. </span>
                <span className="text-gray-800 italic">{p.description} </span>
                {p.technologies && <span className="text-gray-600">[{p.technologies.join(', ')}].</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Fellowships, Grants & Honors */}
      {visibleSections.certifications !== false && certifications && certifications.length > 0 && (
        <section>
          <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2`}>
            Grants, Fellowships & Honors
          </h2>
          <ul className="space-y-1 text-gray-800">
            {certifications.map((c) => (
              <li key={c.id} className="flex items-start gap-1.5">
                <span className="text-gray-500 font-bold shrink-0">{bulletIcon}</span>
                <span>
                  <strong className="font-semibold">{c.name}</strong>, {c.issuer} ({c.date})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Custom Sections (Publications, Research Groups, Teaching) */}
      {(resumeData.customSections || []).map((sec) => {
        if (visibleSections[sec.id] === false || !sec.items?.length) return null;
        return (
          <section key={sec.id} className="mt-4">
            <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2`}>
              {sec.title}
            </h2>
            <div className="space-y-1.5 text-xs text-gray-800">
              {sec.items.map((it, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-gray-950">{it.title}</span>
                    {it.date && <span className="text-gray-600">({it.date})</span>}
                  </div>
                  {it.subtitle && <p className="italic text-gray-700">{it.subtitle}</p>}
                  {it.description && <p className="text-gray-800 mt-0.5 leading-relaxed">{it.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
