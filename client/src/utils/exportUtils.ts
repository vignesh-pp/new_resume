import axios from 'axios';
import { ResumeSchema, TemplateId } from '../types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportUtils = {
  // 1. High fidelity browser print to PDF
  printResume() {
    window.print();
  },

  // 2. Direct client-side PDF download using html2canvas & jsPDF
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

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      element.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
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

