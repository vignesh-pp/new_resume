import axios from 'axios';
import { ResumeSchema, TemplateId } from '../types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportUtils = {
  // 1. High fidelity browser print to PDF
  printResume() {
    window.print();
  },

  // 2. Direct client-side PDF download using html2canvas & jsPDF with smart pagination
  async downloadPdf(filename = 'resume.pdf') {
    const element = document.getElementById('resume-printable-area');
    if (!element) {
      window.print();
      return;
    }

    try {
      // Temporarily remove transform for clean capture
      const originalTransform = element.style.transform;
      element.style.transform = 'none';

      // Use scale 2.5 for crisp 300 DPI text without memory overflow
      const scale = 2.5;
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });

      element.style.transform = originalTransform;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const mmPerPx = pdfWidth / (canvas.width / scale);
      const totalDocHeightMm = (canvas.height / scale) * mmPerPx;

      // Smart 1-Page Fit:
      // If the document is within ~335mm (up to ~12% overflow of standard A4 297mm),
      // scale it to fit on a pristine single page with ZERO orphan 1-line spills!
      if (totalDocHeightMm <= 335) {
        const imgData = canvas.toDataURL('image/png');
        const renderHeightMm = Math.min(pdfHeight, totalDocHeightMm);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderHeightMm);
        pdf.save(filename);
        return;
      }

      // Multi-page smart boundary slicing:
      // Prevents text lines, bullet points, and section headers from being sliced horizontally in half
      const breakNodes = Array.from(element.querySelectorAll('.resume-section, .resume-item, h2, h3'));
      const rootRect = element.getBoundingClientRect();
      const nodeOffsetsPx = breakNodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: (rect.top - rootRect.top) * scale,
          bottom: (rect.bottom - rootRect.top) * scale,
        };
      });

      const pageHeightCanvas = (canvas.width * (pdfHeight / pdfWidth));
      let currentCanvasY = 0;
      let pageIndex = 0;

      while (currentCanvasY < canvas.height - 10) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const remainingHeight = canvas.height - currentCanvasY;

        // If remaining content fits comfortably on the current page:
        if (remainingHeight <= pageHeightCanvas + 15) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = remainingHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, currentCanvasY, canvas.width, remainingHeight, 0, 0, canvas.width, remainingHeight);
            const sliceData = sliceCanvas.toDataURL('image/png');
            const sliceHeightMm = (remainingHeight / scale) * mmPerPx;
            pdf.addImage(sliceData, 'PNG', 0, 0, pdfWidth, sliceHeightMm);
          }
          break;
        }

        // Find the best split boundary before pageHeightCanvas:
        const targetCutY = currentCanvasY + pageHeightCanvas;
        let bestCutY = targetCutY;

        const candidates = nodeOffsetsPx.filter(
          (n) => n.bottom > currentCanvasY && n.bottom <= targetCutY
        );

        if (candidates.length > 0) {
          const lastCandidate = candidates[candidates.length - 1];
          bestCutY = Math.min(targetCutY, lastCandidate.bottom + 6 * scale);
        } else {
          const startCandidates = nodeOffsetsPx.filter(
            (n) => n.top > currentCanvasY + 60 * scale && n.top <= targetCutY
          );
          if (startCandidates.length > 0) {
            bestCutY = startCandidates[0].top - 4 * scale;
          }
        }

        const sliceHeight = Math.max(100, bestCutY - currentCanvasY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(canvas, 0, currentCanvasY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
          const sliceData = sliceCanvas.toDataURL('image/png');
          const sliceHeightMm = (sliceHeight / scale) * mmPerPx;
          pdf.addImage(sliceData, 'PNG', 0, 0, pdfWidth, sliceHeightMm);
        }

        currentCanvasY = bestCutY;
        pageIndex++;
      }

      pdf.save(filename);
    } catch (err) {
      console.error('Direct PDF export error, falling back to print dialog:', err);
      window.print();
    }
  },

  // 3. Server-side DOCX download via python-docx
  async downloadDocx(resumeData: ResumeSchema, templateId: TemplateId) {
    try {
      const response = await axios.post('/api/ai/export-docx', resumeData, {
        params: { template: templateId },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('DOCX download error:', err);
      alert('Could not generate DOCX. Please ensure the backend and AI services are running.');
    }
  },

  // 4. JSON backup
  downloadJson(resumeData: ResumeSchema) {
    const jsonStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_resume_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  },
};

