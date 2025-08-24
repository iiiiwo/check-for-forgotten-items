import React, { useMemo } from 'react';
import { ClockIcon, CheckCircleIcon, AlertCircleIcon, TrashIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { useStore } from '../store/useStore';
import { formatDate, formatTime } from '../utils/ui-helpers';
import type { CheckSession } from '../types';

export const HistoryPage: React.FC = () => {
  const { sessions, setSessions } = useStore();

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: Record<string, CheckSession[]> = {};
    
    sessions.forEach(session => {
      const dateKey = formatDate(session.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    // Sort each group by time (newest first)
    Object.keys(groups).forEach(dateKey => {
      groups[dateKey].sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    return groups;
  }, [sessions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSessions).sort((a, b) => {
      // Sort dates in reverse chronological order
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [groupedSessions]);

  const handleClearHistory = () => {
    if (confirm('すべての履歴を削除しますか？この操作は元に戻せません。')) {
      setSessions([]);
    }
  };

  const handleClearOldHistory = () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const filteredSessions = sessions.filter(session => session.date >= oneYearAgo);
    setSessions(filteredSessions);
  };

  if (sessions.length === 0) {
    return (
      <div className="h-full">
        <Header title="履歴" />
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <ClockIcon size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              履歴がありません
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              チェックを実行すると履歴が表示されます
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header 
        title="履歴"
        showAddButton={false}
      />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Stats Summary */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {sessions.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                総チェック数
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                {sessions.filter(s => s.isAllCompleted).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                完全達成
              </div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(sessions.reduce((sum, s) => sum + s.completionRate, 0) / sessions.length * 100) || 0}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                平均達成率
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="p-4 space-y-6">
          {sortedDates.map(dateKey => (
            <div key={dateKey} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                {dateKey}
              </h3>
              
              <div className="space-y-3">
                {groupedSessions[dateKey].map(session => (
                  <HistorySessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Clear History Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={handleClearOldHistory}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <TrashIcon size={16} />
            <span>古い履歴をクリア（1年以前）</span>
          </button>
          
          <button
            onClick={handleClearHistory}
            className="btn-danger w-full flex items-center justify-center space-x-2"
          >
            <TrashIcon size={16} />
            <span>すべての履歴を削除</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface HistorySessionCardProps {
  session: CheckSession;
}

const HistorySessionCard: React.FC<HistorySessionCardProps> = ({ session }) => {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${session.isAllCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
            {session.isAllCompleted ? (
              <CheckCircleIcon size={16} className="text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircleIcon size={16} className="text-orange-600 dark:text-orange-400" />
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {session.categoryName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(session.date)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {session.completedItems}/{session.totalItems}
          </div>
          <div className={`text-sm font-medium ${
            session.isAllCompleted 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-orange-600 dark:text-orange-400'
          }`}>
            {Math.round(session.completionRate * 100)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            session.isAllCompleted 
              ? 'bg-green-600 dark:bg-green-400' 
              : 'bg-orange-600 dark:bg-orange-400'
          }`}
          style={{ width: `${session.completionRate * 100}%` }}
        />
      </div>

      {/* Incomplete Items */}
      {session.incompleteItems.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            未完了項目:
          </p>
          <div className="space-y-1">
            {session.incompleteItems.map((item, index) => (
              <div key={index} className="text-xs text-red-600 dark:text-red-400">
                • {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};