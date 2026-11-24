import { Resume, IResume } from '../models/Resume.js';
import { isConnectedToMongo } from '../config/db.js';
import crypto from 'crypto';

interface InMemoryResume {
  _id: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  title: string;
  templateId: string;
  theme: any;
  content: any;
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const memoryStore = new Map<string, InMemoryResume>();

export const storeService = {
  async getAll(): Promise<any[]> {
    if (isConnectedToMongo) {
      try {
        return await Resume.find().sort({ updatedAt: -1 });
      } catch (e) {
        console.error('Mongo error, falling back to memory store:', e);
      }
    }
    return Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  async getById(id: string): Promise<any | null> {
    if (isConnectedToMongo) {
      try {
        const doc = await Resume.findById(id);
        if (doc) return doc;
      } catch (e) {
        console.error('Mongo error in getById:', e);
      }
    }
    return memoryStore.get(id) || null;
  },

  async create(data: any): Promise<any> {
    if (isConnectedToMongo) {
      try {
        const doc = new Resume(data);
        return await doc.save();
      } catch (e) {
        console.error('Mongo error in create:', e);
      }
    }
    const id = crypto.randomUUID();
    const item: InMemoryResume = {
      _id: id,
      userId: data.userId || 'usr-alex-1',
      userEmail: data.userEmail || '',
      userName: data.userName || '',
      title: data.title || 'Untitled Resume',
      templateId: data.templateId || 'classic-ats',
      theme: data.theme || { primary: '#0f172a' },
      content: data.content || {},
      atsScore: data.atsScore || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.set(id, item);
    return item;
  },

  async update(id: string, data: any): Promise<any | null> {
    if (isConnectedToMongo) {
      try {
        const updated = await Resume.findByIdAndUpdate(
          id,
          { ...data, updatedAt: new Date() },
          { new: true }
        );
        if (updated) return updated;
      } catch (e) {
        console.error('Mongo error in update:', e);
      }
    }
    const existing = memoryStore.get(id);
    if (!existing) return null;
    const updated: InMemoryResume = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    memoryStore.set(id, updated);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    if (isConnectedToMongo) {
      try {
        await Resume.findByIdAndDelete(id);
        return true;
      } catch (e) {
        console.error('Mongo error in delete:', e);
      }
    }
    return memoryStore.delete(id);
  },
};

