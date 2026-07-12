import api from './api';
import { User } from '../types';

export async function register(data: {
  fullName: string;
  email: string;
  mobile?: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function googleLogin(data: { email: string; fullName: string; googleId: string; avatar?: string }) {
  const res = await api.post('/auth/google', data);
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function verifyResetOTP(email: string, otp: string) {
  const res = await api.post('/auth/verify-reset-otp', { email, otp });
  return res.data;
}

export async function resetPassword(email: string, otp: string, password: string, confirmPassword: string) {
  const res = await api.post('/auth/reset-password', { email, otp, password, confirmPassword });
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  const res = await api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword });
  return res.data;
}

export async function logout() {
  await api.post('/auth/logout');
}

export async function logoutAllDevices() {
  await api.post('/auth/logout-all');
}

export async function getSessions() {
  const res = await api.get('/auth/sessions');
  return res.data;
}

export async function getLoginHistory() {
  const res = await api.get('/auth/login-history');
  return res.data;
}

export async function getSecurityLogs() {
  const res = await api.get('/auth/security-logs');
  return res.data;
}
