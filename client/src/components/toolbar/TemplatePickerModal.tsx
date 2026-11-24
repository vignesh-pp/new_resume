import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { TemplateId } from '../../types/resume';
import { TemplateThumbnail } from '../common/TemplateThumbnail';
import { X, Check, ShieldCheck, Sparkles, Eye } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeTemplate, setTemplate, theme, setActiveTab, openPreviewModal } = useResumeStore();
  const allTemplates = useTemplateStore((state) => state.allTemplates);

  if (!isOpen) return null;

  const handleSelectTemplate = (id: TemplateId) => {
    setTemplate(id);
  };

  const handleContinueEditing = () => {
    setActiveTab('editor');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Select a template</h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {allTemplates.length} Designs
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid Body - Expanded Spacious 3-Column Layout */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allTemplates.map((template) => {
              const isSelected = activeTemplate === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id as TemplateId)}
                  className={`group relative flex flex-col rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/25 shadow-md bg-blue-50/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                  }`}
                >
                  {/* Miniature Resume Frame */}
                  <div className="relative h-52 bg-slate-100/80 p-2.5 overflow-hidden flex items-center justify-center border-b border-slate-100">
                    <div className="w-full h-full rounded shadow-xs overflow-hidden transform group-hover:scale-[1.02] transition-transform">
                      <TemplateThumbnail
                        templateId={template.id}
                        primaryColor={theme.primaryColor}
                      />
                    </div>

                    {/* Blue Selection Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Quick Preview in Modal Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreviewModal(template.id as TemplateId);
                      }}
                      className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-white/95 hover:bg-white text-slate-700 hover:text-blue-600 text-[11px] font-semibold shadow-sm border border-slate-200/90 transition-all opacity-90 group-hover:opacity-100 flex items-center gap-1"
                      title="Preview this template with your resume data in full modal"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                  </div>

                  {/* Template Meta Info */}
                  <div className="p-3 bg-white flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                          {template.name}
                        </span>
                        {template.isAtsOptimized ? (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 shrink-0">
                            {template.atsScoreEstimate}% ATS
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                            Creative
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1">
                        {template.layoutType} • {template.bestSuitedFor.split(',')[0]}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
                        {isSelected ? '✓ Selected' : 'Click to Select'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreviewModal(template.id as TemplateId);
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline"
                      >
                        Full View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with "Continue Editing" button in clean Blue */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Active: <span className="font-bold text-slate-900">{allTemplates.find((t) => t.id === activeTemplate)?.name || 'Custom Template'}</span>
          </div>
          <button
            onClick={handleContinueEditing}
            className="py-2.5 px-6 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue Editing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
