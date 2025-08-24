import React, { useState, useMemo } from 'react';
import { RotateCcwIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import type { Category, CheckSession } from '../types';
import { useStore } from '../store/useStore';
import { getIconComponent, getColorClasses, getPriorityColor, getPriorityLabel } from '../utils/ui-helpers';
import { NotificationService } from '../utils/notifications';

interface CheckListProps {
  category: Category;
  onChangeCategory: () => void;
}

export const CheckList: React.FC<CheckListProps> = ({
  category,
  onChangeCategory,
}) => {
  const { checkState, toggleItem, resetCheckState, addSession, updateCategory } = useStore();
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [incompleteItems, setIncompleteItems] = useState<string[]>([]);

  const IconComponent = getIconComponent(category.icon);
  const colorClasses = getColorClasses(category.color);

  // Sort items by priority
  const sortedItems = useMemo(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...category.items].sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return a.name.localeCompare(b.name);
    });
  }, [category.items]);

  const checkedCount = category.items.filter(item => checkState[item.id]).length;
  const completionRate = category.items.length > 0 ? checkedCount / category.items.length : 0;

  const handleFinishCheck = async () => {
    const uncheckedItems = category.items.filter(item => !checkState[item.id]);
    
    if (uncheckedItems.length === 0) {
      // All items checked
      setShowCompletionAlert(true);
      saveSession([]);
    } else {
      // Some items unchecked
      const uncheckedNames = uncheckedItems.map(item => item.name);
      setIncompleteItems(uncheckedNames);
      setShowIncompleteAlert(true);
      
      // Schedule notification for incomplete items
      await NotificationService.scheduleIncompleteItemsNotification(
        uncheckedNames,
        category.name
      );
    }
  };

  const saveSession = (incomplete: string[]) => {
    const session: CheckSession = {
      id: Date.now().toString(),
      categoryId: category.id,
      categoryName: category.name,
      date: new Date(),
      totalItems: category.items.length,
      completedItems: checkedCount,
      incompleteItems: incomplete,
      isAllCompleted: incomplete.length === 0,
      completionRate,
    };
    
    addSession(session);
    
    // Remove checked items from the category after session is saved
    const checkedItemIds = Object.keys(checkState).filter(itemId => checkState[itemId]);
    const remainingItems = category.items.filter(item => !checkedItemIds.includes(item.id));
    
    updateCategory(category.id, { items: remainingItems });
    resetCheckState();
  };

  const handleConfirmIncomplete = () => {
    saveSession(incompleteItems);
    setShowIncompleteAlert(false);
  };

  if (sortedItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-full ${colorClasses.bg} mb-4`}>
            <IconComponent size={32} className={colorClasses.text} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {category.name}にアイテムがありません
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            カテゴリタブからアイテムを追加してください
          </p>
          <button
            onClick={onChangeCategory}
            className="btn-secondary"
          >
            カテゴリを変更
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress Header */}
      <div className={`p-4 ${colorClasses.bg.replace('bg-', 'bg-').replace('-100', '-50')} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
              <IconComponent size={20} className={colorClasses.text} />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h2>
              <button
                onClick={onChangeCategory}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                カテゴリを変更
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-lg font-semibold ${colorClasses.text}`}>
              {checkedCount}/{category.items.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(completionRate * 100)}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colorClasses.text.replace('text-', 'bg-')}`}
            style={{ width: `${completionRate * 100}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {sortedItems.map((item) => {
            const isChecked = checkState[item.id] || false;
            const priorityClasses = getPriorityColor(item.priority);

            return (
              <div
                key={item.id}
                className={`
                  card p-4 cursor-pointer transition-all duration-200
                  ${isChecked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'hover:shadow-md'}
                `}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {isChecked ? (
                      <CheckCircleIcon size={24} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                      {item.name}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`priority-badge ${priorityClasses}`}>
                        {getPriorityLabel(item.priority)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white dark:bg-gray-800">
        <button
          onClick={handleFinishCheck}
          className={`btn w-full ${colorClasses.text.replace('text-', 'bg-')} text-white hover:opacity-90`}
        >
          チェック完了
        </button>
        
        <button
          onClick={resetCheckState}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <RotateCcwIcon size={16} />
          <span>リセット</span>
        </button>
      </div>

      {/* Completion Alert */}
      {showCompletionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <CheckCircleIcon size={48} className="text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                チェック完了！
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                すべてのアイテムをチェックしました。お疲れさまでした！
              </p>
              <button
                onClick={() => setShowCompletionAlert(false)}
                className="btn-primary w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incomplete Alert */}
      {showIncompleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <AlertCircleIcon size={48} className="text-orange-600 dark:text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                未完了項目があります
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                以下の項目がまだチェックされていません：
              </p>
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                {incompleteItems.map((item, index) => (
                  <div key={index}>• {item}</div>
                ))}
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleConfirmIncomplete}
                  className="btn-primary w-full"
                >
                  このまま完了
                </button>
                <button
                  onClick={() => setShowIncompleteAlert(false)}
                  className="btn-secondary w-full"
                >
                  戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};