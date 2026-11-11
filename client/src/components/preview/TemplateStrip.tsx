import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES_CONFIG } from '../../utils/templateDefinitions';
import { TemplateId } from '../../types/resume';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export const TemplateStrip: React.FC = () => {
  const { activeTemplate, setTemplate } = useResumeStore();

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex items-center gap-3 no-scrollbar z-10">
      <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Templates:</span>
      </div>

      <div className="flex items-center gap-2.5">
        {TEMPLATES_CONFIG.map((t) => {
          const isSelected = activeTemplate === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id as TemplateId)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
            >
              <span className="truncate">{t.name}</span>
              {t.isAtsOptimized ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                  {t.atsScoreEstimate}%
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold shrink-0">
                  Creative
                </span>
              )}
              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

