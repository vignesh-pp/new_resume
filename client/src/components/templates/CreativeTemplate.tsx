import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white shadow-sm flex flex-col sm:flex-row ${sizeClasses.body} print:p-0 print:shadow-none min-h-[1050px]`}
    >
      {/* Left Sidebar (35%) */}
      <aside className="w-full sm:w-[35%] bg-slate-900 text-slate-100 p-6 flex flex-col gap-6">
        {/* Profile Circle / Initials / Photo */}
        <div className="flex flex-col items-center sm:items-start">
          {theme.showPhoto !== false && personalInfo.photoUrl ? (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-2xl object-cover shadow-md mb-3 border-2 border-slate-700 ring-2 ring-white/10"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-md mb-3"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'R'}
            </div>
          )}
          <h2 className="text-lg font-bold text-white tracking-tight">{personalInfo.fullName}</h2>
          <p className="text-xs text-slate-400 font-medium">{personalInfo.jobTitle}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-slate-300">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <a href={`mailto:${personalInfo.email}`} className="truncate hover:text-white">{personalInfo.email}</a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="truncate hover:text-white">Portfolio</a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="truncate hover:text-white">LinkedIn</a>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="truncate hover:text-white">GitHub / Dribbble</a>
            </div>
          )}
        </div>

        {/* Skills & Tools in Sidebar */}
        {visibleSections.skills !== false && (
          <div className="space-y-3 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
              Design & Tech Stack
            </h3>
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">Key Tools:</span>
                <div className="flex flex-wrap gap-1">
                  {skills.tools.map((t, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">Core Expertise:</span>
                <div className="flex flex-wrap gap-1">
                  {skills.technical.map((tech, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education in Sidebar */}
        {visibleSections.education !== false && education && education.length > 0 && (
          <div className="space-y-2 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
              Education
            </h3>
            {education.map((edu) => (
              <div key={edu.id} className="text-slate-300">
                <p className="font-semibold text-white">{edu.degree}</p>
                <p className="text-[11px] text-slate-400">{edu.fieldOfStudy}</p>
                <p className="text-[11px] text-slate-500">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications in Sidebar */}
        {visibleSections.certifications !== false && certifications && certifications.length > 0 && (
          <div className="space-y-2 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-1">
              Credentials
            </h3>
            {certifications.map((c) => (
              <div key={c.id} className="text-slate-300 text-[11px]">
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-slate-400">{c.issuer} ({c.date})</p>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Right Content Area (65%) */}
      <main className="w-full sm:w-[65%] p-6 sm:p-8 flex flex-col gap-6 text-slate-800">
        {/* Profile Summary */}
        {visibleSections.summary !== false && summary && (
          <section>
            <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-2`} style={{ borderColor: theme.primaryColor }}>
              Profile
            </h2>
            <p className="leading-relaxed text-slate-600">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {visibleSections.experience !== false && experience && experience.length > 0 && (
          <section>
            <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-3`} style={{ borderColor: theme.primaryColor }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: theme.primaryColor }}>
                    {exp.company}
                  </p>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 text-slate-600">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-slate-400 font-bold shrink-0 mt-0.5">{bulletIcon}</span>
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

        {/* Featured Projects */}
        {visibleSections.projects !== false && projects && projects.length > 0 && (
          <section>
            <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-3`} style={{ borderColor: theme.primaryColor }}>
              Featured Case Studies & Work
            </h2>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-xs font-medium hover:underline" style={{ color: theme.primaryColor }}>
                        Live Link ↗
                      </a>
                    )}
                  </div>
                  {p.description && <p className="text-slate-600 mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {(resumeData.customSections || []).map((sec) => {
          if (visibleSections[sec.id] === false || !sec.items?.length) return null;
          return (
            <section key={sec.id}>
              <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-1 mb-3`} style={{ borderColor: theme.primaryColor }}>
                {sec.title}
              </h2>
              <div className="space-y-3">
                {sec.items.map((it, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-900">{it.title}</h3>
                      {it.date && <span className="text-[11px] font-medium text-slate-500">{it.date}</span>}
                    </div>
                    {it.subtitle && <p className="text-xs font-semibold" style={{ color: theme.primaryColor }}>{it.subtitle}</p>}
                    {it.description && <p className="text-slate-600 mt-1 text-xs leading-relaxed">{it.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};
