import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { GripVertical, ArrowUp, ArrowDown, EyeOff, Edit3, Check } from 'lucide-react';

interface DraggableSectionProps {
  sectionId: string;
  children: React.ReactNode;
  index?: number;
  total?: number;
  customLabel?: string;
}

const DEFAULT_LABELS: Record<string, string> = {
  summary: 'Summary',
  experience: 'Work Experience',
  skills: 'Skills & Tech',
  projects: 'Projects',
  education: 'Education',
  certifications: 'Certifications',
};

export const DraggableSection: React.FC<DraggableSectionProps> = ({
  sectionId,
  children,
  index = 0,
  total = 1,
  customLabel,
}) => {
  const { resumeData, moveSectionOrder, moveSectionToPosition, toggleSectionVisibility, updateSectionTitle } = useResumeStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<'top' | 'bottom' | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  if (!children) return null;

  // Resolve section human-readable label
  const label =
    customLabel ||
    resumeData.sectionTitles?.[sectionId] ||
    DEFAULT_LABELS[sectionId] ||
    resumeData.customSections?.find((s) => s.id === sectionId)?.title ||
    sectionId;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', sectionId);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropIndicator(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const midPoint = rect.top + rect.height / 2;
    if (e.clientY < midPoint) {
      if (dropIndicator !== 'top') setDropIndicator('top');
    } else {
      if (dropIndicator !== 'bottom') setDropIndicator('bottom');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if exiting outer container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropIndicator(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceKey = e.dataTransfer.getData('text/plain');
    if (sourceKey && sourceKey !== sectionId) {
      moveSectionToPosition(sourceKey, sectionId, dropIndicator === 'bottom' ? 'after' : 'before');
    }
    setDropIndicator(null);
    setIsDragging(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative transition-all duration-150 ${
        isDragging ? 'opacity-30 border-2 border-dashed border-blue-400 rounded-lg p-1' : ''
      }`}
    >
      {/* Top Drop Indicator Line */}
      {dropIndicator === 'top' && (
        <div
          data-html2canvas-ignore="true"
          className="absolute -top-1.5 left-0 right-0 h-1 bg-blue-600 rounded-full shadow-md z-30 pointer-events-none print:hidden flex items-center justify-center animate-pulse"
        >
          <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs -top-3 relative select-none">
            Drop before {label}
          </span>
        </div>
      )}

      {/* Floating Action Bar on Hover (Ignored by canvas / print) */}
      <div
        data-html2canvas-ignore="true"
        className="absolute -top-3.5 right-2 z-20 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-lg backdrop-blur-xs border border-white/20 print:hidden transition-opacity select-none cursor-default"
      >
        {isEditingTitle ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tempTitle.trim()) {
                updateSectionTitle(sectionId, tempTitle.trim());
              }
              setIsEditingTitle(false);
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1"
          >
            <input
              type="text"
              autoFocus
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              placeholder={label}
              className="px-1.5 py-0.5 text-[11px] font-semibold text-slate-900 bg-white rounded border border-blue-400 focus:outline-none w-32"
            />
            <button
              type="submit"
              className="p-0.5 text-emerald-400 hover:text-emerald-300"
              title="Save Title"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsEditingTitle(false)}
              className="p-0.5 text-slate-400 hover:text-white text-[10px]"
            >
              ✕
            </button>
          </form>
        ) : (
          <>
            {/* Drag Handle */}
            <div
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-1 cursor-grab active:cursor-grabbing font-semibold text-slate-200 hover:text-white"
              title="Drag to move section anywhere"
            >
              <GripVertical className="w-3.5 h-3.5 text-blue-400" />
              <span>{label}</span>
            </div>

            {/* Quick Rename Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTempTitle(label);
                setIsEditingTitle(true);
              }}
              className="p-0.5 hover:text-cyan-300 transition-colors"
              title="Rename section heading"
            >
              <Edit3 className="w-3 h-3 text-slate-400 hover:text-cyan-300" />
            </button>
          </>
        )}

        <span className="w-px h-3 bg-slate-700 mx-0.5" />

        {/* Move Up */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveSectionOrder(sectionId, 'up');
          }}
          disabled={index <= 0}
          className="p-0.5 hover:text-blue-300 disabled:opacity-25 disabled:hover:text-white transition-colors"
          title="Move up"
        >
          <ArrowUp className="w-3 h-3" />
        </button>

        {/* Move Down */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            moveSectionOrder(sectionId, 'down');
          }}
          disabled={index >= total - 1}
          className="p-0.5 hover:text-blue-300 disabled:opacity-25 disabled:hover:text-white transition-colors"
          title="Move down"
        >
          <ArrowDown className="w-3 h-3" />
        </button>

        <span className="w-px h-3 bg-slate-700 mx-0.5" />

        {/* Hide Section */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSectionVisibility(sectionId);
          }}
          className="p-0.5 hover:text-amber-300 transition-colors"
          title="Hide this section"
        >
          <EyeOff className="w-3 h-3 text-slate-400 hover:text-amber-300" />
        </button>
      </div>

      {/* Render Actual Resume Section Content */}
      <div className="group-hover:ring-1 group-hover:ring-blue-400/40 rounded-sm transition-all">
        {children}
      </div>

      {/* Bottom Drop Indicator Line */}
      {dropIndicator === 'bottom' && (
        <div
          data-html2canvas-ignore="true"
          className="absolute -bottom-1.5 left-0 right-0 h-1 bg-blue-600 rounded-full shadow-md z-30 pointer-events-none print:hidden flex items-center justify-center animate-pulse"
        >
          <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs -bottom-3 relative select-none">
            Drop after {label}
          </span>
        </div>
      )}
    </div>
  );
};
