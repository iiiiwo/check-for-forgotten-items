import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Category, CategoryColor } from '../types';
import { getAvailableIcons, getColorClasses } from '../utils/ui-helpers';

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
}

const availableColors: CategoryColor[] = ['blue', 'green', 'orange', 'red', 'purple', 'pink', 'yellow', 'gray'];
const availableIcons = getAvailableIcons();

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  category,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [selectedColor, setSelectedColor] = useState<CategoryColor>('blue');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
    } else {
      setName('');
      setSelectedIcon('folder');
      setSelectedColor('blue');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category ? 'カテゴリを編集' : '新しいカテゴリ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              カテゴリ名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="カテゴリ名を入力"
              required
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              アイコン
            </label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map(({ name: iconName, component: IconComponent }) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`
                    p-3 rounded-lg border-2 transition-colors
                    ${selectedIcon === iconName
                      ? `${getColorClasses(selectedColor).border} ${getColorClasses(selectedColor).bg}`
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                  `}
                >
                  <IconComponent 
                    size={20} 
                    className={selectedIcon === iconName ? getColorClasses(selectedColor).text : 'text-gray-600 dark:text-gray-400'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              カラー
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    p-4 rounded-lg border-2 transition-colors
                    ${getColorClasses(color).bg}
                    ${selectedColor === color
                      ? `${getColorClasses(color).border} ring-2 ring-offset-2 ring-current`
                      : 'border-gray-200 dark:border-gray-600'
                    }
                  `}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto ${getColorClasses(color).text.replace('text-', 'bg-')}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              プレビュー
            </label>
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getColorClasses(selectedColor).bg}`}>
                  {React.createElement(
                    availableIcons.find(icon => icon.name === selectedIcon)?.component || availableIcons[0].component,
                    { 
                      size: 20, 
                      className: getColorClasses(selectedColor).text 
                    }
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {name || 'カテゴリ名'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    0個のアイテム
                  </p>
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
              {category ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};