import api from './api';
import { Chat, ChatMessage } from '../types';

export async function getChats(): Promise<Chat[]> {
  const res = await api.get('/chat');
  return res.data;
}

export async function getChatById(id: string): Promise<Chat> {
  const res = await api.get(`/chat/${id}`);
  return res.data;
}

export async function createChat(data: { title?: string; category?: string; initialMessage?: string }): Promise<Chat> {
  const res = await api.post('/chat', data);
  return res.data;
}

export async function sendMessage(chatId: string, content: string): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage }> {
  const res = await api.post(`/chat/${chatId}/messages`, { content });
  return res.data;
}

export async function archiveChat(id: string) {
  await api.put(`/chat/${id}/archive`);
}

export async function deleteChat(id: string) {
  await api.delete(`/chat/${id}`);
}

export async function searchChats(query: string): Promise<Chat[]> {
  const res = await api.get(`/chat/search?q=${encodeURIComponent(query)}`);
  return res.data;
}
