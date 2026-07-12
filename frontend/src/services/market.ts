import api from './api';
import { MarketInsight } from '../types';

export async function getMarketInsights(): Promise<MarketInsight[]> {
  const res = await api.get('/market');
  return res.data;
}

export async function getTrendingSkills(): Promise<MarketInsight[]> {
  const res = await api.get('/market/trending-skills');
  return res.data;
}

export async function getTopCompanies(): Promise<MarketInsight[]> {
  const res = await api.get('/market/top-companies');
  return res.data;
}
