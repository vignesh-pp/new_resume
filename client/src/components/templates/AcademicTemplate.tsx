import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-gray-900 p-8 shadow-sm font-serif text-sm print:p-0 print:shadow-none">
      {/* Formal Academic Header */}
      <header className="text-center pb-4 border-b border-gray-400 mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase">
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
      </header>

      {/* Research Statement / Summary */}
      {visibleSections.summary !== false && summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5">
            Research Statement & Academic Focus
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed text-justify">{summary}</p>
        </section>
      )}

      {/* Education & Degrees */}
      {visibleSections.education !== false && education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
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
                  <ul className="list-disc list-outside ml-4 mt-0.5 text-xs text-gray-700 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
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
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-gray-800">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Grants, Fellowships & Honors
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-800">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.name}</span>, {c.issuer} ({c.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
