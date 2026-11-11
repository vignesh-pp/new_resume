import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { AVAILABLE_FONTS, FontMeta } from '../../utils/fontStyles';
import { FontOption } from '../../types/resume';
import { X, Check, Type, Sliders, Sparkles, Eye, ShieldCheck } from 'lucide-react';

interface FontPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FontPickerModal: React.FC<FontPickerModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useResumeStore();

  if (!isOpen) return null;

  const categories = ['All', 'Modern Sans', 'Classic Serif', 'Tech Monospace', 'Editorial Display'];
  const [selectedCat, setSelectedCat] = React.useState('All');

  const filteredFonts = selectedCat === 'All'
    ? AVAILABLE_FONTS
    : AVAILABLE_FONTS.filter((f) => f.category === selectedCat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Typography & Resume Aesthetics</h3>
              <p className="text-xs text-slate-500">Choose from 10 curated fonts and formatting details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCat === cat
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Font Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredFonts.map((font) => {
              const isSelected = theme.fontFamily === font.id;

              return (
                <div
                  key={font.id}
                  onClick={() => setTheme({ fontFamily: font.id })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-lg font-bold text-slate-900"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p
                    className="text-xs text-slate-600 mb-2 truncate"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {font.category}
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium truncate max-w-[140px]">
                      {font.bestFor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fine-Tuning Controls */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Fine-Tune Typography & Layout
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Font Size Scale */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Base Font Size
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                  {(['compact', 'normal', 'relaxed', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setTheme({ fontSize: sz })}
                      className={`py-1.5 rounded-lg capitalize font-medium transition-all ${
                        theme.fontSize === sz
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing / Margin Density */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Line Spacing & Padding
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl text-xs">
                  {(['compact', 'normal', 'spacious'] as const).map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setTheme({ spacing: sp })}
                      className={`py-1.5 rounded-lg capitalize font-medium transition-all ${
                        theme.spacing === sp
                          ? 'bg-white text-slate-900 shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bullet Marker Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bullet Point Marker Style
                </label>
                <div className="flex gap-2 text-xs">
                  {[
                    { id: 'circle', label: '• Dot' },
                    { id: 'dash', label: '— Dash' },
                    { id: 'diamond', label: '◆ Diamond' },
                    { id: 'caret', label: '› Caret' },
                    { id: 'check', label: '✓ Check' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setTheme({ bulletStyle: b.id as any })}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-center transition-all ${
                        (theme.bulletStyle || 'circle') === b.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Break Guide Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Page Break Boundaries
                </label>
                <button
                  onClick={() => setTheme({ showPageBreakGuide: !theme.showPageBreakGuide })}
                  className={`w-full py-1.5 px-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                    theme.showPageBreakGuide
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Show 1-Page A4 Cutoff Line</span>
                  <span className={`w-3.5 h-3.5 rounded-full ${theme.showPageBreakGuide ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Current Font: <strong className="text-slate-900">{theme.fontFamily}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

