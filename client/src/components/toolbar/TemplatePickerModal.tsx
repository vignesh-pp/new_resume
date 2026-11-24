import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES_CONFIG } from '../../utils/templateDefinitions';
import { TemplateId } from '../../types/resume';
import { TemplateThumbnail } from '../common/TemplateThumbnail';
import { X, Check, ShieldCheck, Sparkles } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeTemplate, setTemplate, theme, setActiveTab } = useResumeStore();

  if (!isOpen) return null;

  const handleSelectTemplate = (id: TemplateId) => {
    setTemplate(id);
  };

  const handleContinueEditing = () => {
    setActiveTab('editor');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Select a template</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              7 Designs
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid Body */}
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {TEMPLATES_CONFIG.map((template) => {
              const isSelected = activeTemplate === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id as TemplateId)}
                  className={`group relative flex flex-col rounded-2xl border-2 cursor-pointer transition-all duration-150 overflow-hidden ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/25 shadow-md bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
                  }`}
                >
                  {/* Miniature Resume Frame */}
                  <div className="relative h-44 bg-slate-100/80 p-2 overflow-hidden flex items-center justify-center border-b border-slate-100">
                    <div className="w-full h-full rounded shadow-xs overflow-hidden transform group-hover:scale-[1.02] transition-transform">
                      <TemplateThumbnail
                        templateId={template.id}
                        primaryColor={theme.primaryColor}
                      />
                    </div>

                    {/* Green Selection Checkmark Badge (matching reference) */}
                    {isSelected && (
                      <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Template Meta Info */}
                  <div className="p-2.5 bg-white flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {template.name}
                      </span>
                      {template.isAtsOptimized ? (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          {template.atsScoreEstimate}% ATS
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                          Creative
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate mt-0.5">
                      {template.layoutType} • {template.bestSuitedFor.split(',')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with "Continue Editing" button (matching reference) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleContinueEditing}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Continue Editing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
