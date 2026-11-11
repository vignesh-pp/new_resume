import { FontOption } from '../types/resume';

export interface FontMeta {
  id: FontOption;
  name: string;
  category: 'Modern Sans' | 'Classic Serif' | 'Tech Monospace' | 'Editorial Display';
  cssClass: string;
  fontFamily: string;
  bestFor: string;
}

export const AVAILABLE_FONTS: FontMeta[] = [
  {
    id: 'Inter',
    name: 'Inter',
    category: 'Modern Sans',
    cssClass: 'font-sans',
    fontFamily: "'Inter', sans-serif",
    bestFor: 'Modern tech, ATS optimization, ultra-crisp digital clarity',
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Modern Sans',
    cssClass: 'font-jakarta',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    bestFor: 'Modern tech startups, high-end SaaS, sleek typography',
  },
  {
    id: 'Roboto',
    name: 'Roboto',
    category: 'Modern Sans',
    cssClass: 'font-sans',
    fontFamily: "'Roboto', sans-serif",
    bestFor: 'Universal readability, standard corporate ATS compatibility',
  },
  {
    id: 'Montserrat',
    name: 'Montserrat',
    category: 'Modern Sans',
    cssClass: 'font-montserrat',
    fontFamily: "'Montserrat', sans-serif",
    bestFor: 'Bold geometric headings, strong personal branding',
  },
  {
    id: 'Poppins',
    name: 'Poppins',
    category: 'Editorial Display',
    cssClass: 'font-display',
    fontFamily: "'Poppins', sans-serif",
    bestFor: 'Creative roles, UI/UX designers, modern product leads',
  },
  {
    id: 'Merriweather',
    name: 'Merriweather',
    category: 'Classic Serif',
    cssClass: 'font-serif',
    fontFamily: "'Merriweather', serif",
    bestFor: 'Executive leadership, legal, academia, high prestige',
  },
  {
    id: 'Playfair Display',
    name: 'Playfair Display',
    category: 'Editorial Display',
    cssClass: 'font-playfair',
    fontFamily: "'Playfair Display', serif",
    bestFor: 'Executive directors, luxury branding, editorial portfolios',
  },
  {
    id: 'Lora',
    name: 'Lora',
    category: 'Classic Serif',
    cssClass: 'font-lora',
    fontFamily: "'Lora', serif",
    bestFor: 'Refined long-form reading, academic CVs, research',
  },
  {
    id: 'JetBrains Mono',
    name: 'JetBrains Mono',
    category: 'Tech Monospace',
    cssClass: 'font-mono',
    fontFamily: "'JetBrains Mono', monospace",
    bestFor: 'Software developers, DevOps, systems engineers, cloud architects',
  },
  {
    id: 'Fira Code',
    name: 'Fira Code',
    category: 'Tech Monospace',
    cssClass: 'font-mono',
    fontFamily: "'Fira Code', monospace",
    bestFor: 'Backend & algorithm engineers, technical resumes',
  },
];

export function getFontFamilyCss(font: FontOption): string {
  const match = AVAILABLE_FONTS.find((f) => f.id === font);
  return match ? match.fontFamily : "'Inter', sans-serif";
}

export function getFontSizeClasses(size: string): { body: string; h1: string; h2: string; h3: string } {
  switch (size) {
    case 'compact':
      return { body: 'text-[11.5px] leading-tight', h1: 'text-2xl', h2: 'text-xs', h3: 'text-xs' };
    case 'relaxed':
      return { body: 'text-[13.5px] leading-relaxed', h1: 'text-3xl', h2: 'text-sm', h3: 'text-sm' };
    case 'large':
      return { body: 'text-[14px] leading-relaxed', h1: 'text-4xl', h2: 'text-base', h3: 'text-sm' };
    case 'normal':
    default:
      return { body: 'text-xs leading-normal', h1: 'text-2xl sm:text-3xl', h2: 'text-xs sm:text-sm', h3: 'text-xs' };
  }
}

export function getBulletIcon(style?: string) {
  switch (style) {
    case 'dash':
      return '—';
    case 'diamond':
      return '◆';
    case 'caret':
      return '›';
    case 'check':
      return '✓';
    case 'circle':
    default:
      return '•';
  }
}

