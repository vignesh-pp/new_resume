import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { resumeService } from '../../services/resumeService';
import { SavedResumeRecord } from '../../types/auth';
import { 
  X, FolderOpen, Plus, Copy, Trash2, Download, Search, 
  Calendar, CheckCircle, FileText, Sparkles, Shield, User as UserIcon
} from 'lucide-react';
import { exportUtils } from '../../utils/exportUtils';

interface MyResumesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyResumesModal: React.FC<MyResumesModalProps> = ({ isOpen, onClose }) => {
  const { 
    setResumeData, 
    setTemplate, 
    setCurrentResumeId, 
    currentResumeId,
    setActiveTab, 
    resetResume 
  } = useResumeStore();
  const { currentUser } = useAuthStore();

  const [resumes, setResumes] = useState<SavedResumeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'mine'>('all');

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const list = await resumeService.getResumes(currentUser);
      setResumes(list);
    } catch (e) {
      console.error('Error fetching resumes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleOpenResume = (rec: SavedResumeRecord) => {
    setResumeData(rec.content);
    setTemplate(rec.templateId);
    setCurrentResumeId(rec.id, rec.title);
    setActiveTab('editor');
    onClose();
  };

  const handleCreateNew = () => {
    resetResume();
    setActiveTab('editor');
    onClose();
  };

  const handleDuplicate = async (rec: SavedResumeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    await resumeService.duplicateResume(rec.id, currentUser);
    fetchResumes();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      await resumeService.deleteResume(id);
      if (currentResumeId === id) {
        setCurrentResumeId(null, null);
      }
      fetchResumes();
    }
  };

  const handleDownload = (rec: SavedResumeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    exportUtils.downloadPdf(`${rec.title.replace(/\s+/g, '_')}.pdf`);
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.templateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.userName && r.userName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentUser?.role === 'admin' && activeFilter === 'mine') {
      return matchesSearch && r.userId === currentUser.id;
    }
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">My Saved Resumes</h3>
                {currentUser?.role === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Admin View
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Manage, load, duplicate, and download your cloud-saved resumes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Blank</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search resumes by title or template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
            />
          </div>

          {currentUser?.role === 'admin' && (
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-medium shrink-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'all' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                All Users ({resumes.length})
              </button>
              <button
                onClick={() => setActiveFilter('mine')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'mine' ? 'bg-white shadow-2xs text-slate-900 font-semibold' : 'text-slate-600'
                }`}
              >
                My Resumes
              </button>
            </div>
          )}
        </div>

        {/* Resumes List */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-2.5 pr-1 py-1 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading resumes...</div>
          ) : filteredResumes.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No saved resumes found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Save" in the top bar to save your current resume version, or create a new blank resume.
              </p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Resume</span>
              </button>
            </div>
          ) : (
            filteredResumes.map((rec) => {
              const isCurrent = currentResumeId === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => handleOpenResume(rec)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                    }`}>
                      <FileText className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {rec.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-600 text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="capitalize">{rec.templateId}</span>
                        <span>•</span>
                        <span>ATS {rec.atsScore}%</span>
                        <span>•</span>
                        <span>{new Date(rec.updatedAt).toLocaleDateString()}</span>
                        {currentUser?.role === 'admin' && rec.userName && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">By {rec.userName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleDuplicate(rec, e)}
                      title="Duplicate resume"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDownload(rec, e)}
                      title="Download PDF"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(rec.id, e)}
                      title="Delete resume"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>{filteredResumes.length} resumes saved</span>
          <span className="text-[11px]">Click any resume to load into editor & live preview</span>
        </div>
      </div>
    </div>
  );
};
