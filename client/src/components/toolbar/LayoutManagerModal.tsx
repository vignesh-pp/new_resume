import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ColumnLayoutMode } from '../../types/resume';
import { 
  X, Columns, Rows, ArrowUp, ArrowDown, Eye, EyeOff, 
  Grid, Check, Sparkles, LayoutList, SplitSquareVertical 
} from 'lucide-react';

interface LayoutManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  skills: 'Skills & Tech Stack',
  projects: 'Key Projects',
  education: 'Education',
  certifications: 'Certifications',
};

export const LayoutManagerModal: React.FC<LayoutManagerModalProps> = ({ isOpen, onClose }) => {
  const {
    resumeData,
    theme,
    setTheme,
    moveSectionOrder,
    toggleSectionVisibility,
    setSectionColumn,
  } = useResumeStore();

  if (!isOpen) return null;

  const currentOrder = resumeData.sectionOrder && resumeData.sectionOrder.length > 0
    ? resumeData.sectionOrder
    : ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'];

  const visibleSections = resumeData.visibleSections || {};
  const currentLayout = theme.layoutMode || 'single-column';
  const leftSections = theme.leftSections || ['skills', 'education', 'certifications'];
  const rightSections = theme.rightSections || ['summary', 'experience', 'projects'];

  const layoutOptions: Array<{ id: ColumnLayoutMode; name: string; desc: string; icon: any }> = [
    {
      id: 'single-column',
      name: 'Single Column (Rows)',
      desc: 'All sections stacked vertically in sequential row order. Maximum ATS score.',
      icon: Rows,
    },
    {
      id: 'two-column-left',
      name: 'Two Column (Sidebar Left)',
      desc: '35% left sidebar for compact sections, 65% right for detailed experience.',
      icon: Columns,
    },
    {
      id: 'two-column-right',
      name: 'Two Column (Sidebar Right)',
      desc: '65% left main area, 35% right sidebar for skills and credentials.',
      icon: Columns,
    },
    {
      id: 'two-column-equal',
      name: 'Equal Columns (50/50)',
      desc: 'Two balanced columns side-by-side for dense, comprehensive 1-page fit.',
      icon: SplitSquareVertical,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Layout, Columns & Section Order</h3>
              <p className="text-xs text-slate-500">Arrange row/column structure and reorder sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Layout Mode Selection (Row vs Column Wise) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              1. Choose Page Structure (Row vs Column Layout)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {layoutOptions.map((opt) => {
                const isSelected = currentLayout === opt.id;
                const IconComponent = opt.icon;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setTheme({ layoutMode: opt.id })}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Section Ordering (Move Sections Up/Down) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Reorder Sections Sequence (Move Up / Down)
              </label>
              <span className="text-[11px] text-slate-400">
                Live changes update in preview instantly
              </span>
            </div>

            <div className="space-y-2">
              {currentOrder.map((sectionKey, idx) => {
                const label = SECTION_LABELS[sectionKey] || sectionKey;
                const isVisible = visibleSections[sectionKey] !== false;
                const inLeftCol = leftSections.includes(sectionKey);

                return (
                  <div
                    key={sectionKey}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-bold ${isVisible ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Column Picker when in Two-Column Mode */}
                      {currentLayout !== 'single-column' && (
                        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-semibold mr-2">
                          <button
                            type="button"
                            onClick={() => setSectionColumn(sectionKey, 'left')}
                            className={`px-2 py-0.5 rounded ${inLeftCol ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                          >
                            Left Col
                          </button>
                          <button
                            type="button"
                            onClick={() => setSectionColumn(sectionKey, 'right')}
                            className={`px-2 py-0.5 rounded ${!inLeftCol ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
                          >
                            Right Col
                          </button>
                        </div>
                      )}

                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => moveSectionOrder(sectionKey, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 shadow-2xs"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => moveSectionOrder(sectionKey, 'down')}
                        disabled={idx === currentOrder.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 shadow-2xs"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSectionVisibility(sectionKey)}
                        className={`p-1.5 rounded-lg border shadow-2xs transition-colors ${
                          isVisible
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}
                        title={isVisible ? 'Hide Section' : 'Show Section'}
                      >
                        {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Section Row/Column Density Options */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Internal Row / Column Tweaks
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Skills Columns */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800 block mb-1">
                  Skills Display Format:
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white border rounded-lg text-xs font-medium text-center">
                  {[
                    { id: 1, label: '1 Col (Inline)' },
                    { id: 2, label: '2 Columns' },
                    { id: 3, label: '3 Columns' },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setTheme({ skillsColumns: sc.id as any })}
                      className={`py-1 rounded ${(theme.skillsColumns || 2) === sc.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'}`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Side-by-Side Dual Row Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Education & Certifications Side-by-Side
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Places them into 2 columns in a single row to save height
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTheme({ sideBySideEducationCert: !theme.sideBySideEducationCert })}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${theme.sideBySideEducationCert ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme.sideBySideEducationCert ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Layout: <strong className="text-slate-900 capitalize">{(theme.layoutMode || 'single-column').replace('-', ' ')}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
