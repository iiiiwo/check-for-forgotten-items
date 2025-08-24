export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type CategoryColor = 
  | 'blue' 
  | 'green' 
  | 'orange' 
  | 'red' 
  | 'purple' 
  | 'pink' 
  | 'yellow' 
  | 'gray';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: CategoryColor;
  createdAt: Date;
  items: CheckItem[];
}

export interface CheckItem {
  id: string;
  name: string;
  priority: Priority;
  categoryId: string;
  createdAt: Date;
}

export interface CheckSession {
  id: string;
  categoryId: string;
  categoryName: string;
  date: Date;
  totalItems: number;
  completedItems: number;
  incompleteItems: string[];
  isAllCompleted: boolean;
  completionRate: number;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
  darkMode: boolean;
}

export interface CheckState {
  [itemId: string]: boolean;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}