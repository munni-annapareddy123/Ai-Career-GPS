import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Brain, FileText, Route, Briefcase, TrendingUp,
  GraduationCap, Award, Zap, AlertTriangle, CheckCircle, Clock,
  BookOpen, Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getDashboard } from '../services/user';
import { getTrendingSkills } from '../services/market';
import { getSkillGaps } from '../services/skillGap';
import { Dashboard as DashboardType, MarketInsight, SkillGap, Recommendation } from '../types';
import { getScoreColor, getScoreBgColor } from '../lib/utils';
import { generateRecommendations, getRecommendations } from '../services/recommendation';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [trendingSkills, setTrendingSkills] = useState<MarketInsight[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [dash, skills, gaps, recs] = await Promise.all([
        getDashboard(),
        getTrendingSkills(),
        getSkillGaps(),
        getRecommendations().catch(() => []),
      ]);
      setDashboard(dash);
      setTrendingSkills(skills);
      setSkillGaps(gaps);
      setRecommendations(recs);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerateRecs = async () => {
    try {
      const recs = await generateRecommendations();
      setRecommendations(recs);
      fetchData();
    } catch (error: any) {
      console.error('Generation error:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const scoreWidgets = [
    { label: 'Career Readiness', value: dashboard?.careerReadinessScore || 0, icon: Target, color: 'text-blue-400' },
    { label: 'Resume Score', value: dashboard?.resumeScore || 0, icon: FileText, color: 'text-purple-400' },
    { label: 'ATS Score', value: dashboard?.atsScore || 0, icon: Award, color: 'text-green-400' },
    { label: 'Interview Readiness', value: dashboard?.interviewReadiness || 0, icon: Briefcase, color: 'text-orange-400' },
    { label: 'Skill Readiness', value: dashboard?.skillReadiness || 0, icon: Brain, color: 'text-pink-400' },
    { label: 'Market Alignment', value: dashboard?.marketAlignmentScore || 0, icon: TrendingUp, color: 'text-cyan-400' },
    { label: 'Learning Progress', value: dashboard?.learningProgress || 0, icon: BookOpen, color: 'text-indigo-400' },
    { label: 'Placement Readiness', value: dashboard?.placementReadinessScore || 0, icon: GraduationCap, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your career intelligence overview</p>
        </div>
        <Button onClick={handleGenerateRecs} className="gap-2">
          <Sparkles className="w-4 h-4" /> Generate Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scoreWidgets.map((w) => (
          <Card key={w.label} className="glass-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{w.label}</p>
                <w.icon className={`w-4 h-4 ${w.color}`} />
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(w.value)}`}>{w.value}%</p>
              <Progress value={w.value} className="mt-2 h-1.5" indicatorClassName={w.value >= 80 ? 'bg-green-500' : w.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingSkills.slice(0, 8).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-sm">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.percentage || 0} className="w-24 h-1.5" />
                    <span className={`text-xs font-medium ${(skill.percentage || 0) >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {skill.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Critical Skill Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillGaps.filter(g => g.priority === 'CRITICAL').slice(0, 8).map((gap) => (
                <div key={gap.id} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div>
                    <span className="text-sm font-medium">{gap.skillName}</span>
                    <p className="text-xs text-muted-foreground">{gap.currentLevel || 'NONE'} → {gap.requiredLevel}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">{gap.gap}% gap</Badge>
                </div>
              ))}
              {skillGaps.filter(g => g.priority === 'CRITICAL').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No critical gaps identified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Career Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg border border-border bg-card/50 glass-hover cursor-pointer" onClick={() => navigate('/recommendations')}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{rec.careerTitle}</h3>
                    <Badge variant={rec.isVerified ? 'success' : 'warning'}>
                      {rec.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Match: <strong className={getScoreColor(rec.matchPercentage)}>{rec.matchPercentage}%</strong></span>
                    <span>Confidence: <strong className={getScoreColor(rec.confidenceScore)}>{rec.confidenceScore}%</strong></span>
                  </div>
                  <Progress value={rec.matchPercentage} className="mt-2 h-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No recommendations yet. Generate AI-powered career recommendations.</p>
              <Button onClick={handleGenerateRecs}><Sparkles className="w-4 h-4 mr-2" /> Generate Now</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
