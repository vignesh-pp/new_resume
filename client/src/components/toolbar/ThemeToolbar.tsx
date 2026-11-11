import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES_CONFIG } from '../../utils/templateDefinitions';
import { Palette, Type, LayoutTemplate, Sparkles, Upload, FolderOpen, Columns } from 'lucide-react';

interface ThemeToolbarProps {
  onUploadClick: () => void;
  onAnalyzeClick: () => void;
  onTailorClick: () => void;
  onOpenFontModal: () => void;
  onOpenVersionsModal: () => void;
  onOpenLayoutModal: () => void;
}

export const ThemeToolbar: React.FC<ThemeToolbarProps> = ({
  onUploadClick,
  onAnalyzeClick,
  onTailorClick,
  onOpenFontModal,
  onOpenVersionsModal,
  onOpenLayoutModal,
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
    { name: 'Emerald Growth', hex: '#059669' },
    { name: 'Executive Slate', hex: '#0f172a' },
    { name: 'Creative Violet', hex: '#7c3aed' },
    { name: 'Crimson Power', hex: '#dc2626' },
    { name: 'Teal Tech', hex: '#0d9488' },
    { name: 'Amber Gold', hex: '#d97706' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left: Template & Presets */}
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

      {/* Middle: Font Selector Pill & Color Swatches */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Font Picker Button */}
        <button
          onClick={onOpenFontModal}
          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Choose from 10 font styles and adjust formatting"
        >
          <Type className="w-3.5 h-3.5 text-blue-600" />
          <span>Font: <strong className="font-bold text-slate-900">{theme.fontFamily}</strong></span>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded font-normal">Change</span>
        </button>

        {/* Layout & Columns Button */}
        <button
          onClick={onOpenLayoutModal}
          className="px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          title="Reorder sections and switch row/column layouts"
        >
          <Columns className="w-3.5 h-3.5 text-indigo-600" />
          <span>Columns & Reorder</span>
        </button>

        {/* Colors Swatches */}
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
              title="Custom Hex Color"
            />
          </div>
        </div>

        {/* Spacing density pill */}
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

      {/* Right: AI Tools & Version Manager */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenVersionsModal}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          title="Saved resume versions in MongoDB"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Versions</span>
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
