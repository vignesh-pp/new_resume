import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { 
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, 
  ChevronDown, ChevronUp, Plus, Trash2, Sparkles, Eye, EyeOff, 
  ArrowUp, ArrowDown, Wand2, Tag 
} from 'lucide-react';
import axios from 'axios';

export const ResumeEditor: React.FC = () => {
  const {
    resumeData,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    toggleSectionVisibility,
    setShowBulletModal,
    setActiveBulletContext,
  } = useResumeStore();

  const [expandedSection, setExpandedSection] = useState<string>('personal');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const { personalInfo, summary, experience, education, skills, projects, certifications, visibleSections } = resumeData;

  const handleAiBulletClick = (expId: string, bulletIndex: number, text: string) => {
    setActiveBulletContext({ expId, bulletIndex, text });
    setShowBulletModal(true);
  };

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const topRole = experience[0]?.role || personalInfo.jobTitle || 'Software Engineer';
      const company = experience[0]?.company || 'leading tech companies';
      const techSkills = [...(skills.languages || []), ...(skills.frameworks || [])].slice(0, 4).join(', ');

      const draft = `Accomplished and results-driven ${topRole} with extensive experience architecting scalable systems and delivering high-impact solutions at ${company}. Proven track record in ${techSkills || 'full-stack engineering, cloud architecture, and modern agile delivery'}. Adept at leading cross-functional teams, optimizing system performance, and driving measurable business results.`;
      
      updateSummary(draft);
    } finally {
      setTimeout(() => setGeneratingSummary(false), 300);
    }
  };

  const handleAddSkillPill = (skillName: string, category: 'languages' | 'frameworks' | 'tools' | 'softSkills') => {
    const currentList = skills[category] || [];
    if (!currentList.includes(skillName)) {
      updateSkills({ [category]: [...currentList, skillName] });
    }
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newExp = [...experience];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newExp.length) return;
    const temp = newExp[index];
    newExp[index] = newExp[targetIdx];
    newExp[targetIdx] = temp;
    useResumeStore.setState((state) => ({
      resumeData: { ...state.resumeData, experience: newExp }
    }));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProj = [...projects];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProj.length) return;
    const temp = newProj[index];
    newProj[index] = newProj[targetIdx];
    newProj[targetIdx] = temp;
    useResumeStore.setState((state) => ({
      resumeData: { ...state.resumeData, projects: newProj }
    }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-3xl mx-auto">
      {/* 1. Personal Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Name, target title, contact details & portfolio</p>
            </div>
          </div>
          {expandedSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'personal' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={personalInfo.jobTitle}
                onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Senior Full Stack Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub / Portfolio URL</label>
              <input
                type="text"
                value={personalInfo.github || ''}
                onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Website</label>
              <input
                type="text"
                value={personalInfo.website || ''}
                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="https://johndoe.dev"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
              <p className="text-xs text-slate-500">Executive overview & core strengths</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility('summary');
              }}
              className="p-1 text-slate-400 hover:text-slate-600"
              title="Toggle visibility"
            >
              {visibleSections.summary !== false ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
            </button>
            {expandedSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {expandedSection === 'summary' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-medium">
                Keep it concise (2-4 sentences) highlighting impact and top skills.
              </span>
              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{generatingSummary ? 'Drafting...' : '✨ AI Generate Summary'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Write a concise 3-4 sentence professional summary highlighting your years of experience, top technical achievements, and quantifiable results..."
            />
          </div>
        )}
      </div>

      {/* 3. Work Experience */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Work Experience ({experience.length})</h3>
              <p className="text-xs text-slate-500">Roles, companies, achievements & impact metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expandedSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {expandedSection === 'experience' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-5">
            {experience.map((exp, expIdx) => (
              <div key={exp.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 relative group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Position #{expIdx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExperience(expIdx, 'up')}
                        disabled={expIdx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(expIdx, 'down')}
                        disabled={expIdx === experience.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role / Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. 2021 or Jan 2021"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. Present or Dec 2023"
                    />
                  </div>
                </div>

                {/* Bullets with AI Enhancer button */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-slate-700">Achievement Bullets</label>
                    <button
                      type="button"
                      onClick={() => {
                        const newBullets = [...exp.bullets, 'Accomplished key milestones that boosted team throughput by 25%.'];
                        updateExperience(exp.id, { bullets: newBullets });
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet
                    </button>
                  </div>

                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => {
                          const updated = [...exp.bullets];
                          updated[bIdx] = e.target.value;
                          updateExperience(exp.id, { bullets: updated });
                        }}
                        className="w-full p-2 text-xs rounded-lg border border-slate-200 bg-white leading-relaxed"
                        placeholder="Accomplished [X] as measured by [Y], by doing [Z]..."
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => handleAiBulletClick(exp.id, bIdx, bullet)}
                          className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shadow-xs"
                          title="✨ AI Enhance Bullet with Google XYZ formula"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = exp.bullets.filter((_, i) => i !== bIdx);
                            updateExperience(exp.id, { bullets: updated });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                          title="Delete bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={addExperience}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-50/50 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Work Experience
            </button>
          </div>
        )}
      </div>

      {/* 4. Skills & Competencies with Skill Bank Pill Suggestions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Skills & Tech Stack</h3>
              <p className="text-xs text-slate-500">Categorized languages, frameworks, cloud & tools</p>
            </div>
          </div>
          {expandedSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'skills' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-4">
            {/* Quick Skill Bank Pills */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <span className="text-[11px] font-bold text-amber-900 block mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Quick Add Popular ATS Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'TypeScript', cat: 'languages' },
                  { name: 'Python', cat: 'languages' },
                  { name: 'React', cat: 'frameworks' },
                  { name: 'Node.js', cat: 'frameworks' },
                  { name: 'Next.js', cat: 'frameworks' },
                  { name: 'FastAPI', cat: 'frameworks' },
                  { name: 'Docker', cat: 'tools' },
                  { name: 'Kubernetes', cat: 'tools' },
                  { name: 'AWS', cat: 'tools' },
                  { name: 'PostgreSQL', cat: 'tools' },
                  { name: 'Redis', cat: 'tools' },
                  { name: 'Microservices', cat: 'softSkills' },
                  { name: 'System Design', cat: 'softSkills' },
                ].map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleAddSkillPill(s.name, s.cat as any)}
                    className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 hover:bg-amber-100 text-[11px] font-medium transition-colors"
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Programming Languages (comma-separated)
              </label>
              <input
                type="text"
                value={skills.languages?.join(', ') || ''}
                onChange={(e) =>
                  updateSkills({
                    languages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                placeholder="TypeScript, JavaScript, Python, Go, SQL"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Frameworks & Libraries (comma-separated)
              </label>
              <input
                type="text"
                value={skills.frameworks?.join(', ') || ''}
                onChange={(e) =>
                  updateSkills({
                    frameworks: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                placeholder="React, Next.js, Node.js, Express, FastAPI, Tailwind CSS"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cloud, Databases & Tools (comma-separated)
              </label>
              <input
                type="text"
                value={skills.tools?.join(', ') || ''}
                onChange={(e) =>
                  updateSkills({
                    tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                placeholder="Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Redis, Git"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Core Competencies & Soft Skills
              </label>
              <input
                type="text"
                value={skills.softSkills?.join(', ') || ''}
                onChange={(e) =>
                  updateSkills({
                    softSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                placeholder="System Architecture, Cross-functional Leadership, Agile / Scrum"
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. Projects */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('projects')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Projects ({projects.length})</h3>
              <p className="text-xs text-slate-500">Key systems, apps & open-source work</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSectionVisibility('projects');
              }}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              {visibleSections.projects !== false ? <Eye className="w-4 h-4 text-teal-600" /> : <EyeOff className="w-4 h-4" />}
            </button>
            {expandedSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {expandedSection === 'projects' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-4">
            {projects.map((proj, projIdx) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 w-2/3">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="font-bold text-xs text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-teal-500 w-full"
                      placeholder="Project Name"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveProject(projIdx, 'up')}
                        disabled={projIdx === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(projIdx, 'down')}
                        disabled={projIdx === projects.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  placeholder="Project description and impact..."
                />
                <input
                  type="text"
                  value={proj.technologies?.join(', ') || ''}
                  onChange={(e) =>
                    updateProject(proj.id, {
                      technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  placeholder="Technologies used (e.g. React, Docker, Go)"
                />
              </div>
            ))}

            <button
              onClick={addProject}
              className="w-full py-2 rounded-xl border-2 border-dashed border-teal-200 text-teal-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-50/50"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* 6. Education */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Education ({education.length})</h3>
              <p className="text-xs text-slate-500">Degrees, universities & academic honors</p>
            </div>
          </div>
          {expandedSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'education' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Degree Entry</span>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-500 hover:text-red-700 p-1 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    placeholder="University Name"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    placeholder="Degree (e.g. B.S., M.S.)"
                  />
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                    placeholder="Field of Study (e.g. Computer Science)"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="Start (2018)"
                    />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      placeholder="End (2022)"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2 rounded-xl border-2 border-dashed border-rose-200 text-rose-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50/50"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* 7. Certifications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleSection('certifications')}
          className="w-full flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900">Certifications ({certifications.length})</h3>
              <p className="text-xs text-slate-500">Industry licenses, cloud certs & credentials</p>
            </div>
          </div>
          {expandedSection === 'certifications' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSection === 'certifications' && (
          <div className="p-4 sm:px-6 pt-0 border-t border-slate-100 space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                  className="w-1/2 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  placeholder="AWS Certified Solutions Architect"
                />
                <input
                  type="text"
                  value={c.issuer}
                  onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                  className="w-1/3 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  placeholder="Issuer (Amazon)"
                />
                <input
                  type="text"
                  value={c.date}
                  onChange={(e) => updateCertification(c.id, { date: e.target.value })}
                  className="w-20 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                  placeholder="2023"
                />
                <button
                  onClick={() => removeCertification(c.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={addCertification}
              className="w-full py-2 rounded-xl border-2 border-dashed border-cyan-200 text-cyan-600 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-50/50"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
