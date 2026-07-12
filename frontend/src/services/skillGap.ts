import api from './api';
import { SkillGap } from '../types';

export async function getSkillGaps(): Promise<SkillGap[]> {
  const res = await api.get('/skill-gaps');
  return res.data;
}

export async function analyzeSkillGaps(): Promise<SkillGap[]> {
  const res = await api.post('/skill-gaps/analyze');
  return res.data;
}

export async function updateSkillGap(id: string, data: { isBeingAddressed: boolean }) {
  const res = await api.put(`/skill-gaps/${id}`, data);
  return res.data;
}
