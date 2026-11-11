import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AtsScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsScoreModal: React.FC<AtsScoreModalProps> = ({ isOpen, onClose }) => {
  const { atsAnalysis, setTemplate } = useResumeStore();

  if (!isOpen || !atsAnalysis) return null;

  const {
    overallScore,
    completenessScore,
    impactMetricsScore,
    keywordsScore,
    formattingScore,
    strengths,
    improvements,
    detectedKeywords,
    missingKeywords,
  } = atsAnalysis;

  if (overallScore >= 80) {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI ATS Resume Analysis</h3>
              <p className="text-xs text-slate-500">Scored against modern applicant tracking algorithms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Score Hero */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-200/80 gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Overall ATS Readability
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black text-slate-900">{overallScore}</span>
                <span className="text-lg font-semibold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 max-w-xs">
                {overallScore >= 85
                  ? 'Excellent! Your resume has rich metrics and clean formatting optimized for automated parsing.'
                  : overallScore >= 70
                  ? 'Strong baseline. Adding more quantifiable metric percentages will push this into the top 5%.'
                  : 'Noticeable areas for improvement in keyword density and quantifiable achievements.'}
              </p>
            </div>

            {/* Sub-scores */}
            <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Completeness</span>
                <span className="text-base font-bold text-slate-800">{completenessScore}/25</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Metrics & Impact</span>
                <span className="text-base font-bold text-slate-800">{impactMetricsScore}/25</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Industry Keywords</span>
                <span className="text-base font-bold text-slate-800">{keywordsScore}/25</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Formatting</span>
                <span className="text-base font-bold text-slate-800">{formattingScore}/25</span>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations */}
          {improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Actionable Improvements ({improvements.length})
              </h4>
              <div className="space-y-2">
                {improvements.map((imp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Resume Strengths ({strengths.length})
              </h4>
              <div className="space-y-2">
                {strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Breakdown */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Detected Industry Keywords ({detectedKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {detectedKeywords.map((kw, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {missingKeywords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  High-Demand Keywords to Consider ({missingKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-between items-center">
          <button
            onClick={() => {
              setTemplate('classic-ats');
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
          >
            Switch to Classic ATS Template
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
