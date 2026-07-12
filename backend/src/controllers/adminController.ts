import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../types';

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search as string } },
        { email: { contains: search as string } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, mobile: true,
          role: true, isVerified: true, createdAt: true,
          _count: { select: { sessions: true, resumes: true, chats: true, interviews: true } },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: parseInt(page as string), totalPages: Math.ceil(total / take) });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['STUDENT', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, fullName: true, email: true, role: true },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalUsers,
      verifiedUsers,
      totalResumes,
      totalChats,
      totalInterviews,
      totalRoadmaps,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.resume.count(),
      prisma.chat.count(),
      prisma.interview.count(),
      prisma.roadmap.count(),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, fullName: true, email: true, createdAt: true } }),
    ]);

    res.json({
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      totalResumes,
      totalChats,
      totalInterviews,
      totalRoadmaps,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
}

export async function manageCareer(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, description, category, salaryRange, demandLevel, growthPotential, requiredSkills } = req.body;
    const career = await prisma.career.create({
      data: { title, description, category, salaryRange, demandLevel, growthPotential, requiredSkills: JSON.stringify(requiredSkills || []) },
    });
    res.json(career);
  } catch (error) {
    next(error);
  }
}

export async function addMarketInsight(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const insight = await prisma.marketInsight.create({ data: req.body });
    res.json(insight);
  } catch (error) {
    next(error);
  }
}

export async function addLearningResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const resource = await prisma.learningResource.create({
      data: {
        ...req.body,
        skills: JSON.stringify(req.body.skills || []),
        careerIds: JSON.stringify(req.body.careerIds || []),
      },
    });
    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function getLearningResources(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const resources = await prisma.learningResource.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    next(error);
  }
}
