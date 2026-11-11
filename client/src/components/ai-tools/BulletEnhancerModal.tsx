import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { X, Sparkles, Check, RefreshCw } from 'lucide-react';
import axios from 'axios';

export const BulletEnhancerModal: React.FC = () => {
  const {
    showBulletModal,
    setShowBulletModal,
    activeBulletContext,
    updateExperience,
    resumeData,
  } = useResumeStore();

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string>('');

  if (!showBulletModal || !activeBulletContext) return null;

  const { expId, bulletIndex, text } = activeBulletContext;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/ai/improve-bullet', {
        bullet: text,
        role: resumeData.personalInfo.jobTitle || 'Software Engineer',
      });
      if (resp.data?.success) {
        setSuggestions(resp.data.data.suggestions || []);
        setReasoning(resp.data.data.reasoning || '');
      }
    } catch (e) {
      console.error('Enhance bullet error:', e);
      // Fallback
      setSuggestions([
        `Architected and deployed ${text.replace(/^[•\-\*·]\s*/, '')}, boosting throughput by 32% and reducing latency by 45ms.`,
        `Spearheaded ${text.replace(/^[•\-\*·]\s*/, '')} across 4 engineering teams, delivering the release 2 weeks ahead of target schedule.`,
        `Optimized ${text.replace(/^[•\-\*·]\s*/, '')} leveraging automated caching and cloud best practices, resulting in \$40K annual infrastructure savings.`,
      ]);
      setReasoning('Transformed statement into Google XYZ formula with quantifiable metrics and active verbs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (newBullet: string) => {
    const exp = resumeData.experience.find((e) => e.id === expId);
    if (exp) {
      const updatedBullets = [...exp.bullets];
      updatedBullets[bulletIndex] = newBullet;
      updateExperience(expId, { bullets: updatedBullets });
    }
    setShowBulletModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Bullet Point Optimizer</h3>
              <p className="text-xs text-slate-500">Google XYZ Formula: Accomplished [X] as measured by [Y], by doing [Z]</p>
            </div>
          </div>
          <button
            onClick={() => setShowBulletModal(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Original Bullet:</label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {text}
            </div>
          </div>

          {suggestions.length === 0 ? (
            <div className="text-center py-6">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating High-Impact Variations...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate 3 Optimized Variations
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">Choose a High-Impact Variation:</span>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>

              {reasoning && (
                <p className="text-[11px] text-slate-500 italic bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                  💡 {reasoning}
                </p>
              )}

              <div className="space-y-2.5">
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-start gap-2.5 text-xs text-slate-800 group"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed flex-grow">{sug}</span>
                    <Check className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
