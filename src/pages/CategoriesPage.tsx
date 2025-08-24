import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CategoryCard } from '../components/CategoryCard';
import { CategoryModal } from '../components/CategoryModal';
import { useStore } from '../store/useStore';
import type { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name!,
        icon: categoryData.icon!,
        color: categoryData.color!,
        createdAt: new Date(),
        items: [],
      };
      addCategory(newCategory);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('このカテゴリを削除しますか？')) {
      deleteCategory(categoryId);
    }
  };

  return (
    <div className="h-full">
      <Header
        title="カテゴリ"
        showAddButton
        onAdd={handleAddCategory}
      />
      
      <div className="p-4 space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              カテゴリがありません
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              「+」ボタンで新しいカテゴリを追加しましょう
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category.id)}
            />
          ))
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        category={editingCategory}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};