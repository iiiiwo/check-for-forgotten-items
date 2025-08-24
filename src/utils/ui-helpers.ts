import { 
  FolderIcon,
  BriefcaseIcon,
  LuggageIcon,
  BookOpenIcon,
  GamepadIcon,
  MusicIcon,
  CameraIcon,
  CarIcon,
  BikeIcon,
  PlaneIcon,
  HomeIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  FlagIcon,
  BellIcon,
  GiftIcon,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryColor } from '../types';

const iconMap: Record<string, LucideIcon> = {
  'folder': FolderIcon,
  'briefcase': BriefcaseIcon,
  'suitcase': LuggageIcon,
  'book-open': BookOpenIcon,
  'gamepad': GamepadIcon,
  'music': MusicIcon,
  'camera': CameraIcon,
  'car': CarIcon,
  'bike': BikeIcon,
  'plane': PlaneIcon,
  'home': HomeIcon,
  'user': UserIcon,
  'heart': HeartIcon,
  'star': StarIcon,
  'flag': FlagIcon,
  'bell': BellIcon,
  'gift': GiftIcon,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || FolderIcon;
};

export const getColorClasses = (color: CategoryColor) => {
  const colorMap: Record<CategoryColor, { bg: string; text: string; border: string }> = {
    blue: { 
      bg: 'bg-blue-100 dark:bg-blue-900', 
      text: 'text-blue-600 dark:text-blue-400', 
      border: 'border-blue-200 dark:border-blue-700' 
    },
    green: { 
      bg: 'bg-green-100 dark:bg-green-900', 
      text: 'text-green-600 dark:text-green-400', 
      border: 'border-green-200 dark:border-green-700' 
    },
    orange: { 
      bg: 'bg-orange-100 dark:bg-orange-900', 
      text: 'text-orange-600 dark:text-orange-400', 
      border: 'border-orange-200 dark:border-orange-700' 
    },
    red: { 
      bg: 'bg-red-100 dark:bg-red-900', 
      text: 'text-red-600 dark:text-red-400', 
      border: 'border-red-200 dark:border-red-700' 
    },
    purple: { 
      bg: 'bg-purple-100 dark:bg-purple-900', 
      text: 'text-purple-600 dark:text-purple-400', 
      border: 'border-purple-200 dark:border-purple-700' 
    },
    pink: { 
      bg: 'bg-pink-100 dark:bg-pink-900', 
      text: 'text-pink-600 dark:text-pink-400', 
      border: 'border-pink-200 dark:border-pink-700' 
    },
    yellow: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      border: 'border-yellow-200 dark:border-yellow-700' 
    },
    gray: { 
      bg: 'bg-gray-100 dark:bg-gray-700', 
      text: 'text-gray-600 dark:text-gray-400', 
      border: 'border-gray-200 dark:border-gray-600' 
    },
  };

  return colorMap[color];
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    critical: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400',
    high: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400',
    medium: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400',
    low: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400',
  };

  return priorityColors[priority] || priorityColors.medium;
};

export const getPriorityLabel = (priority: string): string => {
  const labels: Record<string, string> = {
    critical: '必須',
    high: '高',
    medium: '中',
    low: '低',
  };

  return labels[priority] || '中';
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getAvailableIcons = (): Array<{ name: string; component: LucideIcon }> => {
  return Object.entries(iconMap).map(([name, component]) => ({ name, component }));
};