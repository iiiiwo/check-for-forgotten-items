import type { NotificationPermission } from '@/types';

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default',
    };
  }

  static async scheduleNotification(title: string, body: string, delay: number = 0): Promise<void> {
    const permission = this.getPermissionStatus();
    
    if (!permission.granted) {
      console.warn('Notification permission not granted');
      return;
    }

    const showNotification = () => {
      new Notification(title, {
        body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'checkapp-notification',
        requireInteraction: false,
        silent: false,
      });
    };

    if (delay > 0) {
      setTimeout(showNotification, delay);
    } else {
      showNotification();
    }
  }

  static async scheduleIncompleteItemsNotification(items: string[], categoryName: string): Promise<void> {
    const title = '忘れ物注意！';
    const body = `${categoryName}で未チェック項目があります: ${items.join(', ')}`;
    
    // Schedule for 5 minutes later
    await this.scheduleNotification(title, body, 5 * 60 * 1000);
  }

  static scheduleDailyReminder(time: string): void {
    const permission = this.getPermissionStatus();
    
    if (!permission.granted) {
      console.warn('Notification permission not granted');
      return;
    }

    // Clear any existing daily reminder
    this.cancelDailyReminder();

    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduleNext = () => {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        this.scheduleNotification(
          '持ち物チェック',
          '今日の持ち物をチェックしましょう！'
        );
        
        // Schedule next day
        scheduleNext();
      }, timeUntilNotification);

      // Store timeout ID for cancellation
      localStorage.setItem('dailyReminderTimeoutId', timeoutId.toString());
    };

    scheduleNext();
  }

  static cancelDailyReminder(): void {
    const timeoutId = localStorage.getItem('dailyReminderTimeoutId');
    if (timeoutId) {
      clearTimeout(Number(timeoutId));
      localStorage.removeItem('dailyReminderTimeoutId');
    }
  }

  static async testNotification(): Promise<void> {
    await this.scheduleNotification(
      'テスト通知',
      'これはテスト通知です。通知が正常に動作しています。'
    );
  }
}