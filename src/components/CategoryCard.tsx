import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVerticalIcon, EditIcon, TrashIcon } from 'lucide-react';
import type { Category } from '../types';
import { getIconComponent, getColorClasses } from '../utils/ui-helpers';

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const IconComponent = getIconComponent(category.icon);
  const colorClasses = getColorClasses(category.color);

  return (
    <div className="card p-4 relative">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
          <IconComponent size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {category.items.length}個のアイテム
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <MoreVerticalIcon size={16} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 min-w-[120px]">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <EditIcon size={14} className="mr-2" />
                  編集
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <TrashIcon size={14} className="mr-2" />
                  削除
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click area for navigation */}
      <Link
        to={`/category/${category.id}`}
        className="absolute inset-0 z-0"
        onClick={(e) => {
          if (showMenu) {
            e.preventDefault();
            setShowMenu(false);
          }
        }}
      />
    </div>
  );
};