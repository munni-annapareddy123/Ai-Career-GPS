import api from './api';
import { Roadmap } from '../types';

export async function getRoadmaps(): Promise<Roadmap[]> {
  const res = await api.get('/roadmaps');
  return res.data;
}

export async function getCurrentRoadmap(): Promise<Roadmap> {
  const res = await api.get('/roadmaps/current');
  return res.data;
}

export async function generateRoadmap(data: {
  careerGoal: string;
  learningSpeed?: string;
  availableTime?: string;
  salaryGoal?: string;
  preferredCompany?: string;
  domain?: string;
  months?: number;
}): Promise<Roadmap> {
  const res = await api.post('/roadmaps/generate', data);
  return res.data;
}

export async function updateTaskStatus(taskId: string, status: string) {
  const res = await api.put(`/roadmaps/tasks/${taskId}`, { status });
  return res.data;
}

export async function regenerateRoadmap(roadmapId: string, data: any) {
  const res = await api.put(`/roadmaps/${roadmapId}/regenerate`, data);
  return res.data;
}
