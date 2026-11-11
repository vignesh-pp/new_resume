import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES_CONFIG } from '../../utils/templateDefinitions';
import { Palette, Type, LayoutTemplate, Sparkles, Upload } from 'lucide-react';

interface ThemeToolbarProps {
  onUploadClick: () => void;
  onAnalyzeClick: () => void;
  onTailorClick: () => void;
}

export const ThemeToolbar: React.FC<ThemeToolbarProps> = ({
  onUploadClick,
  onAnalyzeClick,
  onTailorClick,
}) => {
  const {
    activeTemplate,
    setTemplate,
    theme,
    setTheme,
    loadPreset,
    isAnalyzing,
  } = useResumeStore();

  const colorPresets = [
    { name: 'Corporate Blue', hex: '#1e3a8a' },
    { name: 'Modern Sky', hex: '#0284c7' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Executive Slate', hex: '#0f172a' },
    { name: 'Creative Violet', hex: '#7c3aed' },
    { name: 'Crimson', hex: '#dc2626' },
    { name: 'Teal Tech', hex: '#0d9488' },
  ];

  const fonts: Array<'Inter' | 'Roboto' | 'Merriweather' | 'JetBrains Mono' | 'Poppins'> = [
    'Inter',
    'Roboto',
    'Merriweather',
    'JetBrains Mono',
    'Poppins',
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left: Template Selector & Sample Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold">Template:</span>
          <select
            value={activeTemplate}
            onChange={(e) => setTemplate(e.target.value as any)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TEMPLATES_CONFIG.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} {t.isAtsOptimized ? '✓ ATS' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Load Preset Dropdown */}
        <div className="flex items-center gap-1">
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">Presets:</span>
          <button
            onClick={() => loadPreset('developer')}
            className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Software Dev
          </button>
          <button
            onClick={() => loadPreset('executive')}
            className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Executive VP
          </button>
          <button
            onClick={() => loadPreset('designer')}
            className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            UI/UX Designer
          </button>
        </div>
      </div>

      {/* Middle: Color Swatches & Typography */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <div className="flex items-center gap-1">
            {colorPresets.map((c) => (
              <button
                key={c.hex}
                onClick={() => setTheme({ primaryColor: c.hex })}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  theme.primaryColor === c.hex ? 'scale-125 ring-2 ring-blue-500/40 border-white' : 'border-transparent hover:scale-110'
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
              title="Custom Color"
            />
          </div>
        </div>

        {/* Fonts */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700">
          <Type className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={theme.fontFamily}
            onChange={(e) => setTheme({ fontFamily: e.target.value as any })}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Spacing */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
          {(['compact', 'normal', 'spacious'] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setTheme({ spacing: sp })}
              className={`px-2 py-0.5 rounded capitalize ${
                theme.spacing === sp ? 'bg-white font-semibold text-slate-800 shadow-xs' : 'text-slate-600'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Right: AI Tools & Upload */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUploadClick}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload PDF/DOCX</span>
        </button>

        <button
          onClick={onAnalyzeClick}
          disabled={isAnalyzing}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Analyzing...' : 'ATS Score'}</span>
        </button>

        <button
          onClick={onTailorClick}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailor for Job</span>
        </button>
      </div>
    </div>
  );
};
