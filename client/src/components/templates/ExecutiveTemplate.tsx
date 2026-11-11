import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, certifications, visibleSections } = resumeData;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 shadow-sm font-serif text-sm print:p-0 print:shadow-none">
      {/* Executive Double Border Header */}
      <header className="text-center pb-4 border-b-2 border-slate-900">
        <h1 
          className="text-3xl font-normal tracking-wide uppercase"
          style={{ color: theme.primaryColor }}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-sans tracking-widest text-slate-600 uppercase mt-1">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 text-xs font-sans text-slate-600 mt-2">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>
              | <a href={`mailto:${personalInfo.email}`} className="text-slate-900 underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              | <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-900 underline">LinkedIn</a>
            </span>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      {visibleSections.summary !== false && summary && (
        <section className="my-5 bg-slate-50 p-4 border-l-4" style={{ borderColor: theme.primaryColor }}>
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 mb-1">
            Executive Profile & Leadership Scope
          </h2>
          <p className="text-xs font-serif leading-relaxed text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {/* Leadership Experience */}
      {visibleSections.experience !== false && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-3">
            Professional Experience & Career History
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-sans">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                    <span className="text-slate-700">, {exp.company}</span>
                    {exp.location && <span className="text-xs text-slate-500"> — {exp.location}</span>}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-800 font-serif">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed pl-2 border-l border-slate-300">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {visibleSections.skills !== false && (
        <section className="mb-5">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
            Strategic Competencies & Board Focus
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans">
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
      )}

      {/* Education & Credentials */}
      {visibleSections.education !== false && education && education.length > 0 && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
            Education & Executive Credentials
          </h2>
          <div className="space-y-2 font-sans text-xs">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-700"> — {edu.institution}</span>
                </div>
                <span className="text-slate-500">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
            {certifications && certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline text-slate-700">
                <span>{c.name} — {c.issuer}</span>
                <span>{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
