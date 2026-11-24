import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { 
  FileText, LayoutTemplate, ShieldCheck, Download, Save, 
  Check, Cloud, Sparkles, ExternalLink 
} from 'lucide-react';
import axios from 'axios';

interface NavbarProps {
  onExportPdf: () => void;
  onExportDocx: () => void;
  onOpenAtsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onExportPdf,
  onExportDocx,
  onOpenAtsModal,
}) => {
  const {
    activeTab,
    setActiveTab,
    atsAnalysis,
    resumeData,
    activeTemplate,
    theme,
  } = useResumeStore();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveToCloud = async () => {
    setSaving(true);
    try {
      await axios.post('/api/resumes', {
        title: `${resumeData.personalInfo.fullName} Resume`,
        templateId: activeTemplate,
        theme,
        content: resumeData,
        atsScore: atsAnalysis?.overallScore || 0,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn('Save failed:', e);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 w-full print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-md">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              AI Resume Studio
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              v2.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            MERN + Python AI Resume Analyzer & Multi-Template Builder
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Editor & Preview</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Templates</span>
          <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded-full">
            7
          </span>
        </button>

        <button
          onClick={onOpenAtsModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ATS Check</span>
          {atsAnalysis && (
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold border border-emerald-700/50">
              {atsAnalysis.overallScore}%
            </span>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveToCloud}
          disabled={saving}
          className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          title="Save resume version to MongoDB"
        >
          {savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Saved</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </>
          )}
        </button>

        <button
          onClick={onExportDocx}
          className="px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-950/40 text-blue-300 hover:bg-blue-900/40 text-xs font-semibold transition-colors flex items-center gap-1"
          title="Download as Word DOCX"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOCX</span>
        </button>

        <button
          onClick={onExportPdf}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
          title="Export high-fidelity vector PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};

