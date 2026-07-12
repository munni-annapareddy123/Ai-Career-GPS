import api from './api';
import { Notification } from '../types';

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get('/notifications');
  return res.data;
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get('/notifications/unread-count');
  return res.data.count;
}

export async function markAsRead(id: string) {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllAsRead() {
  await api.put('/notifications/read-all');
}
