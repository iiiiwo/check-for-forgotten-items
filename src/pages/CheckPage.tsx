import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CategorySelector } from '../components/CategorySelector';
import { CheckList } from '../components/CheckList';
import { useStore } from '../store/useStore';

export const CheckPage: React.FC = () => {
  const { 
    categories, 
    selectedCategoryId, 
    setSelectedCategoryId,
    checkState,
    resetCheckState 
  } = useStore();
  
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  useEffect(() => {
    if (!selectedCategoryId || !selectedCategory) {
      setShowCategorySelector(true);
      resetCheckState();
    } else {
      setShowCategorySelector(false);
    }
  }, [selectedCategoryId, selectedCategory, resetCheckState]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    resetCheckState();
  };

  const handleChangeCategory = () => {
    setShowCategorySelector(true);
    resetCheckState();
  };

  if (categories.length === 0) {
    return (
      <div className="h-full">
        <Header title="チェックリスト" />
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              カテゴリがありません
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              まずはカテゴリタブからカテゴリを作成してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showCategorySelector || !selectedCategory) {
    return (
      <div className="h-full">
        <Header title="チェックリスト" />
        <CategorySelector
          categories={categories}
          onSelect={handleCategorySelect}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header 
        title="チェックリスト" 
        showAddButton={false}
      />
      <CheckList
        category={selectedCategory}
        onChangeCategory={handleChangeCategory}
      />
    </div>
  );
};