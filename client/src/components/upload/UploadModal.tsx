import React, { useState, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { X, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisTrigger: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAnalysisTrigger,
}) => {
  const { setResumeData, setActiveTab } = useResumeStore();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith('.pdf') &&
      !file.name.endsWith('.docx') &&
      !file.name.endsWith('.doc')
    ) {
      setError('Please upload a valid PDF or Word DOCX document.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const resp = await axios.post('/api/ai/parse-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000,
      });

      if (resp.data?.success && resp.data.data) {
        setResumeData(resp.data.data);
        setActiveTab('editor');
        onClose();
        // Trigger ATS analysis on newly parsed resume
        setTimeout(() => {
          onAnalysisTrigger();
        }, 400);
      } else {
        throw new Error(resp.data?.error || 'Extraction failed');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(
        err.response?.data?.error || err.message || 'Failed to process document with AI service.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload & Analyze Resume</h3>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, and TXT files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            {selectedFile ? (
              <div>
                <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB — Click to change file
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select or drag and drop your resume file
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  AI will extract your contact info, work experience, education & skills
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleUploadAndAnalyze}
            disabled={!selectedFile || uploading}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Extracting Structured Data with PyMuPDF...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Parse & Load into Builder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
