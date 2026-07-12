import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../types';

export async function getMarketInsights(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const insights = await prisma.marketInsight.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    res.json(insights);
  } catch (error) {
    next(error);
  }
}

export async function getTrendingSkills(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const skills = await prisma.marketInsight.findMany({
      where: { category: 'TRENDING_SKILL' },
      orderBy: { percentage: 'desc' },
    });
    res.json(skills);
  } catch (error) {
    next(error);
  }
}

export async function getFutureSkills(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const skills = await prisma.marketInsight.findMany({
      where: { category: 'FUTURE_SKILL' },
      orderBy: { percentage: 'desc' },
    });
    res.json(skills);
  } catch (error) {
    next(error);
  }
}

export async function getSalaryTrends(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const trends = await prisma.marketInsight.findMany({
      where: { category: 'SALARY_TREND' },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(trends);
  } catch (error) {
    next(error);
  }
}

export async function getTopCompanies(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const companies = await prisma.marketInsight.findMany({
      where: { category: 'TOP_COMPANY' },
      orderBy: { percentage: 'desc' },
    });
    res.json(companies);
  } catch (error) {
    next(error);
  }
}
