import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { TemplateId } from '../../types/resume';
import { TemplateThumbnail } from '../common/TemplateThumbnail';
import { Check, ShieldCheck, Sparkles, AlertCircle, Eye } from 'lucide-react';

export const TemplateGallery: React.FC = () => {
  const { activeTemplate, setTemplate, theme, setActiveTab, openPreviewModal } = useResumeStore();
  const allTemplates = useTemplateStore((state) => state.allTemplates);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'ATS', 'Modern', 'Executive', 'Creative', 'Technical', 'Academic', 'Custom'];

  const filteredTemplates = filter === 'All'
    ? allTemplates
    : allTemplates.filter((t) => t.category === filter || (filter === 'ATS' && t.isAtsOptimized));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Resume Template Gallery
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {allTemplates.length} Professional Designs
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
              onClick={() => openPreviewModal(template.id as TemplateId)}
              className={`group relative flex flex-col justify-between bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-blue-600 shadow-lg ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Thumbnail Container with Realistic Resume Preview */}
              <div className="relative h-64 bg-slate-100/80 overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
                <div className="w-full h-full rounded-md shadow-xs overflow-hidden transform group-hover:scale-[1.02] transition-transform">
                  <TemplateThumbnail
                    templateId={template.id}
                    primaryColor={theme.primaryColor}
                  />
                </div>

                {/* Hover Preview Overlay */}
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Click to Preview in Modal</span>
                  </span>
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

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreviewModal(template.id as TemplateId);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title="Open full interactive preview modal"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTemplate(template.id as TemplateId);
                      setActiveTab('editor');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                      isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Active</span>
                      </>
                    ) : (
                      'Apply'
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

