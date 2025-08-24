import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg min-h-screen">
        <main className="pb-16">
          <Outlet />
        </main>
        <Navigation />
      </div>
    </div>
  );
};