import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CheckPage } from './pages/CheckPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { useStore } from './store/useStore';

export const App: React.FC = () => {
  const initializeApp = useStore((state) => state.initializeApp);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/categories" replace />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="category/:categoryId" element={<CategoryDetailPage />} />
        <Route path="check" element={<CheckPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};