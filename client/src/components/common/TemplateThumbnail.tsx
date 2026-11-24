import React from 'react';
import { TemplateId } from '../../types/resume';
import { useTemplateStore } from '../../store/useTemplateStore';

interface TemplateThumbnailProps {
  templateId: TemplateId | string;
  primaryColor?: string;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  primaryColor = '#1e3a8a',
}) => {
  const getBaseLayout = useTemplateStore((state) => state.getBaseLayout);
  const layout = ['classic-ats', 'modern-pro', 'minimalist', 'executive', 'creative', 'technical', 'academic'].includes(templateId)
    ? templateId
    : getBaseLayout(templateId as any);

  switch (layout) {
    case 'classic-ats':
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] select-none font-serif text-slate-800 leading-tight">
          {/* Header */}
          <div className="text-center border-b border-slate-700 pb-1 mb-1">
            <div className="font-bold text-[9px] uppercase tracking-wider text-slate-950">ANDREW CLARK</div>
            <div className="text-[6.5px] text-slate-600 font-sans mt-0.5">Software Engineer • San Francisco, CA</div>
            <div className="text-[6px] text-slate-500 font-sans">andrew@example.com • +1 555-0199 • linkedin.com/in/andrew</div>
          </div>

          {/* Professional Summary */}
          <div className="mb-1">
            <div className="font-bold text-[7px] uppercase tracking-wide border-b border-slate-300 pb-0.5 mb-0.5 font-sans">
              Summary
            </div>
            <div className="text-slate-600 font-sans text-[5.5px] leading-snug line-clamp-2">
              Full-stack engineer with 6+ years designing scalable cloud backends, microservices, and reactive web applications.
            </div>
          </div>

          {/* Work Experience */}
          <div className="flex-1 mb-1">
            <div className="font-bold text-[7px] uppercase tracking-wide border-b border-slate-300 pb-0.5 mb-0.5 font-sans">
              Experience
            </div>
            <div className="font-sans mb-1">
              <div className="flex justify-between font-bold text-[6.5px] text-slate-900">
                <span>Senior Engineer — Apex Labs</span>
                <span className="text-slate-500 font-normal">2021 – Pres.</span>
              </div>
              <div className="text-slate-600 text-[5.5px] pl-1.5 flex items-start gap-1 mt-0.5">
                <span>•</span>
                <span>Scaled low-latency payment processing pipeline handling $45M+ annual volume.</span>
              </div>
              <div className="text-slate-600 text-[5.5px] pl-1.5 flex items-start gap-1">
                <span>•</span>
                <span>Mentored 8 mid-level devs; cut release deployment cycle times by 40%.</span>
              </div>
            </div>
          </div>

          {/* Education & Skills */}
          <div className="grid grid-cols-2 gap-2 pt-0.5 border-t border-slate-200 font-sans">
            <div>
              <div className="font-bold text-[6.5px] uppercase text-slate-800">Education</div>
              <div className="text-[5.5px] text-slate-700 font-semibold">B.S. Computer Science</div>
              <div className="text-[5px] text-slate-500">UC Berkeley (2017)</div>
            </div>
            <div>
              <div className="font-bold text-[6.5px] uppercase text-slate-800">Key Skills</div>
              <div className="text-[5.5px] text-slate-600">React, TypeScript, Node.js, AWS, Kubernetes</div>
            </div>
          </div>
        </div>
      );

    case 'modern-pro':
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] select-none font-sans text-slate-800 leading-tight">
          {/* Top colored accent line */}
          <div className="h-1 w-full rounded-full mb-1.5" style={{ backgroundColor: primaryColor }} />

          {/* Modern Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-1 mb-1">
            <div>
              <div className="font-extrabold text-[9px] tracking-tight text-slate-950">ELLEN JOHNSON</div>
              <div className="text-[6.5px] font-semibold" style={{ color: primaryColor }}>Lead Product Engineer</div>
            </div>
            <div className="text-[5.5px] text-slate-500 text-right">
              <div>ellen@dev.io</div>
              <div>San Jose, CA</div>
            </div>
          </div>

          {/* Experience with badges */}
          <div className="flex-1 mb-1">
            <div className="font-bold text-[7px] uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primaryColor }}>
              Career Track
            </div>
            <div className="mb-1">
              <div className="flex justify-between font-bold text-[6.5px] text-slate-900">
                <span>Staff Technologist @ Stripe</span>
                <span className="text-[5.5px] text-slate-400">2020 – Now</span>
              </div>
              <div className="text-slate-600 text-[5.5px] flex items-start gap-1 mt-0.5">
                <span className="text-blue-500 font-bold">•</span>
                <span>Engineered high-throughput event processing platform on Kubernetes.</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-bold text-[6.5px] text-slate-900">
                <span>Frontend Architect @ Vercel</span>
                <span className="text-[5.5px] text-slate-400">2017 – 2020</span>
              </div>
            </div>
          </div>

          {/* Skill Tag Pills */}
          <div className="pt-1 border-t border-slate-100">
            <div className="font-bold text-[6.5px] text-slate-800 mb-0.5">Tech Matrix:</div>
            <div className="flex flex-wrap gap-1">
              {['TypeScript', 'React 18', 'Go', 'Docker', 'GraphQL', 'Kafka'].map((sk) => (
                <span key={sk} className="bg-slate-100 text-slate-700 text-[5px] px-1 py-0.2 rounded font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'minimalist':
      return (
        <div className="w-full h-full bg-white p-3 flex flex-col justify-between text-[7px] select-none font-sans text-zinc-800 leading-tight">
          {/* Swiss Minimal Header */}
          <div className="mb-2">
            <div className="font-light text-[10px] uppercase tracking-widest text-zinc-950">SCARLETT ANDERSON</div>
            <div className="text-[6px] tracking-wider uppercase text-zinc-400 mt-0.5">Creative Technologist — New York</div>
          </div>

          {/* Clean dividers */}
          <div className="flex-1 space-y-1.5">
            <div>
              <div className="text-[6.5px] font-semibold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-0.5 mb-0.5">
                Selected Experience
              </div>
              <div className="flex justify-between text-[6px] font-medium text-zinc-900">
                <span>Principal Designer, Pentagram</span>
                <span className="text-zinc-400 font-light">2019 – Present</span>
              </div>
              <div className="text-zinc-500 text-[5.5px] pl-1.5 border-l border-zinc-200 mt-0.5">
                Spearheaded digital brand identity systems and design systems across Fortune 100 brands.
              </div>
            </div>

            <div>
              <div className="text-[6.5px] font-semibold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-0.5 mb-0.5">
                Competencies
              </div>
              <div className="text-zinc-600 text-[5.5px] font-light">
                Design Architecture • React • Figma • Micro-interactions • Design Tokens
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="pt-1 border-t border-zinc-100 flex justify-between text-[5.5px] text-zinc-500 font-light">
            <span>B.F.A. Interactive Media — RISD</span>
            <span>Honors Class of 2018</span>
          </div>
        </div>
      );

    case 'executive':
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] select-none font-serif text-slate-900 leading-tight">
          {/* Double Border Executive Header */}
          <div className="border-b-2 border-slate-900 pb-1 mb-1">
            <div className="font-normal text-[9.5px] uppercase tracking-wider text-slate-950 font-serif" style={{ color: primaryColor }}>
              MARCUS VANCE
            </div>
            <div className="text-[6px] tracking-widest uppercase text-slate-600 font-sans">
              Vice President of Engineering & Technology
            </div>
            <div className="text-[5.5px] text-slate-500 font-sans mt-0.5">
              New York, NY | +1 555-0144 | marcus.vance@board.org | Executive Portfolio
            </div>
          </div>

          {/* Executive Summary Callout Box */}
          <div className="bg-slate-50 border-l-2 p-1 mb-1" style={{ borderColor: primaryColor }}>
            <div className="font-bold text-[6px] uppercase font-sans text-slate-800">Executive Scope</div>
            <div className="text-[5.5px] text-slate-700 font-sans line-clamp-2">
              Transformative tech leader overseeing 140+ engineers across 4 global regions, driving $120M ARR growth.
            </div>
          </div>

          {/* Career History */}
          <div className="flex-1 mb-1 font-sans">
            <div className="font-bold text-[6.5px] uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-0.5">
              Leadership Experience
            </div>
            <div className="mb-0.5">
              <div className="flex justify-between font-bold text-[6px] text-slate-900">
                <span>VP Engineering — Oracle Cloud</span>
                <span className="text-slate-500">2019 – Present</span>
              </div>
              <div className="text-slate-600 text-[5px] pl-1 border-l border-slate-300">
                Led global cloud migration saving $18M OPEX while maintaining 99.999% SLA.
              </div>
            </div>
          </div>

          {/* Board Governance & Education */}
          <div className="pt-0.5 border-t border-slate-200 flex justify-between font-sans text-[5.5px] text-slate-600">
            <span><strong>M.B.A.</strong> — Columbia Business School</span>
            <span><strong>B.S.</strong> — MIT</span>
          </div>
        </div>
      );

    case 'creative':
      return (
        <div className="w-full h-full bg-white flex text-[7px] select-none font-sans shadow-xs overflow-hidden">
          {/* 35% Slate Sidebar */}
          <div className="w-[36%] bg-slate-900 text-slate-200 p-2 flex flex-col justify-between">
            <div>
              {/* Avatar circle */}
              <div className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-white text-[8px] mb-1 shadow-xs" style={{ backgroundColor: primaryColor }}>
                SL
              </div>
              <div className="font-bold text-[7.5px] text-white leading-none">SOPHIA LIN</div>
              <div className="text-[5.5px] text-slate-400">Design Director</div>

              <div className="mt-2 space-y-0.5 text-[5px] text-slate-300">
                <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-0.2">Contact</div>
                <div>sophia@lin.studio</div>
                <div>Austin, TX</div>
                <div>dribbble.com/sophia</div>
              </div>

              <div className="mt-2 space-y-0.5 text-[5px]">
                <div className="text-[5.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-0.2">Stack</div>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {['Figma', 'React', 'Motion', 'Design Systems'].map((s) => (
                    <span key={s} className="bg-slate-800 px-1 py-0.2 rounded text-[4.5px] text-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-[5px] text-slate-400 pt-1 border-t border-slate-800">
              M.S. HCI — Stanford
            </div>
          </div>

          {/* 65% Main Content */}
          <div className="w-[64%] p-2 flex flex-col justify-between bg-white text-slate-800">
            <div>
              <div className="font-bold text-[7px] uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primaryColor }}>
                Profile
              </div>
              <div className="text-[5.5px] text-slate-600 leading-snug line-clamp-2">
                Award-winning creative director blending user research, motion graphics, and front-end engineering.
              </div>
            </div>

            <div className="flex-1 my-1">
              <div className="font-bold text-[7px] uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1" style={{ borderColor: primaryColor }}>
                Featured Projects
              </div>
              <div className="p-1 bg-slate-50 rounded border border-slate-100 mb-1">
                <div className="font-bold text-[6px] text-slate-900">Fintech Design System ↗</div>
                <div className="text-[5px] text-slate-500">Adopted by 40+ product squads at scale.</div>
              </div>
              <div className="p-1 bg-slate-50 rounded border border-slate-100">
                <div className="font-bold text-[6px] text-slate-900">AI Workspace App ↗</div>
                <div className="text-[5px] text-slate-500">Fast Company Innovation by Design Honoree.</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'technical':
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] select-none font-mono text-slate-900 leading-tight">
          {/* Terminal Header */}
          <div className="border-b-2 border-teal-600 pb-1 mb-1">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-[8.5px] text-slate-950">&gt; DAVID CHEN</div>
                <div className="text-[6px] text-slate-600">// Principal Systems Architect</div>
              </div>
              <div className="text-[5px] text-slate-500 text-right">
                <div>david@kernel.sh</div>
                <div>github.com/dchen</div>
              </div>
            </div>
          </div>

          {/* Technical Matrix */}
          <div className="bg-slate-50 p-1 rounded border border-slate-200 mb-1">
            <div className="font-bold text-[6px] text-teal-700 uppercase">[01] Stack Matrix</div>
            <div className="grid grid-cols-2 gap-1 text-[5px] text-slate-700 mt-0.5">
              <div><strong>Langs:</strong> Go, Rust, C++, Python</div>
              <div><strong>Cloud:</strong> AWS, K8s, Terraform</div>
            </div>
          </div>

          {/* Work History */}
          <div className="flex-1 mb-1">
            <div className="font-bold text-[6px] text-teal-700 border-b border-slate-200 pb-0.2 mb-0.5 uppercase">
              [02] Work History
            </div>
            <div className="mb-0.5">
              <div className="flex justify-between font-bold text-[6px]">
                <span>Senior Infrastructure Architect @ Datadog</span>
                <span className="text-slate-500 font-normal">2020 - Pres</span>
              </div>
              <div className="text-[5px] text-slate-600 pl-1">
                # Engineered eBPF observability agent tracing 10M+ events/sec.
              </div>
            </div>
          </div>

          {/* Open Source */}
          <div className="pt-0.5 border-t border-slate-200 text-[5px] text-slate-600">
            <strong>Open Source:</strong> 2.4k GitHub Stars • Linux kernel contributor
          </div>
        </div>
      );

    case 'academic':
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] select-none font-serif text-gray-900 leading-tight">
          {/* Formal Scholarly Header */}
          <div className="text-center border-b border-gray-400 pb-1 mb-1">
            <div className="font-bold text-[9px] uppercase tracking-wider text-gray-950 font-serif">
              DR. ELEANOR ROUSSEAU, PH.D.
            </div>
            <div className="text-[6px] italic text-gray-700 font-serif">
              Associate Professor of Computer Science & Artificial Intelligence
            </div>
            <div className="text-[5px] text-gray-600 font-sans mt-0.5">
              Harvard University • Cambridge, MA • e.rousseau@seas.harvard.edu
            </div>
          </div>

          {/* Research Statement */}
          <div className="mb-1">
            <div className="font-bold text-[6.5px] uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.2 mb-0.5 font-serif">
              Research Focus
            </div>
            <div className="text-[5.5px] text-gray-700 text-justify line-clamp-2">
              Investigating neural algorithmic reasoning, provable safety constraints in deep reinforcement learning, and automated verification.
            </div>
          </div>

          {/* Academic Appointments */}
          <div className="flex-1 mb-1">
            <div className="font-bold text-[6.5px] uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-0.2 mb-0.5 font-serif">
              Appointments & Experience
            </div>
            <div className="mb-0.5">
              <div className="flex justify-between font-bold text-[6px] text-gray-950">
                <span>Associate Professor, Harvard SEAS</span>
                <span className="text-gray-500 font-sans font-normal">2021 – Present</span>
              </div>
              <div className="text-[5px] text-gray-600 pl-1">
                Principal Investigator, Algorithmic Intelligence Lab (NSF CAREER Awardee).
              </div>
            </div>
          </div>

          {/* Publications */}
          <div className="pt-0.5 border-t border-gray-300 text-[5px] text-gray-700">
            <div className="font-bold text-[6px] text-gray-900 font-serif mb-0.2">Selected Publications:</div>
            <div className="italic">[1] Nature Machine Intelligence (2023) • NeurIPS Outstanding Paper (2022)</div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-white p-2.5 flex flex-col justify-between text-[7px] text-slate-800">
          <div className="font-bold text-[9px]">RESUME TEMPLATE</div>
          <div className="text-[6px] text-slate-500">Standard Layout</div>
        </div>
      );
  }
};
