import React, { useState } from 'react';
import { useTemplateStore } from '../../store/useTemplateStore';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  X, Shield, Plus, Palette, Check, Trash2, Eye, Layout, 
  Sparkles, Layers, Sliders, Type 
} from 'lucide-react';
import { TemplateId } from '../../types/resume';

const PRESET_COLORS = [
  '#1e3a8a', // Deep Navy / Corporate
  '#0284c7', // Sky Blue
  '#0d9488', // Teal
  '#7c3aed', // Purple / Violet
  '#1e293b', // Slate Charcoal
  '#b91c1c', // Crimson
  '#d97706', // Amber / Gold
  '#047857', // Emerald
];

const BASE_LAYOUTS = [
  { id: 'classic-ats', name: 'Classic ATS (Single-column ATS format with clean rule bars)' },
  { id: 'modern-pro', name: 'Modern Professional (Accent banner, skill tags & timeline markers)' },
  { id: 'minimalist', name: 'Minimalist (Generous whitespace, Swiss typography, muted rules)' },
  { id: 'executive', name: 'Executive (Serif prestige headings, executive summary callout)' },
  { id: 'technical', name: 'Technical (Monospace code badges, terminal prompts & stack matrix)' },
  { id: 'creative', name: 'Creative (Modern asymmetrical sidebar layout with contact pillar)' },
  { id: 'academic', name: 'Academic (Formal scholarly chronological hierarchy)' },
];

export const AdminTemplateManagerModal: React.FC = () => {
  const { 
    isAdminModalOpen, 
    closeAdminModal, 
    customTemplates, 
    allTemplates, 
    createCustomTemplate, 
    deleteCustomTemplate 
  } = useTemplateStore();
  const { setTemplate, setTheme, setActiveTab } = useResumeStore();
  const { currentUser } = useAuthStore();

  const [activeTab, setActiveTabMode] = useState<'list' | 'create'>('list');

  // Form State for creating a new template
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [bestSuitedFor, setBestSuitedFor] = useState('');
  const [category, setCategory] = useState<'ATS' | 'Modern' | 'Minimal' | 'Executive' | 'Creative' | 'Technical' | 'Academic' | 'Custom'>('Modern');
  const [layoutType, setLayoutType] = useState<'1-Column' | '2-Column' | 'Sidebar' | 'Split'>('1-Column');
  const [baseLayout, setBaseLayout] = useState<'classic-ats' | 'modern-pro' | 'minimalist' | 'executive' | 'creative' | 'technical' | 'academic'>('modern-pro');
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [atsScore, setAtsScore] = useState(95);

  if (!isAdminModalOpen || currentUser?.role !== 'admin') return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    createCustomTemplate({
      name: templateName.trim(),
      description: description.trim() || 'Custom engineered template tailored for specific career tracks.',
      bestSuitedFor: bestSuitedFor.trim() || 'Software Engineers, Architects, and Tech Leaders',
      category,
      layoutType,
      baseLayout,
      atsScoreEstimate: atsScore,
      isAtsOptimized: true,
      theme: {
        primaryColor,
        fontFamily,
        fontSize: 'normal',
      },
      createdBy: currentUser.name || 'Admin',
    });

    // Reset and return to list
    setTemplateName('');
    setDescription('');
    setBestSuitedFor('');
    setActiveTabMode('list');
  };

  const handleApplyTemplate = (templateId: TemplateId, customColor?: string) => {
    setTemplate(templateId);
    if (customColor) {
      setTheme({ primaryColor: customColor });
    }
    closeAdminModal();
    setActiveTab('editor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Admin Template Studio</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                  Admin Exclusive
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Design custom resume templates, configure themes, and manage public system designs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveTabMode('list')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'list' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                All Templates ({allTemplates.length})
              </button>
              <button
                onClick={() => setActiveTabMode('create')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'create' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Create Template</span>
              </button>
            </div>

            <button
              onClick={closeAdminModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0 py-3 pr-1 custom-scrollbar">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              {/* Custom Admin Templates Section */}
              {customTemplates.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Admin Created Custom Templates ({customTemplates.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customTemplates.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/30 hover:border-indigo-400 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">{t.name}</span>
                            <span
                              className="w-3 h-3 rounded-full border border-white shadow-2xs"
                              style={{ backgroundColor: t.theme.primaryColor }}
                            />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                            <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                              Base: {t.baseLayout}
                            </span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{t.atsScoreEstimate}% ATS</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                          <button
                            onClick={() => handleApplyTemplate(t.id, t.theme.primaryColor)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold transition-all shadow-2xs"
                          >
                            Apply Design
                          </button>
                          <button
                            onClick={() => deleteCustomTemplate(t.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete custom template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Built-in Templates */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Standard Built-in System Templates (7 Designs)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allTemplates
                    .filter((t) => !t.id.startsWith('tpl-'))
                    .map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all flex flex-col justify-between space-y-2.5"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900">{t.name}</h5>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-700">
                              {t.layoutType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1.5 italic">Suited for: {t.bestSuitedFor}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-emerald-600">
                            {t.atsScoreEstimate}% ATS
                          </span>
                          <button
                            onClick={() => handleApplyTemplate(t.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold transition-all shadow-2xs"
                          >
                            Select & Use
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            /* Create Template Form */
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-xs text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Admin custom templates leverage modular renderers with custom color branding, font sizing, and tailored metadata.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Template Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silicon Valley Tech Lead"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 bg-white"
                  >
                    <option value="Modern">Modern</option>
                    <option value="ATS">ATS Optimized</option>
                    <option value="Executive">Executive</option>
                    <option value="Technical">Technical</option>
                    <option value="Minimal">Minimalist</option>
                    <option value="Creative">Creative</option>
                    <option value="Academic">Academic</option>
                    <option value="Custom">Custom Track</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Value Proposition
                </label>
                <textarea
                  rows={2}
                  placeholder="Summarize the typography, layout benefits, and target industry focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Base Layout Engine *
                  </label>
                  <select
                    value={baseLayout}
                    onChange={(e) => setBaseLayout(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 bg-white"
                  >
                    {BASE_LAYOUTS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Best Suited For Candidates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend, Cloud DevOps, Tech Leads"
                    value={bestSuitedFor}
                    onChange={(e) => setBestSuitedFor(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Primary Brand Color</span>
                  <span className="font-mono text-slate-500 text-[11px]">{primaryColor}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                        primaryColor.toLowerCase() === c.toLowerCase()
                          ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110 shadow-sm'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {primaryColor.toLowerCase() === c.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded-xl border border-slate-200 cursor-pointer p-0"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Font Family & ATS Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 bg-white"
                  >
                    <option value="Inter">Inter (Clean Modern Sans)</option>
                    <option value="Roboto">Roboto (Google Standard)</option>
                    <option value="Calibri">Calibri (Corporate Standard)</option>
                    <option value="Merriweather">Merriweather (Editorial Serif)</option>
                    <option value="Playfair Display">Playfair Display (Executive Prestige)</option>
                    <option value="Fira Code">Fira Code (Technical Monospace)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated ATS Pass Rate ({atsScore}%)
                  </label>
                  <input
                    type="range"
                    min="85"
                    max="99"
                    value={atsScore}
                    onChange={(e) => setAtsScore(Number(e.target.value))}
                    className="w-full accent-indigo-600 mt-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTabMode('list')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save & Publish Template</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
