import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../types';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../utils/openai';

export async function startInterview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { type, role, company } = req.body;
    if (!type || !role) return res.status(400).json({ error: 'Interview type and role are required' });

    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
      include: { skills: true },
    });

    const skills = profile?.skills?.map(s => s.name) || [];
    const interviewData = await generateInterviewQuestions(type, role, skills);

    const interview = await prisma.interview.create({
      data: {
        userId: req.userId!,
        type,
        role,
        company,
        questions: JSON.stringify(interviewData.questions || []),
      },
    });

    res.json({
      interview,
      questions: interviewData.questions || [],
      expectedAnswers: interviewData.expectedAnswers || [],
      evaluationCriteria: interviewData.evaluationCriteria || {},
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAnswer(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { interviewId } = req.params;
    const { question, answer, questionIndex } = req.body;

    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId: req.userId },
    });

    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const criteria = { communication: 25, confidence: 25, technicalAccuracy: 25, problemSolving: 25 };
    const evaluation = await evaluateInterviewAnswer(question, answer, criteria);

    const existingAnswers = JSON.parse(interview.answers || '[]');
    existingAnswers.push({ question, answer, evaluation, questionIndex });
    const updatedAnswers = JSON.stringify(existingAnswers);

    const existingQuestions = JSON.parse(interview.questions || '[]');
    const totalQuestions = existingQuestions.length;
    const answeredCount = existingAnswers.length;

    let overallScore = evaluation.overallScore || 0;
    if (answeredCount > 0) {
      const scores = existingAnswers.map((a: any) => a.evaluation?.overallScore || 0);
      overallScore = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
    }

    const isComplete = answeredCount >= totalQuestions;

    await prisma.interview.update({
      where: { id: interviewId },
      data: {
        answers: updatedAnswers,
        overallScore,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore,
        technicalAccuracy: evaluation.technicalAccuracy,
        problemSolvingScore: evaluation.problemSolvingScore,
        status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
        completedAt: isComplete ? new Date() : undefined,
      },
    });

    res.json({ evaluation, answeredCount, totalQuestions, isComplete });
  } catch (error) {
    next(error);
  }
}

export async function getInterviews(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
}

export async function getInterviewById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const interview = await prisma.interview.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    next(error);
  }
}

export async function completeInterview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { interviewId } = req.params;
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId: req.userId },
    });

    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const answers = JSON.parse(interview.answers || '[]');
    const scores = answers.map((a: any) => a.evaluation?.overallScore || 0);
    const overallScore = scores.length > 0
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0;

    const commScores = answers.map((a: any) => a.evaluation?.communicationScore || 0);
    const confScores = answers.map((a: any) => a.evaluation?.confidenceScore || 0);
    const techScores = answers.map((a: any) => a.evaluation?.technicalAccuracy || 0);
    const probScores = answers.map((a: any) => a.evaluation?.problemSolvingScore || 0);

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        overallScore,
        communicationScore: avg(commScores),
        confidenceScore: avg(confScores),
        technicalAccuracy: avg(techScores),
        problemSolvingScore: avg(probScores),
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}
