import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useDarkMode = () => {
  const { settings } = useStore();

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      
      if (settings.darkMode === 'system') {
        const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkSystem) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } else if (settings.darkMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.darkMode === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.darkMode]);
};