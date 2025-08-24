import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FolderIcon, 
  CheckSquareIcon, 
  ClockIcon, 
  SettingsIcon 
} from 'lucide-react';

const navItems = [
  { to: '/categories', icon: FolderIcon, label: 'カテゴリ' },
  { to: '/check', icon: CheckSquareIcon, label: 'チェック' },
  { to: '/history', icon: ClockIcon, label: '履歴' },
  { to: '/settings', icon: SettingsIcon, label: '設定' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center py-2 px-3 min-w-0 flex-1
                ${isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
                transition-colors duration-200
              `}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};