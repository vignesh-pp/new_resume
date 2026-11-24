import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeRenderer } from '../templates/ResumeRenderer';
import { 
  ZoomIn, ZoomOut, RotateCcw, Printer, Download, 
  FileText, Sparkles, Move, Eye 
} from 'lucide-react';

interface ResumePreviewProps {
  onPrint?: () => void;
  onDownloadPdf?: () => void;
  onDownloadDocx?: () => void;
  onOpenFontModal?: () => void;
  onOpenLayoutModal?: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  onPrint,
  onDownloadPdf,
  onDownloadDocx,
}) => {
  const { resumeData, activeTemplate, theme, zoom, setZoom, setTheme, openPreviewModal } = useResumeStore();
  const printRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoom(Math.max(0.6, Number((zoom - 0.1).toFixed(1))));
  const handleZoomReset = () => setZoom(1.0);
  const handleFitPage = () => setZoom(0.85);

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-200/90 rounded-2xl overflow-hidden border border-slate-300 shadow-inner print:bg-white print:border-none print:shadow-none print:p-0 print:m-0 print:h-auto print:overflow-visible">
      {/* Pinned Top Control Bar: Page Fit, A4 Line, Zoom, Export */}
      <div className="shrink-0 z-20 bg-white border-b border-slate-200 shadow-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Drag & Reorder hint badge */}
          <div 
            className="px-2.5 py-1.5 rounded-lg border border-purple-200 bg-purple-50/80 text-purple-700 flex items-center gap-1.5 text-xs font-semibold select-none shadow-2xs"
            title="Hover over any section on the resume to drag, reorder, or move with ↑ ↓ live!"
          >
            <Move className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Drag & Reorder Live</span>
          </div>

          {/* 1-Page Auto-Fit Toggle */}
          <button
            onClick={() => setTheme({ fitToSinglePage: !theme.fitToSinglePage })}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              theme.fitToSinglePage
                ? 'border-blue-300 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
            title="Automatically optimize spacing, margins and line-heights to fit cleanly on 1 page"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{theme.fitToSinglePage ? '1-Page Fit: ON' : '1-Page Fit: OFF'}</span>
          </button>

          {/* A4 Line */}
          <button
            onClick={() => setTheme({ showPageBreakGuide: !theme.showPageBreakGuide })}
            className={`px-2 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs ${
              theme.showPageBreakGuide
                ? 'border-blue-300 bg-blue-50 text-blue-800 font-semibold'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle 1-page A4 cutoff guide"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">A4 Line</span>
          </button>

          {/* Full Template Preview in Modal */}
          <button
            onClick={() => openPreviewModal(activeTemplate)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50/50 hover:border-blue-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
            title="Open interactive template preview modal"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Preview Modal</span>
          </button>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom group */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-700 min-w-[42px] text-center font-bold">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitPage}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white text-[10px] font-semibold px-1.5 transition-colors"
              title="Fit to Height"
            >
              Fit
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              title="Reset 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {onPrint && (
            <button
              onClick={onPrint}
              className="p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-2xs"
              title="Print or Save as Vector PDF (Native Chrome Engine with Selectable Text)"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print / Vector PDF</span>
            </button>
          )}

          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="p-1.5 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
              title="Direct PDF Download with Smart Auto-Fit"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          )}

          {onDownloadDocx && (
            <button
              onClick={onDownloadDocx}
              className="p-1.5 px-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs font-semibold shadow-2xs"
              title="Download Word Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>
          )}
        </div>
      </div>

      {/* Smoothly Scrollable Resume Viewport with Comfortable Bottom Spacing */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 sm:p-8 pb-40 custom-scrollbar flex justify-center items-start print:p-0 print:m-0 print:overflow-visible print:h-auto">
        {/* Scaling Wrapper that expands scrollable boundaries */}
        <div
          className="resume-scale-wrapper flex justify-center shrink-0 my-2 print:m-0 print:p-0 print:w-full print:block"
          style={{
            width: `${800 * zoom}px`,
            paddingBottom: `${120 * zoom}px`,
            transition: 'width 0.15s ease-out',
          }}
        >
          <div
            ref={printRef}
            id="resume-printable-area"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: '800px',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative bg-white shadow-2xl rounded-md print:transform-none print:shadow-none print:m-0 print:p-0 ring-1 ring-slate-900/5 select-text"
          >
            {/* Optional A4 1-Page Cutoff Guide Line (800px * 297/210 = 1131.43px) */}
            {theme.showPageBreakGuide && (
              <div 
                className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 z-20 pointer-events-none flex items-center justify-end pr-4 print:hidden"
                style={{ top: '1131px' }}
                data-html2canvas-ignore="true"
              >
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  ✂ A4 1-Page Cutoff (1131px)
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
    </div>
  );
};
