import api from './api';
import { Resume } from '../types';

export async function uploadResume(file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append('resume', file);
  const res = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': null },
  });
  return res.data;
}

export async function getResumes(): Promise<Resume[]> {
  const res = await api.get('/resume');
  return res.data;
}

export async function getLatestResume(): Promise<Resume> {
  const res = await api.get('/resume/latest');
  return res.data;
}
