import type { Category, CheckSession, AppSettings } from '@/types';

const STORAGE_KEYS = {
  CATEGORIES: 'checkapp_categories',
  SESSIONS: 'checkapp_sessions',
  SETTINGS: 'checkapp_settings',
} as const;

export class StorageService {
  // Categories
  static getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  }

  static saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  }

  // Check Sessions
  static getSessions(): CheckSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      const sessions = data ? JSON.parse(data) : [];
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date),
      }));
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  static saveSessions(sessions: CheckSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions:', error);
    }
  }

  static addSession(session: CheckSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    
    // Clean old sessions (older than 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const filteredSessions = sessions.filter(s => s.date >= oneYearAgo);
    this.saveSessions(filteredSessions);
  }

  // Settings
  static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        notificationsEnabled: false,
        notificationTime: '08:00',
        darkMode: false,
      };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {
        notificationsEnabled: false,
        notificationTime: '08:00',
        darkMode: false,
      };
    }
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Data Export/Import
  static exportData(): string {
    return JSON.stringify({
      categories: this.getCategories(),
      sessions: this.getSessions(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.categories) {
        this.saveCategories(data.categories);
      }
      
      if (data.sessions) {
        // Convert date strings back to Date objects
        const sessions = data.sessions.map((session: any) => ({
          ...session,
          date: new Date(session.date),
        }));
        this.saveSessions(sessions);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}