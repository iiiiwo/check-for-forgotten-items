import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import { useStore } from '../store/useStore';
import type { CheckItem } from '../types';
import { getIconComponent, getColorClasses, getPriorityLabel } from '../utils/ui-helpers';

export const CategoryDetailPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { categories, addItem, updateItem, deleteItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CheckItem | null>(null);

  const category = categories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="h-full">
        <Header
          title="カテゴリが見つかりません"
          showBackButton
          onBack={() => navigate(-1)}
        />
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              指定されたカテゴリが見つかりません
            </p>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(category.icon);
  const colorClasses = getColorClasses(category.color);

  // Sort items by priority
  const sortedItems = [...category.items].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.name.localeCompare(b.name);
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: CheckItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<CheckItem>) => {
    if (editingItem) {
      updateItem(category.id, editingItem.id, itemData);
    } else {
      const newItem: CheckItem = {
        id: Date.now().toString(),
        name: itemData.name!,
        priority: itemData.priority!,
        categoryId: category.id,
        createdAt: new Date(),
      };
      addItem(category.id, newItem);
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('このアイテムを削除しますか？')) {
      deleteItem(category.id, itemId);
    }
  };

  return (
    <div className="h-full">
      <Header
        title={category.name}
        showBackButton
        showAddButton
        onBack={() => navigate(-1)}
        onAdd={handleAddItem}
      />

      {/* Category Info */}
      <div className={`p-4 ${colorClasses.bg.replace('bg-', 'bg-').replace('-100', '-50')} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
            <IconComponent size={24} className={colorClasses.text} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.items.length}個のアイテム
            </p>
          </div>
        </div>

        {/* Priority Stats */}
        {category.items.length > 0 && (
          <div className="mt-4 flex space-x-4 text-xs">
            {['critical', 'high', 'medium', 'low'].map(priority => {
              const count = category.items.filter(item => item.priority === priority).length;
              if (count === 0) return null;
              
              return (
                <div key={priority} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full bg-priority-${priority}`} />
                  <span className="text-gray-600 dark:text-gray-400">
                    {getPriorityLabel(priority)}: {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              アイテムがありません
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              「+」ボタンで新しいアイテムを追加しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Bottom spacing for navigation */}
        <div className="h-20" />
      </div>

      <ItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
};