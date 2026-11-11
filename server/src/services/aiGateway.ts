import axios from 'axios';
import FormData from 'form-data';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export const aiGateway = {
  async checkHealth(): Promise<boolean> {
    try {
      const resp = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
      return resp.data?.status === 'healthy';
    } catch {
      return false;
    }
  },

  async parseResumeFile(fileBuffer: Buffer, filename: string, mimetype: string): Promise<any> {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename,
      contentType: mimetype,
    });

    const resp = await axios.post(`${AI_SERVICE_URL}/api/parse`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });
    return resp.data;
  },

  async analyzeAts(resumeData: any): Promise<any> {
    const resp = await axios.post(`${AI_SERVICE_URL}/api/analyze-ats`, resumeData, {
      timeout: 15000,
    });
    return resp.data;
  },

  async improveBullet(bullet: string, role?: string): Promise<any> {
    const resp = await axios.post(
      `${AI_SERVICE_URL}/api/improve-bullet`,
      { bullet, role },
      { timeout: 15000 }
    );
    return resp.data;
  },

  async tailorResume(resume: any, jobDescription: string): Promise<any> {
    const resp = await axios.post(
      `${AI_SERVICE_URL}/api/tailor`,
      { resume, jobDescription },
      { timeout: 15000 }
    );
    return resp.data;
  },

  async generateDocx(resume: any, template: string): Promise<any> {
    const resp = await axios.post(
      `${AI_SERVICE_URL}/api/generate-docx`,
      resume,
      {
        params: { template },
        responseType: 'arraybuffer',
        timeout: 20000,
      }
    );
    return resp;
  },
};

