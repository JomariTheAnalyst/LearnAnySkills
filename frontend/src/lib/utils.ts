import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: string): string {
  // Handle various duration formats
  if (!duration) return 'Unknown duration';
  
  // Convert common patterns
  const patterns = [
    { regex: /(\d+)\s*min/i, replacement: '$1 minutes' },
    { regex: /(\d+)\s*hour/i, replacement: '$1 hour' },
    { regex: /(\d+)\s*week/i, replacement: '$1 week' },
    { regex: /(\d+)\s*day/i, replacement: '$1 day' },
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(duration)) {
      return duration.replace(pattern.regex, pattern.replacement);
    }
  }
  
  return duration;
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-accent-600 bg-accent-50';
    case 'intermediate':
      return 'text-primary-600 bg-primary-50';
    case 'advanced':
      return 'text-secondary-600 bg-secondary-50';
    default:
      return 'text-neutral-600 bg-neutral-50';
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function generateLessonSlug(courseTitle: string, lessonTitle: string): string {
  const courseSlug = courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const lessonSlug = lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `${courseSlug}/${lessonSlug}`;
}

export function parseLearningObjectives(objectives: string | string[]): string[] {
  if (Array.isArray(objectives)) {
    return objectives;
  }
  
  try {
    const parsed = JSON.parse(objectives);
    return Array.isArray(parsed) ? parsed : [objectives];
  } catch {
    return [objectives];
  }
}

export function formatProgress(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

export function getRandomColor(): string {
  const colors = [
    '#0ea5e9', // primary-500
    '#d946ef', // secondary-500
    '#10b981', // accent-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  return Promise.resolve();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}