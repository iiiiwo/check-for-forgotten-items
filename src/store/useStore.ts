import { create } from 'zustand';
import type { Category, CheckItem, CheckSession, AppSettings, CheckState } from '@/types';
import { StorageService } from '@/utils/storage';

interface AppStore {
  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Check Items
  addItem: (categoryId: string, item: CheckItem) => void;
  updateItem: (categoryId: string, itemId: string, updates: Partial<CheckItem>) => void;
  deleteItem: (categoryId: string, itemId: string) => void;

  // Check Sessions
  sessions: CheckSession[];
  setSessions: (sessions: CheckSession[]) => void;
  addSession: (session: CheckSession) => void;

  // Check State
  checkState: CheckState;
  setCheckState: (state: CheckState) => void;
  toggleItem: (itemId: string) => void;
  resetCheckState: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // App State
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Actions
  initializeApp: () => void;
  saveData: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  categories: [],
  sessions: [],
  checkState: {},
  settings: {
    notificationsEnabled: false,
    notificationTime: '08:00',
    darkMode: false,
  },
  selectedCategoryId: null,

  // Categories
  setCategories: (categories) => {
    set({ categories });
    get().saveData();
  },

  addCategory: (category) => {
    const newCategories = [...get().categories, category];
    set({ categories: newCategories });
    get().saveData();
  },

  updateCategory: (id, updates) => {
    const categories = get().categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    );
    set({ categories });
    get().saveData();
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter(cat => cat.id !== id);
    set({ categories });
    
    // Clear selected category if it was deleted
    if (get().selectedCategoryId === id) {
      set({ selectedCategoryId: null });
    }
    
    get().saveData();
  },

  // Check Items
  addItem: (categoryId, item) => {
    const categories = get().categories.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: [...cat.items, item] };
      }
      return cat;
    });
    set({ categories });
    get().saveData();
  },

  updateItem: (categoryId, itemId, updates) => {
    const categories = get().categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };
      }
      return cat;
    });
    set({ categories });
    get().saveData();
  },

  deleteItem: (categoryId, itemId) => {
    const categories = get().categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId),
        };
      }
      return cat;
    });
    set({ categories });
    get().saveData();
  },

  // Check Sessions
  setSessions: (sessions) => {
    set({ sessions });
    get().saveData();
  },

  addSession: (session) => {
    const newSessions = [...get().sessions, session];
    set({ sessions: newSessions });
    StorageService.addSession(session);
  },

  // Check State
  setCheckState: (checkState) => set({ checkState }),

  toggleItem: (itemId) => {
    const currentState = get().checkState;
    const newState = {
      ...currentState,
      [itemId]: !currentState[itemId],
    };
    set({ checkState: newState });
  },

  resetCheckState: () => set({ checkState: {} }),

  // Settings
  updateSettings: (updates) => {
    const newSettings = { ...get().settings, ...updates };
    set({ settings: newSettings });
    StorageService.saveSettings(newSettings);
  },

  // App State
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

  // Actions
  initializeApp: () => {
    const categories = StorageService.getCategories();
    const sessions = StorageService.getSessions();
    const settings = StorageService.getSettings();

    // Initialize with default categories if none exist
    if (categories.length === 0) {
      const defaultCategories: Category[] = [
        {
          id: 'work',
          name: '仕事',
          icon: 'briefcase',
          color: 'blue',
          createdAt: new Date(),
          items: [],
        },
        {
          id: 'travel',
          name: '旅行',
          icon: 'suitcase',
          color: 'orange',
          createdAt: new Date(),
          items: [],
        },
        {
          id: 'event',
          name: 'イベント',
          icon: 'party-popper',
          color: 'purple',
          createdAt: new Date(),
          items: [],
        },
        {
          id: 'school',
          name: '学校',
          icon: 'book-open',
          color: 'green',
          createdAt: new Date(),
          items: [],
        },
      ];
      
      StorageService.saveCategories(defaultCategories);
      set({ categories: defaultCategories });
    } else {
      set({ categories });
    }

    set({ sessions, settings });
  },

  saveData: () => {
    const { categories } = get();
    StorageService.saveCategories(categories);
  },
}));