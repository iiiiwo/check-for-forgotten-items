import React from 'react';
import type { Category } from '../types';
import { getIconComponent, getColorClasses } from '../utils/ui-helpers';

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onSelect,
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          チェックするカテゴリを選択
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          持ち物をチェックしたいカテゴリをタップしてください
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          const colorClasses = getColorClasses(category.color);

          return (
            <button
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="card p-6 hover:shadow-md transition-shadow duration-200 active:scale-95"
            >
              <div className="text-center space-y-3">
                <div className={`inline-flex p-3 rounded-full ${colorClasses.bg}`}>
                  <IconComponent size={24} className={colorClasses.text} />
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {category.items.length}個のアイテム
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};