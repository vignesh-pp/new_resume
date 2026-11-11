import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const ClassicAtsTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontClass = {
    'Inter': 'font-sans',
    'Roboto': 'font-sans',
    'Merriweather': 'font-serif',
    'JetBrains Mono': 'font-mono',
    'Poppins': 'font-display',
  }[theme.fontFamily] || 'font-sans';

  const spacingClass = {
    'compact': 'space-y-3 text-xs leading-snug',
    'normal': 'space-y-4 text-sm leading-normal',
    'spacious': 'space-y-5 text-sm leading-relaxed',
  }[theme.spacing] || 'space-y-4 text-sm';

  return (
    <div className={`w-full max-w-[800px] mx-auto bg-white text-gray-900 p-8 shadow-sm ${fontClass} ${spacingClass} print:p-0 print:shadow-none`}>
      {/* Header */}
      <header className="text-center border-b pb-3 border-gray-400">
        <h1 
          className="text-2xl font-bold tracking-tight uppercase"
          style={{ color: theme.primaryColor }}
        >
          {personalInfo.fullName}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-medium text-gray-700 mt-0.5">{personalInfo.jobTitle}</p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 text-xs text-gray-600 mt-1.5">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <span>
              • <a href={`mailto:${personalInfo.email}`} className="text-gray-900 underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              • <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-gray-900 underline">LinkedIn</a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              • <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-gray-900 underline">GitHub</a>
            </span>
          )}
          {personalInfo.website && (
            <span>
              • <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-gray-900 underline">Portfolio</a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {visibleSections.summary !== false && summary && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-1.5" style={{ color: theme.primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-800 text-justify text-xs leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {visibleSections.experience !== false && experience && experience.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-2" style={{ color: theme.primaryColor }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{exp.role}</span>
                    <span className="text-gray-700"> — {exp.company}</span>
                    {exp.location && <span className="text-xs text-gray-500"> ({exp.location})</span>}
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-gray-800">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {visibleSections.skills !== false && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-1.5" style={{ color: theme.primaryColor }}>
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-xs text-gray-800">
            {skills.languages && skills.languages.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">Languages: </span>
                <span>{skills.languages.join(', ')}</span>
              </div>
            )}
            {skills.frameworks && skills.frameworks.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">Frameworks & Libraries: </span>
                <span>{skills.frameworks.join(', ')}</span>
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">Cloud, Tools & Databases: </span>
                <span>{skills.tools.join(', ')}</span>
              </div>
            )}
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="font-bold text-gray-900">Core Concepts: </span>
                <span>{skills.technical.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {visibleSections.projects !== false && projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-2" style={{ color: theme.primaryColor }}>
            Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{proj.name}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-xs text-gray-600"> | {proj.technologies.join(', ')}</span>
                    )}
                  </div>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs underline text-gray-700">
                      View Project
                    </a>
                  )}
                </div>
                {proj.description && <p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-gray-800">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {visibleSections.education !== false && education && education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-2" style={{ color: theme.primaryColor }}>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-gray-700"> — {edu.institution}</span>
                    {edu.location && <span className="text-xs text-gray-500"> ({edu.location})</span>}
                  </div>
                  <span className="text-xs text-gray-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                {edu.gpa && <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {visibleSections.certifications !== false && certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-gray-800 pb-0.5 mb-1.5" style={{ color: theme.primaryColor }}>
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-gray-800">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <span className="font-semibold">{cert.name}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
