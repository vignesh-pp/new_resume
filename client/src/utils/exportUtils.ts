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
      const rootRect = element.getBoundingClientRect();
      const rawNodes = Array.from(
        element.querySelectorAll(
          '.resume-section, .resume-item, li, p, h1, h2, h3, header, .grid > div'
        )
      );

      interface NodeBox {
        tag: string;
        isHeading: boolean;
        isAtomic: boolean;
        top: number;
        bottom: number;
      }

      const nodeBoxes: NodeBox[] = rawNodes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const tag = node.tagName.toLowerCase();
          const isHeading = tag === 'h1' || tag === 'h2' || tag === 'h3';
          const isAtomic = isHeading || tag === 'li' || tag === 'p';
          return {
            tag,
            isHeading,
            isAtomic,
            top: (rect.top - rootRect.top) * scale,
            bottom: (rect.bottom - rootRect.top) * scale,
          };
        })
        .filter((n) => n.bottom > n.top + 1);

      // Page geometry in canvas pixels
      const page1BottomMarginMm = 10;
      const page1MaxHeightMm = pdfHeight - page1BottomMarginMm;
      const page1MaxHeightCanvas = (page1MaxHeightMm / mmPerPx) * scale;

      const pageNTopMarginMm = 10;
      const pageNBottomMarginMm = 10;
      const pageNUsableHeightMm = pdfHeight - pageNTopMarginMm - pageNBottomMarginMm;
      const pageNMaxHeightCanvas = (pageNUsableHeightMm / mmPerPx) * scale;

      let currentCanvasY = 0;
      let pageIndex = 0;

      while (currentCanvasY < canvas.height - 10) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        const remainingHeight = canvas.height - currentCanvasY;
        const maxPageCanvasH = pageIndex === 0 ? page1MaxHeightCanvas : pageNMaxHeightCanvas;
        const topOffsetMm = pageIndex === 0 ? 0 : pageNTopMarginMm;

        // If remaining content fits comfortably on the current page:
        if (remainingHeight <= maxPageCanvasH + 15) {
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = remainingHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, remainingHeight);
            ctx.drawImage(
              canvas,
              0, currentCanvasY, canvas.width, remainingHeight,
              0, 0, canvas.width, remainingHeight
            );
            const sliceData = sliceCanvas.toDataURL('image/png');
            const sliceHeightMm = (remainingHeight / scale) * mmPerPx;
            pdf.addImage(sliceData, 'PNG', 0, topOffsetMm, pdfWidth, sliceHeightMm);
          }
          break;
        }

        // Find the best split boundary before targetCutY
        const targetCutY = currentCanvasY + maxPageCanvasH;
        const minCutY = currentCanvasY + 100 * scale;

        // Collect potential safe cut positions
        const cutCandidates: number[] = [];
        nodeBoxes.forEach((n) => {
          if (n.bottom >= minCutY && n.bottom <= targetCutY) {
            cutCandidates.push(n.bottom + 3 * scale);
          }
          if (n.top >= minCutY && n.top <= targetCutY) {
            cutCandidates.push(n.top - 3 * scale);
          }
        });

        // Filter candidates that do not cut through atomic elements or cause orphan headings
        const validCandidates = cutCandidates.filter((candY) => {
          if (candY < minCutY || candY > targetCutY) return false;

          // 1. Must NOT cut through any atomic element (li, p, h1, h2, h3)
          const cutsAtomic = nodeBoxes.some(
            (nb) => nb.isAtomic && candY > nb.top + 1 && candY < nb.bottom - 1
          );
          if (cutsAtomic) return false;

          // 2. Orphan heading prevention: check if cut is right after a heading with no following content
          const prevHeadings = nodeBoxes.filter(
            (nb) => nb.isHeading && nb.bottom <= candY && candY - nb.bottom < 35 * scale
          );
          if (prevHeadings.length > 0) {
            return false;
          }

          return true;
        });

        let bestCutY: number;
        if (validCandidates.length > 0) {
          // Choose candidate closest to targetCutY to maximize page utilization
          bestCutY = Math.max(...validCandidates);
        } else {
          // Fallback: look for a heading or item starting near targetCutY and cut before it
          const upcomingItems = nodeBoxes.filter(
            (n) => n.top > minCutY && n.top <= targetCutY
          );
          if (upcomingItems.length > 0) {
            const lastItem = upcomingItems[upcomingItems.length - 1];
            bestCutY = Math.max(minCutY, lastItem.top - 4 * scale);
          } else {
            bestCutY = targetCutY;
          }
        }

        const sliceHeight = Math.max(80, Math.round(bestCutY - currentCanvasY));
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, sliceHeight);
          ctx.drawImage(
            canvas,
            0, currentCanvasY, canvas.width, sliceHeight,
            0, 0, canvas.width, sliceHeight
          );
          const sliceData = sliceCanvas.toDataURL('image/png');
          const sliceHeightMm = (sliceHeight / scale) * mmPerPx;
          pdf.addImage(sliceData, 'PNG', 0, topOffsetMm, pdfWidth, sliceHeightMm);
        }

        currentCanvasY = currentCanvasY + sliceHeight;
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

