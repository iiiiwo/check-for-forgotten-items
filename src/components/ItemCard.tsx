import React, { useState } from 'react';
import { MoreVerticalIcon, EditIcon, TrashIcon } from 'lucide-react';
import type { CheckItem } from '../types';
import { getPriorityColor, getPriorityLabel } from '../utils/ui-helpers';

interface ItemCardProps {
  item: CheckItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const priorityClasses = getPriorityColor(item.priority);

  return (
    <div className="card p-4 relative">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            {item.name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className={`priority-badge ${priorityClasses}`}>
              {getPriorityLabel(item.priority)}
            </span>
          </div>
        </div>

        <div className="relative ml-2">
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
    </div>
  );
};