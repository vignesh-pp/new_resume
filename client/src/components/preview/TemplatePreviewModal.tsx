import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { TemplateId } from '../../types/resume';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { TemplateThumbnail } from '../common/TemplateThumbnail';
import { exportUtils } from '../../utils/exportUtils';
import {
  X, ChevronLeft, ChevronRight, Check, ZoomIn, ZoomOut, RotateCcw,
  ShieldCheck, AlertCircle, Sparkles, Printer, Download, Eye
} from 'lucide-react';

export const TemplatePreviewModal: React.FC = () => {
  const {
    isPreviewModalOpen,
    previewModalTemplate,
    closePreviewModal,
    activeTemplate,
    setTemplate,
    resumeData,
    theme,
    setTheme,
    setActiveTab,
  } = useResumeStore();

  const allTemplates = useTemplateStore((state) => state.allTemplates);

  const [currentTemplateId, setCurrentTemplateId] = useState<TemplateId>('classic-ats');
  const [modalZoom, setModalZoom] = useState(0.85);
  const [previewColor, setPreviewColor] = useState(theme.primaryColor || '#1e3a8a');

  // Sync with store state when opened
  useEffect(() => {
    if (previewModalTemplate) {
      setCurrentTemplateId(previewModalTemplate);
    } else if (activeTemplate) {
      setCurrentTemplateId(activeTemplate);
    }
    setPreviewColor(theme.primaryColor || '#1e3a8a');
  }, [previewModalTemplate, activeTemplate, isPreviewModalOpen, theme.primaryColor]);

  if (!isPreviewModalOpen) return null;

  const currentTemplate = allTemplates.find((t) => t.id === currentTemplateId) || allTemplates[0];
  const currentIndex = allTemplates.findIndex((t) => t.id === currentTemplateId);
  const isSelected = activeTemplate === currentTemplateId;

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + allTemplates.length) % allTemplates.length;
    setCurrentTemplateId(allTemplates[nextIdx].id as TemplateId);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allTemplates.length;
    setCurrentTemplateId(allTemplates[nextIdx].id as TemplateId);
  };

  const handleApplyTemplate = () => {
    setTemplate(currentTemplateId);
    if (previewColor !== theme.primaryColor) {
      setTheme({ primaryColor: previewColor });
    }
    setActiveTab('editor');
    closePreviewModal();
  };

  const colorPresets = [
    { name: 'Corporate Blue', hex: '#1e3a8a' },
    { name: 'Modern Sky', hex: '#0284c7' },
    { name: 'Emerald Growth', hex: '#059669' },
    { name: 'Executive Slate', hex: '#0f172a' },
    { name: 'Creative Violet', hex: '#7c3aed' },
    { name: 'Crimson Power', hex: '#dc2626' },
    { name: 'Teal Tech', hex: '#0d9488' },
    { name: 'Amber Gold', hex: '#d97706' },
  ];

  const modalTheme = {
    ...theme,
    primaryColor: previewColor,
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Navigation & Action Bar */}
      <header className="shrink-0 bg-slate-900/95 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg z-30">
        {/* Left: Template Meta & Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700/80">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Previous Template (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {currentTemplate.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentIndex + 1}/{allTemplates.length}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Next Template (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ATS Badge */}
          {currentTemplate.isAtsOptimized ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ATS {currentTemplate.atsScoreEstimate}% Optimized</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/80 border border-purple-800/80 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Portfolio & Creative</span>
            </span>
          )}
        </div>

        {/* Center: Quick Color Swatches */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-medium mr-1">Color:</span>
          {colorPresets.map((c) => (
            <button
              key={c.hex}
              onClick={() => setPreviewColor(c.hex)}
              className={`w-4 h-4 rounded-full border transition-transform ${
                previewColor === c.hex
                  ? 'scale-125 ring-2 ring-emerald-400 border-white'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>

        {/* Right: Zoom & Primary Apply Action */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setModalZoom(Math.max(0.5, Number((modalZoom - 0.1).toFixed(1))))}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-300 min-w-[36px] text-center font-bold">
              {Math.round(modalZoom * 100)}%
            </span>
            <button
              onClick={() => setModalZoom(Math.min(1.3, Number((modalZoom + 0.1).toFixed(1))))}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setModalZoom(0.85)}
              className="p-1 text-[10px] font-semibold rounded text-slate-300 hover:text-white hover:bg-slate-700 px-1.5"
              title="Fit to Page"
            >
              Fit
            </button>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyTemplate}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/40'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Selected & Continue Editing</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply & Edit This Design</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={closePreviewModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Canvas */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
        <div
          className="shrink-0 transition-transform duration-150 my-2"
          style={{
            transform: `scale(${modalZoom})`,
            transformOrigin: 'top center',
            width: '800px',
          }}
        >
          {/* Double-click hint banner */}
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-blue-900/40 border border-blue-500/30 text-blue-200 text-xs font-medium flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Full High-Fidelity Preview with Your Resume Data</span>
            </span>
            <span className="text-[11px] text-blue-300 font-semibold hidden sm:inline">
              Tip: Double-click any section to immediately edit it in the form!
            </span>
          </div>

          <div className="bg-white shadow-2xl rounded-lg ring-1 ring-white/10 overflow-hidden">
            <ResumeRenderer
              templateId={currentTemplateId}
              resumeData={resumeData}
              theme={modalTheme}
            />
          </div>
        </div>
      </main>

      {/* Bottom Template Switcher Strip */}
      <footer className="shrink-0 bg-slate-900/95 border-t border-slate-800 px-4 py-2.5 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
            Choose Template:
          </span>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {allTemplates.map((template) => {
              const isItemActive = currentTemplateId === template.id;
              const isSelectedActive = activeTemplate === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => setCurrentTemplateId(template.id as TemplateId)}
                  className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left shrink-0 transition-all ${
                    isItemActive
                      ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/30 text-white'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                  }`}
                >
                  <div className="w-6 h-8 rounded bg-white shadow-xs overflow-hidden shrink-0 pointer-events-none">
                    <TemplateThumbnail
                      templateId={template.id}
                      primaryColor={previewColor}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold truncate max-w-[110px]">
                        {template.name}
                      </span>
                      {isSelectedActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Currently Active" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {template.isAtsOptimized ? `${template.atsScoreEstimate}% ATS` : 'Creative'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleApplyTemplate}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Apply Template
          </button>
        </div>
      </footer>
    </div>
  );
};
