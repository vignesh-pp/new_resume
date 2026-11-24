import { create } from 'zustand';
import { User, UserRole } from '../types/auth';

const STORAGE_KEY = 'ai_resume_auth_user';
const USERS_STORAGE_KEY = 'ai_resume_registered_users';

export const DEMO_USER: User = {
  id: 'usr-alex-1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T00:00:00.000Z',
};

export const DEMO_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Admin Director',
  email: 'admin@resumestudio.ai',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  createdAt: '2026-01-01T00:00:00.000Z',
};

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  
  // Actions
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
}

// Initial user from local storage
function loadInitialUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read user from storage', e);
  }
  // Default to Alex Rivera user
  return DEMO_USER;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: loadInitialUser(),
  isAuthenticated: true,
  isAuthModalOpen: false,
  authModalMode: 'signin',

  login: async (email, _password, role) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check demo accounts
    if (cleanEmail === DEMO_ADMIN.email || role === 'admin' || cleanEmail.includes('admin')) {
      const user = { ...DEMO_ADMIN, email: cleanEmail || DEMO_ADMIN.email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ currentUser: user, isAuthenticated: true, isAuthModalOpen: false });
      return { success: true };
    }

    // Check registered users
    let registered: User[] = [];
    try {
      registered = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch {}

    const found = registered.find((u) => u.email.toLowerCase() === cleanEmail);
    const user: User = found || {
      id: 'usr-' + Date.now(),
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
      email: cleanEmail,
      role: role || 'user',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ currentUser: user, isAuthenticated: true, isAuthModalOpen: false });
    return { success: true };
  },

  register: async (name, email, _password, role = 'user') => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim() || 'New User',
      email: cleanEmail,
      role: role || (cleanEmail.includes('admin') ? 'admin' : 'user'),
      createdAt: new Date().toISOString(),
    };

    try {
      const registered: User[] = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      registered.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registered));
    } catch {}

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    set({ currentUser: newUser, isAuthenticated: true, isAuthModalOpen: false });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ currentUser: null, isAuthenticated: false });
  },

  switchRole: (role: UserRole) => {
    const current = get().currentUser;
    if (!current) return;
    const updated: User = { ...current, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ currentUser: updated });
  },

  openAuthModal: (mode = 'signin') => {
    set({ isAuthModalOpen: true, authModalMode: mode });
  },

  closeAuthModal: () => {
    set({ isAuthModalOpen: false });
  },
}));
