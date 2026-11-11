import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { TemplateStrip } from './TemplateStrip';
import { 
  ZoomIn, ZoomOut, RotateCcw, Printer, Download, Type, 
  Eye, FileText, Maximize2 
} from 'lucide-react';

interface ResumePreviewProps {
  onPrint?: () => void;
  onDownloadPdf?: () => void;
  onDownloadDocx?: () => void;
  onOpenFontModal?: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  onPrint,
  onDownloadPdf,
  onDownloadDocx,
  onOpenFontModal,
}) => {
  const { resumeData, activeTemplate, theme, zoom, setZoom, setTheme } = useResumeStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(Math.min(1.4, zoom + 0.1));
  const handleZoomOut = () => setZoom(Math.max(0.6, zoom - 0.1));
  const handleZoomReset = () => setZoom(1.0);
  const handleFitPage = () => setZoom(0.85);

  return (
    <div className="flex flex-col h-full bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
      {/* Visual Template Quick-Switcher Strip */}
      <TemplateStrip />

      {/* Preview Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-white border-b border-slate-200 gap-2 z-10">
        <div className="flex items-center gap-2">
          {onOpenFontModal && (
            <button
              onClick={onOpenFontModal}
              className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Font: {theme.fontFamily}</span>
            </button>
          )}

          <button
            onClick={() => setTheme({ showPageBreakGuide: !theme.showPageBreakGuide })}
            className={`px-2 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
              theme.showPageBreakGuide
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle 1-page A4 cutoff guide"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1-Page Line</span>
          </button>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-700 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitPage}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white text-[10px] font-semibold px-1"
              title="Fit to Height"
            >
              Fit
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Reset 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onPrint && (
            <button
              onClick={onPrint}
              className="p-1.5 px-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Print Resume"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="p-1.5 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Download Vector PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          )}

          {onDownloadDocx && (
            <button
              onClick={onDownloadDocx}
              className="p-1.5 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Download Word Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Sheet Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          ref={printRef}
          id="resume-printable-area"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-full max-w-[800px] bg-white shadow-2xl rounded-sm print:transform-none print:shadow-none print:m-0 print:p-0"
        >
          {/* Optional A4 1-Page Cutoff Guide Line */}
          {theme.showPageBreakGuide && (
            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 z-20 pointer-events-none flex items-center justify-end pr-4"
              style={{ top: '1050px' }}
            >
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                ✂ 1-Page A4 Cutoff Boundary
              </span>
            </div>
          )}

          <ResumeRenderer
            templateId={activeTemplate}
            resumeData={resumeData}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
