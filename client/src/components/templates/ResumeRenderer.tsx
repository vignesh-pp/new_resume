import React from 'react';
import { ResumeSchema, TemplateId, ThemeSettings } from '../../types/resume';
import { ClassicAtsTemplate } from './ClassicAtsTemplate';
import { ModernTemplate } from './ModernTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { TechnicalTemplate } from './TechnicalTemplate';
import { AcademicTemplate } from './AcademicTemplate';

interface ResumeRendererProps {
  templateId: TemplateId;
  resumeData: ResumeSchema;
  theme: ThemeSettings;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({
  templateId,
  resumeData,
  theme,
}) => {
  switch (templateId) {
    case 'classic-ats':
      return <ClassicAtsTemplate resumeData={resumeData} theme={theme} />;
    case 'modern-pro':
      return <ModernTemplate resumeData={resumeData} theme={theme} />;
    case 'minimalist':
      return <MinimalistTemplate resumeData={resumeData} theme={theme} />;
    case 'executive':
      return <ExecutiveTemplate resumeData={resumeData} theme={theme} />;
    case 'creative':
      return <CreativeTemplate resumeData={resumeData} theme={theme} />;
    case 'technical':
      return <TechnicalTemplate resumeData={resumeData} theme={theme} />;
    case 'academic':
      return <AcademicTemplate resumeData={resumeData} theme={theme} />;
    default:
      return <ClassicAtsTemplate resumeData={resumeData} theme={theme} />;
  }
};
