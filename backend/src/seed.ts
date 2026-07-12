import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const skills = ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js', 'SQL', 'Machine Learning',
    'Data Science', 'Cloud Computing', 'DevOps', 'Docker', 'Kubernetes', 'AWS', 'Django', 'Flutter',
    'Go', 'Rust', 'System Design', 'DSA', 'Blockchain', 'AI', 'Deep Learning', 'NLP', 'Computer Vision',
    'Cybersecurity', 'React Native', 'GraphQL', 'Redis', 'MongoDB', 'PostgreSQL', 'Kafka'];

  for (const skill of skills) {
    const existing = await prisma.marketInsight.findFirst({ where: { skill, category: 'TRENDING_SKILL' } });
    if (!existing) {
      await prisma.marketInsight.create({
        data: {
          skill,
          category: 'TRENDING_SKILL',
          trend: Math.random() > 0.3 ? 'UP' : 'STABLE',
          percentage: Math.floor(Math.random() * 60) + 40,
          description: `${skill} is in high demand across the industry`,
        },
      });
    }
  }

  const futureSkills = ['Quantum Computing', 'Edge AI', 'Web Assembly', 'Bioinformatics',
    'AR/VR Development', 'Autonomous Systems', 'Generative AI', 'Cellular Agriculture',
    'Space Tech', 'Neuromorphic Computing'];

  for (const skill of futureSkills) {
    const existing = await prisma.marketInsight.findFirst({ where: { skill, category: 'FUTURE_SKILL' } });
    if (!existing) {
      await prisma.marketInsight.create({
        data: {
          skill,
          category: 'FUTURE_SKILL',
          trend: 'UP',
          percentage: Math.floor(Math.random() * 40) + 60,
          description: `${skill} is emerging as a future-critical skill`,
        },
      });
    }
  }

  const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla',
    'Adobe', 'Salesforce', 'Uber', 'Stripe', 'Atlassian', 'LinkedIn', 'Twitter', 'Spotify'];

  for (const company of companies) {
    const existing = await prisma.marketInsight.findFirst({ where: { title: company, category: 'TOP_COMPANY' } });
    if (!existing) {
      await prisma.marketInsight.create({
        data: {
          title: company,
          category: 'TOP_COMPANY',
          trend: 'UP',
          percentage: Math.floor(Math.random() * 30) + 70,
          description: `${company} is a top hiring company for tech talent`,
        },
      });
    }
  }

  console.log('Seed data created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
