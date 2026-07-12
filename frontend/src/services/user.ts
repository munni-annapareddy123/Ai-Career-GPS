import api from './api';
import { Dashboard, Profile, User } from '../types';

export async function getMe(): Promise<User> {
  const res = await api.get('/user/me');
  return res.data;
}

export async function updateMe(data: Partial<User>) {
  const res = await api.put('/user/me', data);
  return res.data;
}

export async function getProfile(): Promise<Profile> {
  const res = await api.get('/user/profile');
  return res.data;
}

export async function updateProfile(data: Partial<Profile>) {
  const res = await api.put('/user/profile', data);
  return res.data;
}

export async function getDashboard(): Promise<Dashboard> {
  const res = await api.get('/user/dashboard');
  return res.data;
}

export async function addSkill(data: { name: string; category?: string; level?: string }) {
  const res = await api.post('/user/skills', data);
  return res.data;
}

export async function updateSkill(id: string, data: { level?: string; category?: string }) {
  const res = await api.put(`/user/skills/${id}`, data);
  return res.data;
}

export async function deleteSkill(id: string) {
  await api.delete(`/user/skills/${id}`);
}

export async function addCertification(data: any) {
  const res = await api.post('/user/certifications', data);
  return res.data;
}

export async function addProject(data: any) {
  const res = await api.post('/user/projects', data);
  return res.data;
}

export async function addInternship(data: any) {
  const res = await api.post('/user/internships', data);
  return res.data;
}
