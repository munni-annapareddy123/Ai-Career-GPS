import React, { useEffect, useState } from 'react';
import { Briefcase, Mic, Play, CheckCircle, BarChart3, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { getInterviews, startInterview, submitAnswer, completeInterview } from '../services/interview';
import { Interview } from '../types';
import { getScoreColor, formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'start' | 'practice'>('list');
  const [form, setForm] = useState({ type: 'TECHNICAL', role: '', company: '' });
  const [currentInterview, setCurrentInterview] = useState<any>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getInterviews();
      setInterviews(data);
    } catch { console.error('Failed to fetch interviews'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStart = async () => {
    if (!form.role) { toast.error('Role is required'); return; }
    try {
      const data = await startInterview(form);
      setCurrentInterview(data);
      setCurrentQIndex(0);
      setAnswer('');
      setActiveView('practice');
      toast.success('Interview started!');
    } catch { toast.error('Failed to start interview'); }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please provide an answer'); return; }
    setSubmitting(true);
    try {
      const result = await submitAnswer(currentInterview.interview.id, {
        question: currentInterview.questions[currentQIndex],
        answer,
        questionIndex: currentQIndex,
      });
      if (result.isComplete) {
        await completeInterview(currentInterview.interview.id);
        toast.success('Interview completed!');
        setActiveView('list');
        fetchData();
      } else {
        setCurrentQIndex(prev => prev + 1);
        setAnswer('');
        toast.success('Answer recorded!');
      }
    } catch { toast.error('Failed to submit answer'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Interview Coach</h1>
          <p className="text-muted-foreground text-sm mt-1">Practice interviews with AI-powered evaluation</p>
        </div>
        <Button onClick={() => setActiveView('start')} className="gap-2">
          <Mic className="w-4 h-4" /> Start Interview
        </Button>
      </div>

      {activeView === 'start' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Configure Interview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="TECHNICAL">Technical</option>
                  <option value="HR">HR / Behavioral</option>
                  <option value="CODING">Coding</option>
                  <option value="MOCK">Mock Interview</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Target Role</Label>
                <Input placeholder="e.g., Software Engineer" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Company (optional)</Label>
                <Input placeholder="e.g., Google" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleStart}><Play className="w-4 h-4 mr-2" /> Start</Button>
              <Button variant="outline" onClick={() => setActiveView('list')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === 'practice' && currentInterview && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{currentInterview.interview.role} Interview</h3>
                <p className="text-sm text-muted-foreground">Question {currentQIndex + 1} of {currentInterview.questions.length}</p>
              </div>
              <Badge>{currentInterview.interview.type}</Badge>
            </div>
            <Progress value={((currentQIndex) / currentInterview.questions.length) * 100} className="mb-6" />
            <div className="p-4 rounded-lg bg-secondary/30 mb-4">
              <p className="font-medium mb-2">Question:</p>
              <p>{currentInterview.questions[currentQIndex]}</p>
            </div>
            <div className="space-y-2 mb-4">
              <Label>Your Answer</Label>
              <textarea
                className="w-full min-h-[120px] rounded-lg border border-input bg-background p-3 text-sm resize-none"
                placeholder="Type your answer here..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmitAnswer} disabled={submitting || !answer.trim()}>
              {submitting ? 'Evaluating...' : 'Submit Answer'}
            </Button>
          </CardContent>
        </Card>
      )}

      {interviews.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Interview History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interviews.map(iv => (
                <div key={iv.id} className="flex items-center justify-between p-3 rounded-lg glass-hover">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{iv.role || 'Interview'} <span className="text-xs text-muted-foreground">({iv.type})</span></p>
                      <p className="text-xs text-muted-foreground">{formatDate(iv.createdAt)} · {iv.company || 'General'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {iv.overallScore && (
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(iv.overallScore)}`}>{iv.overallScore}%</p>
                        <p className="text-[10px] text-muted-foreground">Score</p>
                      </div>
                    )}
                    <Badge variant={iv.status === 'COMPLETED' ? 'success' : 'warning'}>{iv.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : activeView === 'list' && (
        <Card>
          <CardContent className="text-center py-12">
            <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Interviews Yet</h3>
            <p className="text-muted-foreground mb-6">Practice interviews with AI-powered evaluation and feedback.</p>
            <Button onClick={() => setActiveView('start')}><Play className="w-4 h-4 mr-2" /> Start First Interview</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
