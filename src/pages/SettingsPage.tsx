import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  DownloadIcon, 
  UploadIcon, 
  TrashIcon, 
  TestTubeIcon,
  InfoIcon,
  MoonIcon,
  SunIcon
} from 'lucide-react';
import { Header } from '../components/Header';
import { useStore } from '../store/useStore';
import { NotificationService } from '../utils/notifications';
import { StorageService } from '../utils/storage';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default'>('default');
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  useEffect(() => {
    if (settings.notificationsEnabled) {
      NotificationService.scheduleDailyReminder(settings.notificationTime);
    } else {
      NotificationService.cancelDailyReminder();
    }
  }, [settings.notificationsEnabled, settings.notificationTime]);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      const granted = await NotificationService.requestPermission();
      if (!granted) {
        setShowPermissionAlert(true);
        return;
      }
      checkNotificationPermission();
    }
    
    updateSettings({ notificationsEnabled: enabled });
  };

  const handleTimeChange = (time: string) => {
    updateSettings({ notificationTime: time });
  };

  const handleTestNotification = async () => {
    await NotificationService.testNotification();
  };

  const handleExportData = () => {
    const data = StorageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checkapp-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = StorageService.importData(content);
        if (success) {
          alert('データのインポートが完了しました。ページを再読み込みしてください。');
          window.location.reload();
        } else {
          alert('データのインポートに失敗しました。');
        }
      } catch (error) {
        alert('無効なファイル形式です。');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearAllData = () => {
    if (confirm('すべてのデータを削除しますか？この操作は元に戻せません。')) {
      if (confirm('本当にすべてのデータを削除しますか？')) {
        StorageService.clearAllData();
        alert('すべてのデータを削除しました。ページを再読み込みします。');
        window.location.reload();
      }
    }
  };

  const openAppSettings = () => {
    alert('ブラウザの設定から通知を許可してください。');
  };

  return (
    <div className="h-full">
      <Header title="設定" />
      
      <div className="p-4 space-y-6">
        {/* Notification Settings */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BellIcon size={20} className="mr-2" />
            通知設定
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  通知を有効にする
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  設定した時間に毎日通知を受け取る
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleNotificationToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {settings.notificationsEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  通知時間
                </label>
                <input
                  type="time"
                  value={settings.notificationTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="input max-w-xs"
                />
              </div>
            )}

            {settings.notificationsEnabled && (
              <button
                onClick={handleTestNotification}
                className="btn-secondary flex items-center space-x-2"
              >
                <TestTubeIcon size={16} />
                <span>テスト通知</span>
              </button>
            )}
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MoonIcon size={20} className="mr-2" />
            テーマ設定
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ダークモード
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  システムの設定に自動で切り替わります
                </p>
              </div>
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <SunIcon size={16} />
                <span className="text-sm">自動</span>
                <MoonIcon size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DownloadIcon size={20} className="mr-2" />
            データ管理
          </h3>
          
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <DownloadIcon size={16} />
              <span>データをエクスポート</span>
            </button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="btn-secondary w-full flex items-center justify-center space-x-2 cursor-pointer"
              >
                <UploadIcon size={16} />
                <span>データをインポート</span>
              </label>
            </div>

            <button
              onClick={handleClearAllData}
              className="btn-danger w-full flex items-center justify-center space-x-2"
            >
              <TrashIcon size={16} />
              <span>すべてのデータを削除</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="card p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <InfoIcon size={20} className="mr-2" />
            アプリ情報
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>バージョン</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>最終更新</span>
              <span>2025-08-24</span>
            </div>
            <div className="flex justify-between">
              <span>開発者</span>
              <span>Claude Code</span>
            </div>
          </div>
        </div>

        {/* Footer space for bottom navigation */}
        <div className="h-4" />
      </div>

      {/* Permission Alert */}
      {showPermissionAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="text-center">
              <BellIcon size={48} className="text-orange-600 dark:text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                通知許可が必要です
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                通知機能を使用するには、ブラウザで通知を許可してください。
              </p>
              <div className="space-y-2">
                <button
                  onClick={openAppSettings}
                  className="btn-primary w-full"
                >
                  設定を確認
                </button>
                <button
                  onClick={() => setShowPermissionAlert(false)}
                  className="btn-secondary w-full"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};