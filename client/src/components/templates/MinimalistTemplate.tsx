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

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white text-zinc-900 p-10 shadow-sm ${sizeClasses.body} print:p-0 print:shadow-none`}
    >
      {/* Clean Minimal Header */}
      <header className="mb-8">
        <h1 className={`${sizeClasses.h1} font-light tracking-tight text-zinc-950 uppercase`}>
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm tracking-widest text-zinc-500 uppercase mt-1">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-3 font-light">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.email && <a href={`mailto:${personalInfo.email}`} className="hover:text-zinc-900">{personalInfo.email}</a>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-zinc-900">LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900">GitHub</a>}
        </div>
      </header>

      {/* Summary */}
      {visibleSections.summary !== false && summary && (
        <section className="mb-6">
          <p className="text-zinc-700 leading-relaxed font-light">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {visibleSections.experience !== false && experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-1 mb-3`}>
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-zinc-900">{exp.role}</span>
                    <span className="text-zinc-400">, </span>
                    <span className="text-zinc-600">{exp.company}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-light">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-zinc-600 font-light">
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
      )}

      {/* Skills */}
      {visibleSections.skills !== false && (
        <section className="mb-6">
          <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-1 mb-2`}>
            Competencies
          </h2>
          <div className="grid grid-cols-2 gap-3 text-zinc-700 font-light">
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
      )}

      {/* Projects */}
      {visibleSections.projects !== false && projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-1 mb-3`}>
            Selected Work
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-zinc-900">{p.name}</span>
                  {p.technologies && (
                    <span className="text-[11px] text-zinc-400 font-light">{p.technologies.join(', ')}</span>
                  )}
                </div>
                {p.description && <p className="text-zinc-600 font-light mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibleSections.education !== false && education && education.length > 0 && (
        <section>
          <h2 className={`${sizeClasses.h2} font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-200 pb-1 mb-2`}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-medium text-zinc-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-zinc-500"> — {edu.institution}</span>
                </div>
                <span className="text-zinc-400 font-light">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
