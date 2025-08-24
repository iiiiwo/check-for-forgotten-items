import React from 'react';
import { ArrowLeftIcon, PlusIcon } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showAddButton?: boolean;
  onBack?: () => void;
  onAdd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showAddButton = false,
  onBack,
  onAdd,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeftIcon size={20} />
            </button>
          )}
          
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        </div>
        
        {showAddButton && onAdd && (
          <button
            onClick={onAdd}
            className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            <PlusIcon size={20} />
          </button>
        )}
      </div>
    </header>
  );
};