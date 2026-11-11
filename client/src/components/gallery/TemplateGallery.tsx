import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES_CONFIG } from '../../utils/templateDefinitions';
import { TemplateId } from '../../types/resume';
import { Check, ShieldCheck, Sparkles, AlertCircle, Eye } from 'lucide-react';

export const TemplateGallery: React.FC = () => {
  const { activeTemplate, setTemplate, setActiveTab } = useResumeStore();
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'ATS', 'Modern', 'Executive', 'Creative', 'Technical', 'Academic'];

  const filteredTemplates = filter === 'All'
    ? TEMPLATES_CONFIG
    : TEMPLATES_CONFIG.filter((t) => t.category === filter || (filter === 'ATS' && t.isAtsOptimized));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Resume Template Gallery
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              7 Professional Designs
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choose any design below. Content is 100% decoupled from the layout—switch between templates anytime with zero data loss.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ATS' ? 'ATS Friendly' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isSelected = activeTemplate === template.id;

          return (
            <div
              key={template.id}
              onClick={() => setTemplate(template.id as TemplateId)}
              className={`group relative flex flex-col justify-between bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-100 flex items-center justify-center p-4">
                {/* Visual miniature representation */}
                <div className="w-full h-full bg-white rounded-lg shadow-sm p-3 flex flex-col justify-between text-[6px] select-none pointer-events-none transform group-hover:scale-[1.02] transition-transform">
                  {template.id === 'creative' ? (
                    <div className="flex h-full gap-2">
                      <div className="w-1/3 bg-slate-900 rounded p-1.5 text-white flex flex-col gap-1">
                        <div className="w-4 h-4 rounded bg-purple-500 mb-1" />
                        <div className="w-3/4 h-1 bg-slate-400 rounded" />
                        <div className="w-1/2 h-1 bg-slate-600 rounded" />
                        <div className="mt-2 w-full h-0.5 bg-slate-700" />
                        <div className="w-full h-1 bg-slate-500 rounded" />
                      </div>
                      <div className="w-2/3 flex flex-col gap-1.5 p-1">
                        <div className="w-1/2 h-1.5 bg-slate-900 rounded" />
                        <div className="w-full h-1 bg-slate-200 rounded" />
                        <div className="w-5/6 h-1 bg-slate-200 rounded" />
                        <div className="mt-2 w-1/3 h-1 bg-purple-600 rounded" />
                        <div className="w-full h-1 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ) : template.id === 'modern-pro' ? (
                    <div className="flex flex-col h-full gap-1.5">
                      <div className="h-1 w-full bg-blue-600 rounded-full" />
                      <div className="flex justify-between items-center">
                        <div className="w-1/3 h-2 bg-slate-900 rounded" />
                        <div className="w-1/4 h-1 bg-slate-300 rounded" />
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded" />
                      <div className="w-1/4 h-1.5 bg-blue-600 rounded mt-1" />
                      <div className="w-full h-1 bg-slate-200 rounded" />
                      <div className="w-5/6 h-1 bg-slate-200 rounded" />
                      <div className="w-4/6 h-1 bg-slate-200 rounded" />
                    </div>
                  ) : template.id === 'technical' ? (
                    <div className="flex flex-col h-full gap-1.5 font-mono">
                      <div className="flex justify-between border-b pb-1">
                        <div className="w-2/5 h-1.5 bg-teal-700 rounded" />
                        <div className="w-1/5 h-1 bg-slate-300 rounded" />
                      </div>
                      <div className="p-1 bg-slate-50 border rounded flex flex-col gap-1">
                        <div className="w-1/4 h-1 bg-teal-600 rounded" />
                        <div className="w-full h-1 bg-slate-300 rounded" />
                      </div>
                      <div className="w-1/3 h-1 bg-teal-700 rounded mt-1" />
                      <div className="w-full h-1 bg-slate-200 rounded" />
                      <div className="w-4/5 h-1 bg-slate-200 rounded" />
                    </div>
                  ) : template.id === 'executive' ? (
                    <div className="flex flex-col h-full gap-1.5 text-center">
                      <div className="w-1/2 h-2 bg-slate-900 rounded mx-auto border-b pb-1" />
                      <div className="w-1/3 h-1 bg-slate-400 rounded mx-auto" />
                      <div className="p-1.5 bg-slate-50 border-l-2 border-slate-900 text-left my-1">
                        <div className="w-full h-1 bg-slate-300 rounded" />
                        <div className="w-3/4 h-1 bg-slate-300 rounded mt-0.5" />
                      </div>
                      <div className="w-1/3 h-1 bg-slate-800 rounded text-left border-b pb-0.5" />
                      <div className="w-full h-1 bg-slate-200 rounded" />
                    </div>
                  ) : (
                    <div className="flex flex-col h-full gap-1.5 text-center">
                      <div className="w-2/5 h-2 bg-slate-900 rounded mx-auto" />
                      <div className="w-1/3 h-1 bg-slate-400 rounded mx-auto" />
                      <div className="w-3/5 h-0.5 bg-slate-200 rounded mx-auto mb-1" />
                      <div className="w-1/4 h-1 bg-slate-800 rounded text-left border-b pb-0.5" />
                      <div className="w-full h-1 bg-slate-200 rounded text-left" />
                      <div className="w-5/6 h-1 bg-slate-200 rounded text-left" />
                      <div className="w-1/4 h-1 bg-slate-800 rounded text-left border-b pb-0.5 mt-1" />
                      <div className="w-full h-1 bg-slate-200 rounded text-left" />
                    </div>
                  )}
                </div>

                {/* ATS Score Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm border border-slate-200 text-xs font-semibold">
                  {template.isAtsOptimized ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">ATS {template.atsScoreEstimate}%</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-amber-700">Portfolio Focus</span>
                    </>
                  )}
                </div>

                {/* Selected Check Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{template.name}</h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {template.layoutType}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-600 mb-2">
                    Best for: {template.bestSuitedFor}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTemplate(template.id as TemplateId);
                      setActiveTab('editor');
                    }}
                    className={`w-full py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Selected & Active
                      </>
                    ) : (
                      'Apply This Design'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
