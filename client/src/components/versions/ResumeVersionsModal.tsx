import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { X, FolderOpen, Trash2, Clock, Check, Plus, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface ResumeVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeVersionsModal: React.FC<ResumeVersionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setResumeData, setTemplate, setTheme } = useResumeStore();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeLoadedId, setActiveLoadedId] = useState<string | null>(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const resp = await axios.get('/api/resumes');
      if (resp.data?.success) {
        setResumes(resp.data.data || []);
      }
    } catch (e) {
      console.warn('Failed to fetch resumes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoadResume = (item: any) => {
    if (item.content) {
      setResumeData(item.content);
    }
    if (item.templateId) {
      setTemplate(item.templateId);
    }
    if (item.theme) {
      setTheme(item.theme);
    }
    setActiveLoadedId(item._id);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleDeleteResume = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/resumes/${id}`);
      setResumes(resumes.filter((r) => r._id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Resume Versions</h3>
              <p className="text-xs text-slate-500">Stored in MongoDB database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <p className="text-center py-8 text-xs text-slate-500">Loading saved resumes...</p>
          ) : resumes.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-xs font-semibold text-slate-700">No saved resumes found yet</p>
              <p className="text-[11px] text-slate-500">
                Click "Save" in the top bar to persist your resume to MongoDB!
              </p>
            </div>
          ) : (
            resumes.map((item) => (
              <div
                key={item._id}
                onClick={() => handleLoadResume(item)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.title || 'Untitled Resume'}</h4>
                    <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 capitalize">
                      {item.templateId || 'classic-ats'}
                    </span>
                    {item.atsScore > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {item.atsScore}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recently'}
                    </span>
                    {item.content?.personalInfo?.fullName && (
                      <span>• {item.content.personalInfo.fullName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeLoadedId === item._id && (
                    <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Loaded
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDeleteResume(e, item._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete version"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
