import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/20 text-green-400';
  if (score >= 60) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-red-500/20 text-red-400';
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return 'text-red-400 bg-red-500/10';
    case 'HIGH': return 'text-orange-400 bg-orange-500/10';
    case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10';
    case 'LOW': return 'text-green-400 bg-green-500/10';
    default: return 'text-gray-400 bg-gray-500/10';
  }
}

export function getTaskStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED': return 'text-green-400';
    case 'IN_PROGRESS': return 'text-blue-400';
    case 'SKIPPED': return 'text-gray-500';
    default: return 'text-yellow-400';
  }
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
