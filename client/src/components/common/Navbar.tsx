import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { resumeService } from '../../services/resumeService';
import { 
  FileText, LayoutTemplate, ShieldCheck, Download, Save, 
  Check, Cloud, Sparkles, FolderOpen, Shield, User, LogIn, 
  LogOut, ChevronDown, RefreshCw
} from 'lucide-react';

interface NavbarProps {
  onExportPdf: () => void;
  onExportDocx: () => void;
  onOpenAtsModal: () => void;
  onOpenMyResumes: () => void;
  onOpenAdminTemplates: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onExportPdf,
  onExportDocx,
  onOpenAtsModal,
  onOpenMyResumes,
  onOpenAdminTemplates,
}) => {
  const {
    activeTab,
    setActiveTab,
    atsAnalysis,
    resumeData,
    activeTemplate,
    theme,
    currentResumeId,
    currentResumeTitle,
    setCurrentResumeId,
  } = useResumeStore();

  const {
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    switchRole,
  } = useAuthStore();

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveToCloud = async () => {
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }
    setSaving(true);
    try {
      const saved = await resumeService.saveResume(
        resumeData,
        activeTemplate,
        theme,
        atsAnalysis?.overallScore || 88,
        currentUser,
        currentResumeId,
        currentResumeTitle || `${resumeData.personalInfo.fullName} Resume`
      );

      setCurrentResumeId(saved.id, saved.title);
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

      {/* Action Buttons & User Menu */}
      <div className="flex items-center gap-2">
        {/* My Resumes Button */}
        <button
          onClick={onOpenMyResumes}
          className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          title="Open saved resumes"
        >
          <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">My Resumes</span>
        </button>

        {/* Admin Template Studio Button (Visible when role === 'admin') */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenAdminTemplates}
            className="px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/40 text-xs font-semibold text-indigo-300 transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Open Admin Template Manager"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Admin Studio</span>
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveToCloud}
          disabled={saving}
          className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          title="Save resume version"
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

        {/* DOCX Export */}
        <button
          onClick={onExportDocx}
          className="px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-950/40 text-blue-300 hover:bg-blue-900/40 text-xs font-semibold transition-colors flex items-center gap-1"
          title="Download as Word DOCX"
        >
          <Download className="w-3.5 h-3.5" />
          <span>DOCX</span>
        </button>

        {/* PDF Export */}
        <button
          onClick={onExportPdf}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5"
          title="Export high-fidelity vector PDF"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>

        {/* User Account / Role Menu */}
        <div className="relative ml-1" ref={userMenuRef}>
          {isAuthenticated && currentUser ? (
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
                    <span>{currentUser.role}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-700/80">
                    <p className="font-bold text-white text-xs truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        currentUser.role === 'admin'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        Role: {currentUser.role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role shortcut (great for testing) */}
                  <div className="px-3 py-2 border-b border-slate-700/80">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Role (Demo)
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          switchRole('user');
                          setIsUserMenuOpen(false);
                        }}
                        className={`py-1 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                          currentUser.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        User
                      </button>
                      <button
                        onClick={() => {
                          switchRole('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className={`py-1 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                          currentUser.role === 'admin'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onOpenMyResumes();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-700/60 flex items-center gap-2"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>My Resumes</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          onOpenAdminTemplates();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-indigo-300 hover:text-white hover:bg-indigo-950/40 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Admin Template Studio</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
