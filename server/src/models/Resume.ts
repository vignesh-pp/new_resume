import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId?: string;
  userEmail?: string;
  userName?: string;
  title: string;
  templateId: string;
  theme: {
    primary: string;
    secondary?: string;
    fontHeading?: string;
    fontBody?: string;
    fontSize?: string;
  };
  content: {
    personalInfo: Record<string, any>;
    summary: string;
    experience: Array<Record<string, any>>;
    education: Array<Record<string, any>>;
    skills: Record<string, any>;
    projects: Array<Record<string, any>>;
    certifications: Array<Record<string, any>>;
    customSections?: Array<Record<string, any>>;
    sectionOrder?: string[];
    visibleSections?: Record<string, boolean>;
  };
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: String, default: 'usr-alex-1', index: true },
    userEmail: { type: String, default: '' },
    userName: { type: String, default: '' },
    title: { type: String, default: 'Untitled Resume' },
    templateId: { type: String, default: 'classic-ats' },
    theme: {
      primary: { type: String, default: '#0f172a' },
      secondary: { type: String, default: '#3b82f6' },
      fontHeading: { type: String, default: 'Inter' },
      fontBody: { type: String, default: 'Inter' },
      fontSize: { type: String, default: 'normal' },
    },
    content: {
      personalInfo: { type: Schema.Types.Mixed, default: {} },
      summary: { type: String, default: '' },
      experience: { type: [Schema.Types.Mixed], default: [] },
      education: { type: [Schema.Types.Mixed], default: [] },
      skills: { type: Schema.Types.Mixed, default: {} },
      projects: { type: [Schema.Types.Mixed], default: [] },
      certifications: { type: [Schema.Types.Mixed], default: [] },
      customSections: { type: [Schema.Types.Mixed], default: [] },
      sectionOrder: { type: [String], default: [] },
      visibleSections: { type: Schema.Types.Mixed, default: {} },
    },
    atsScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);

