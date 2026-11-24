import React from 'react';
import { ResumeSchema, ThemeSettings } from '../../types/resume';
import { useResumeStore } from '../../store/useResumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { getFontFamilyCss, getFontSizeClasses, getBulletIcon } from '../../utils/fontStyles';
import { DraggableSection } from '../preview/DraggableSection';
import { getSectionTitle } from '../../utils/sectionTitles';

interface TemplateProps {
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resumeData, theme }) => {
  const { focusSection } = useResumeStore();
  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const fontStyle = { fontFamily: getFontFamilyCss(theme.fontFamily) };
  const sizeClasses = getFontSizeClasses(theme.fontSize);
  const bulletIcon = getBulletIcon(theme.bulletStyle);

  const isSinglePageFit = theme.fitToSinglePage || theme.spacing === 'compact';

  return (
    <div 
      style={fontStyle}
      className={`w-full max-w-[800px] mx-auto bg-white shadow-sm flex flex-col sm:flex-row ${sizeClasses.body} print:p-0 print:shadow-none min-h-0 print:min-h-0`}
    >
      {/* Left Sidebar (35%) */}
      <aside className={`w-full sm:w-[35%] bg-slate-900 text-slate-100 ${isSinglePageFit ? 'p-4 sm:p-5 gap-4' : 'p-6 gap-6'} flex flex-col`}>
        {/* Profile Circle / Initials / Photo */}
        <div
          onDoubleClick={() => focusSection('personal')}
          title="Double-click to edit Personal Information in form"
          className="flex flex-col items-center sm:items-start cursor-pointer hover:ring-1 hover:ring-indigo-400/50 rounded-lg p-1 transition-all"
        >
          {theme.showPhoto !== false && personalInfo.photoUrl ? (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-2xl object-cover shadow-md mb-2 border-2 border-slate-700 ring-2 ring-white/10 shrink-0"
            />
          ) : (
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-md mb-2 shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'R'}
            </div>
          )}
          <h2 className="text-base font-bold text-white tracking-tight">{personalInfo.fullName}</h2>
          <p className="text-xs text-slate-400 font-medium">{personalInfo.jobTitle}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-300">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-0.5 mb-1.5">
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={`mailto:${personalInfo.email}`} className="truncate hover:text-white">{personalInfo.email}</a>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="whitespace-nowrap">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="whitespace-nowrap">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="truncate hover:text-white">Portfolio</a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="truncate hover:text-white">LinkedIn</a>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="truncate hover:text-white">GitHub / Dribbble</a>
            </div>
          )}
        </div>

        {/* Skills & Tools in Sidebar */}
        {visibleSections.skills !== false && (
          <DraggableSection sectionId="skills" customLabel={getSectionTitle(resumeData, 'skills', 'Tech Stack')}>
            <div className="space-y-2 text-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-0.5 mb-1">
                {getSectionTitle(resumeData, 'skills', 'Design & Tech Stack')}
              </h3>
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold text-slate-300 block mb-1">Key Tools:</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map((t, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {skills.technical && skills.technical.length > 0 && (
                <div>
                  <span className="text-[10px] font-semibold text-slate-300 block mb-1">Core Expertise:</span>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((tech, idx) => (
                      <span key={idx} className="bg-slate-800 text-slate-200 text-[10px] px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DraggableSection>
        )}

        {/* Education in Sidebar */}
        {visibleSections.education !== false && education && education.length > 0 && (
          <DraggableSection sectionId="education" customLabel={getSectionTitle(resumeData, 'education', 'Education')}>
            <div className="space-y-2 text-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-0.5 mb-1">
                {getSectionTitle(resumeData, 'education', 'Education')}
              </h3>
              {education.map((edu) => (
                <div key={edu.id} className="text-slate-300">
                  <p className="font-semibold text-white leading-tight">{edu.degree}</p>
                  <p className="text-[11px] text-slate-400">{edu.fieldOfStudy}</p>
                  <p className="text-[10px] text-slate-500 whitespace-nowrap">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                </div>
              ))}
            </div>
          </DraggableSection>
        )}

        {/* Certifications in Sidebar */}
        {visibleSections.certifications !== false && certifications && certifications.length > 0 && (
          <DraggableSection sectionId="certifications" customLabel={getSectionTitle(resumeData, 'certifications', 'Credentials')}>
            <div className="space-y-1.5 text-xs">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 pb-0.5 mb-1">
                {getSectionTitle(resumeData, 'certifications', 'Credentials')}
              </h3>
              {certifications.map((c) => (
                <div key={c.id} className="text-slate-300 text-[11px]">
                  <p className="font-medium text-white leading-tight">{c.name}</p>
                  <p className="text-slate-400 text-[10px]">{c.issuer} <span className="whitespace-nowrap">({c.date})</span></p>
                </div>
              ))}
            </div>
          </DraggableSection>
        )}
      </aside>

      {/* Right Content Area (65%) */}
      <main className={`w-full sm:w-[65%] ${isSinglePageFit ? 'p-5 sm:p-6 gap-4' : 'p-6 sm:p-8 gap-5'} flex flex-col text-slate-800`}>
        {/* Profile Summary */}
        {visibleSections.summary !== false && summary && (
          <DraggableSection sectionId="summary" customLabel={getSectionTitle(resumeData, 'summary', 'Profile')}>
            <section className="resume-section break-inside-avoid print:break-inside-avoid">
              <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-1.5 leading-snug`} style={{ borderColor: theme.primaryColor }}>
                {getSectionTitle(resumeData, 'summary', 'Profile')}
              </h2>
              <p className="leading-relaxed text-slate-600 text-justify">{summary}</p>
            </section>
          </DraggableSection>
        )}

        {/* Work Experience */}
        {visibleSections.experience !== false && experience && experience.length > 0 && (
          <DraggableSection sectionId="experience" customLabel={getSectionTitle(resumeData, 'experience', 'Experience')}>
            <section className="resume-section">
              <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
                {getSectionTitle(resumeData, 'experience', 'Experience')}
              </h2>
              <div className={isSinglePageFit ? 'space-y-2.5' : 'space-y-3.5'}>
                {experience.map((exp) => (
                  <div key={exp.id} className="resume-item break-inside-avoid print:break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{exp.role}</h3>
                      <span className="text-[11px] text-slate-500 font-medium shrink-0 ml-2 whitespace-nowrap text-right">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold mb-1" style={{ color: theme.primaryColor }}>
                      {exp.company} {exp.location && <span className="text-slate-400 font-normal">({exp.location})</span>}
                    </p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="space-y-0.5 text-slate-600">
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
          </DraggableSection>
        )}

        {/* Featured Projects */}
        {visibleSections.projects !== false && projects && projects.length > 0 && (
          <DraggableSection sectionId="projects" customLabel={getSectionTitle(resumeData, 'projects', 'Case Studies')}>
            <section className="resume-section">
              <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
                {getSectionTitle(resumeData, 'projects', 'Featured Case Studies & Work')}
              </h2>
              <div className={isSinglePageFit ? 'space-y-2' : 'space-y-2.5'}>
                {projects.map((p) => (
                  <div key={p.id} className="resume-item break-inside-avoid print:break-inside-avoid p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{p.name}</h3>
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-xs font-medium hover:underline shrink-0 ml-2 whitespace-nowrap" style={{ color: theme.primaryColor }}>
                          Live Link ↗
                        </a>
                      )}
                    </div>
                    {p.description && <p className="text-slate-600 mt-1 text-xs">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          </DraggableSection>
        )}

        {/* Custom Sections */}
        {(resumeData.customSections || []).map((sec) => {
          if (visibleSections[sec.id] === false || !sec.items?.length) return null;
          return (
            <DraggableSection key={sec.id} sectionId={sec.id} customLabel={getSectionTitle(resumeData, sec.id, sec.title)}>
              <section className="resume-section">
                <h2 className={`${sizeClasses.h2} font-bold uppercase tracking-wider text-slate-900 border-b-2 pb-0.5 mb-2 leading-snug`} style={{ borderColor: theme.primaryColor }}>
                  {getSectionTitle(resumeData, sec.id, sec.title)}
                </h2>
                <div className="space-y-2">
                  {sec.items.map((it, idx) => (
                    <div key={idx} className="resume-item break-inside-avoid print:break-inside-avoid p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs font-bold text-slate-900 flex-1 min-w-0">{it.title}</h3>
                        {it.date && <span className="text-[11px] font-medium text-slate-500 shrink-0 ml-2 whitespace-nowrap text-right">{it.date}</span>}
                      </div>
                      {it.subtitle && <p className="text-xs font-semibold" style={{ color: theme.primaryColor }}>{it.subtitle}</p>}
                      {it.description && <p className="text-slate-600 mt-1 text-xs leading-relaxed">{it.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            </DraggableSection>
          );
        })}
      </main>
    </div>
  );
};
