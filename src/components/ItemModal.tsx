import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CheckItem, Priority } from '../types';
import { getPriorityColor, getPriorityLabel } from '../utils/ui-helpers';

interface ItemModalProps {
  isOpen: boolean;
  item: CheckItem | null;
  onClose: () => void;
  onSave: (item: Partial<CheckItem>) => void;
}

const availablePriorities: Priority[] = ['critical', 'high', 'medium', 'low'];

export const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSelectedPriority(item.priority);
    } else {
      setName('');
      setSelectedPriority('medium');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        priority: selectedPriority,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {item ? 'アイテムを編集' : '新しいアイテム'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              アイテム名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="アイテム名を入力"
              required
              autoFocus
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              優先度
            </label>
            <div className="space-y-2">
              {availablePriorities.map((priority) => {
                const priorityClasses = getPriorityColor(priority);
                const isSelected = selectedPriority === priority;

                return (
                  <label
                    key={priority}
                    className={`
                      flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={isSelected}
                      onChange={() => setSelectedPriority(priority)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-3 h-3 rounded-full ${priorityClasses.replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[0]}`} />
                      
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {getPriorityLabel(priority)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {priority === 'critical' && '絶対に必要なアイテム'}
                          {priority === 'high' && '重要なアイテム'}
                          {priority === 'medium' && '普通のアイテム'}
                          {priority === 'low' && 'あると良いアイテム'}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              プレビュー
            </label>
            <div className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    {name || 'アイテム名を入力'}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`priority-badge ${getPriorityColor(selectedPriority)}`}>
                      {getPriorityLabel(selectedPriority)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={!name.trim()}
            >
              {item ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};