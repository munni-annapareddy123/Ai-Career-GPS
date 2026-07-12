import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../types';
import { generateCareerRecommendations } from '../utils/openai';

export async function getRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const all = await prisma.recommendation.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    const seen = new Set<string>();
    const deduped: typeof all = [];
    const toDelete: string[] = [];
    for (const rec of all) {
      const key = rec.careerTitle.toLowerCase();
      if (seen.has(key)) {
        toDelete.push(rec.id);
      } else {
        seen.add(key);
        deduped.push(rec);
      }
    }
    if (toDelete.length > 0) {
      await prisma.recommendation.deleteMany({ where: { id: { in: toDelete } } });
    }
    res.json(deduped);
  } catch (error) {
    next(error);
  }
}

export async function generateRecommendations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [profile, marketTrends] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: req.userId },
        include: { skills: true },
      }),
      prisma.marketInsight.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
    ]);

    const userSkills = profile?.skills?.map(s => s.name) || [];
    const userGoals = profile?.careerGoals || '';
    const interests = profile?.interests || '';

    const aiRecommendations = await generateCareerRecommendations(profile, userSkills, userGoals || interests, marketTrends);

    await prisma.recommendation.deleteMany({ where: { userId: req.userId } });

    let savedRecommendations = [];
    for (const rec of aiRecommendations) {
      const saved = await prisma.recommendation.create({
        data: {
          userId: req.userId!,
          careerTitle: rec.careerTitle,
          matchPercentage: rec.matchPercentage,
          confidenceScore: rec.confidenceScore,
          salaryInsights: JSON.stringify(rec.salaryInsights || {}),
          industryDemand: rec.industryDemand,
          growthPotential: rec.growthPotential,
          requiredSkills: JSON.stringify(rec.requiredSkills || []),
          reasons: JSON.stringify(rec.reasons || []),
          influencingSkills: JSON.stringify(rec.influencingSkills || []),
          influencingGoals: JSON.stringify(rec.influencingGoals || []),
          isVerified: rec.confidenceScore >= 60,
          verificationSource: rec.confidenceScore >= 60 ? 'AI Analysis + Market Validation' : 'Low confidence - needs more data',
        },
      });
      savedRecommendations.push(saved);
    }

    if (savedRecommendations.length > 0) {
      for (const rec of savedRecommendations) {
        const skills = JSON.parse(rec.requiredSkills || '[]');
        for (const skillName of skills) {
          const existingGap = await prisma.skillGap.findFirst({
            where: { userId: req.userId, skillName },
          });
          if (!existingGap) {
            await prisma.skillGap.create({
              data: {
                userId: req.userId!,
                skillName,
                currentLevel: userSkills.includes(skillName) ? 'INTERMEDIATE' : 'NONE',
                requiredLevel: 'ADVANCED',
                gap: userSkills.includes(skillName) ? 40 : 100,
                priority: 'RECOMMENDED',
                category: 'TECHNICAL',
              },
            });
          }
        }
      }
    }

    res.json(savedRecommendations);
  } catch (error) {
    next(error);
  }
}

export async function acceptRecommendation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const rec = await prisma.recommendation.update({
      where: { id },
      data: { isAccepted: true },
    });

    const requiredSkills = JSON.parse(rec.requiredSkills || '[]');
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    const existingSkills = profile ? (await prisma.skill.findMany({
      where: { profileId: profile.id },
      select: { name: true },
    })).map(s => s.name) : [];

    for (const skillName of requiredSkills) {
      if (!existingSkills.includes(skillName)) {
        const existingGap = await prisma.skillGap.findFirst({
          where: { userId: req.userId, skillName },
        });
        if (!existingGap) {
          await prisma.skillGap.create({
            data: {
              userId: req.userId!,
              skillName,
              currentLevel: 'NONE',
              requiredLevel: 'ADVANCED',
              gap: 100,
              priority: 'CRITICAL',
              category: 'TECHNICAL',
            },
          });
        }
      }
    }

    res.json(rec);
  } catch (error) {
    next(error);
  }
}

export async function getRecommendationById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const rec = await prisma.recommendation.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
    res.json(rec);
  } catch (error) {
    next(error);
  }
}
