import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useTemplateStore } from '../../store/useTemplateStore';
import { 
  Palette, LayoutTemplate, Sparkles, Upload, 
  FolderOpen, ArrowUpDown, Sliders, ChevronDown 
} from 'lucide-react';

interface ThemeToolbarProps {
  onUploadClick: () => void;
  onAnalyzeClick: () => void;
  onTailorClick: () => void;
  onOpenTemplateModal: () => void;
  onOpenFontModal: () => void;
  onOpenVersionsModal: () => void;
  onOpenLayoutModal: () => void;
}

export const ThemeToolbar: React.FC<ThemeToolbarProps> = ({
  onUploadClick,
  onAnalyzeClick,
  onTailorClick,
  onOpenTemplateModal,
  onOpenFontModal,
  onOpenVersionsModal,
  onOpenLayoutModal,
}) => {
  const {
    activeTemplate,
    theme,
    setTheme,
    loadPreset,
    isAnalyzing,
  } = useResumeStore();

  const allTemplates = useTemplateStore((state) => state.allTemplates);
  const currentTemplate = allTemplates.find((t) => t.id === activeTemplate) || allTemplates[0];

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

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left: Unified Primary Actions matching reference */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Unified 3 Actions: Rearrange | Templates | Design & Font */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
          {/* 1. Rearrange */}
          <button
            onClick={onOpenLayoutModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs"
            title="Rearrange sections, adjust column layouts and toggle visibility"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Rearrange</span>
          </button>

          {/* 2. Templates - Visual Modal Trigger with Blue Pill */}
          <button
            onClick={onOpenTemplateModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs"
            title="Select a resume template from 7 visual designs"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Templates</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-800/80 text-blue-100 font-medium">
              {currentTemplate.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-200" />
          </button>

          {/* 3. Design & Font */}
          <button
            onClick={onOpenFontModal}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-white transition-all flex items-center gap-1.5 shadow-2xs"
            title="Typography, font pairing, size, spacing, and bullet styles"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Design & Font</span>
          </button>
        </div>

        {/* Quick Color Swatches */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1">
            {colorPresets.map((c) => (
              <button
                key={c.hex}
                onClick={() => setTheme({ primaryColor: c.hex })}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  theme.primaryColor === c.hex ? 'scale-125 ring-2 ring-emerald-500/40 border-white' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ primaryColor: e.target.value })}
              className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Custom Hex Color"
            />
          </div>
        </div>
      </div>

      {/* Right: Presets & AI Tools */}
      <div className="flex items-center gap-2">
        {/* Load Preset Dropdown */}
        <div className="hidden xl:flex items-center gap-1 pr-2 border-r border-slate-200 text-[11px] text-slate-500">
          <span>Presets:</span>
          <button
            onClick={() => loadPreset('developer')}
            className="px-2 py-1 font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Developer
          </button>
          <button
            onClick={() => loadPreset('executive')}
            className="px-2 py-1 font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Executive
          </button>
          <button
            onClick={() => loadPreset('designer')}
            className="px-2 py-1 font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Designer
          </button>
        </div>

        <button
          onClick={onOpenVersionsModal}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          title="Saved resume versions in MongoDB"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Versions</span>
        </button>

        <button
          onClick={onUploadClick}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload</span>
        </button>

        <button
          onClick={onAnalyzeClick}
          disabled={isAnalyzing}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Scoring...' : 'ATS Check'}</span>
        </button>

        <button
          onClick={onTailorClick}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailor</span>
        </button>
      </div>
    </div>
  );
};
