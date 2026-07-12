import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Route, Plus, RefreshCw, CheckCircle, Circle, Clock, Target, Zap, Sparkles, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { getCurrentRoadmap, generateRoadmap, updateTaskStatus, getRoadmaps, regenerateRoadmap } from '../services/roadmap';
import { Roadmap, Task } from '../types';
import { getPriorityColor, getTaskStatusColor, formatDate, cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get('skill');
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(!!skillParam);
  const [generating, setGenerating] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    careerGoal: skillParam || '',
    learningSpeed: 'MODERATE',
    availableTime: '2 hours per day',
    salaryGoal: '',
    preferredCompany: '',
    domain: skillParam || '',
    months: 6,
  });

  const fetchData = async () => {
    try {
      const [all, current] = await Promise.all([
        getRoadmaps().catch(() => []),
        getCurrentRoadmap().catch(() => null),
      ]);
      setRoadmaps(all);
      setCurrentRoadmap(current);
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async () => {
    if (!form.careerGoal) { toast.error('Career goal is required'); return; }
    setGenerating(true);
    try {
      const roadmap = await generateRoadmap(form);
      setCurrentRoadmap(roadmap);
      setShowGenerator(false);
      toast.success('Roadmap generated!');
      fetchData();
    } catch {
      toast.error('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleTaskStatus = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchData();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleRegenerate = async () => {
    if (!currentRoadmap) return;
    try {
      const updated = await regenerateRoadmap(currentRoadmap.id, form);
      setCurrentRoadmap(updated);
      toast.success('Roadmap regenerated!');
    } catch {
      toast.error('Regeneration failed');
    }
  };

  const completedTasks = currentRoadmap?.tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const totalTasks = currentRoadmap?.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learning Roadmap</h1>
          <p className="text-muted-foreground text-sm mt-1">Dynamic, personalized career roadmap</p>
        </div>
        <div className="flex gap-2">
          {currentRoadmap && (
            <Button variant="outline" onClick={() => setShowGenerator(!showGenerator)} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Modify
            </Button>
          )}
          <Button onClick={() => setShowGenerator(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Roadmap
          </Button>
        </div>
      </div>

      {showGenerator && (
        <Card className="gradient-border">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              {currentRoadmap ? 'Modify Your Roadmap' : 'Create New Roadmap'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Career Goal *</Label>
                <Input placeholder="e.g., Full Stack Developer" value={form.careerGoal} onChange={e => setForm(p => ({ ...p, careerGoal: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Learning Speed</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={form.learningSpeed} onChange={e => setForm(p => ({ ...p, learningSpeed: e.target.value }))}>
                  <option value="SLOW">Slow (Relaxed)</option>
                  <option value="MODERATE">Moderate (Balanced)</option>
                  <option value="FAST">Fast (Intensive)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Available Time</Label>
                <Input placeholder="e.g., 2 hours per day" value={form.availableTime} onChange={e => setForm(p => ({ ...p, availableTime: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Salary Goal</Label>
                <Input placeholder="e.g., ₹12,00,000" value={form.salaryGoal} onChange={e => setForm(p => ({ ...p, salaryGoal: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Company</Label>
                <Input placeholder="e.g., Google, Microsoft" value={form.preferredCompany} onChange={e => setForm(p => ({ ...p, preferredCompany: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Domain / Specialization</Label>
                <Input placeholder="e.g., AI/ML, Web Dev, Cloud" value={form.domain} onChange={e => setForm(p => ({ ...p, domain: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Input type="number" min={1} max={36} placeholder="6" value={form.months} onChange={e => setForm(p => ({ ...p, months: Math.max(1, Number(e.target.value) || 1) }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleGenerate} disabled={generating}>
                <Sparkles className="w-4 h-4 mr-2" /> {generating ? 'Generating...' : currentRoadmap ? 'Regenerate' : 'Generate Roadmap'}
              </Button>
              <Button variant="outline" onClick={() => setShowGenerator(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentRoadmap ? (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">{currentRoadmap.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentRoadmap.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>Goal: {currentRoadmap.careerGoal}</span>
                    <span>Duration: {currentRoadmap.duration || 'Ongoing'}</span>
                    <span>Speed: {currentRoadmap.learningSpeed}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{progress}%</p>
                  <p className="text-xs text-muted-foreground">{completedTasks}/{totalTasks} tasks</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" indicatorClassName={progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : ''} />
            </CardContent>
          </Card>

          <div className="space-y-2">
            {currentRoadmap.tasks?.map((task) => {
              const isExpanded = expandedTasks.has(task.id);
              const subtopics: string[] = task.subtopics ? JSON.parse(task.subtopics) : [];
              return (
              <Card key={task.id} className="glass-hover">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => {
                    if (!task.subtopics || JSON.parse(task.subtopics).length === 0) return;
                    setExpandedTasks(prev => {
                      const next = new Set(prev);
                      if (next.has(task.id)) next.delete(task.id); else next.add(task.id);
                      return next;
                    });
                  }}>
                    <button onClick={(e) => { e.stopPropagation(); handleTaskStatus(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'); }} className="shrink-0">
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : task.status === 'IN_PROGRESS' ? (
                        <Clock className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <Badge className={`text-[10px] ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                        <Badge variant="outline" className="text-[10px]">{task.type}</Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                      )}
                      {subtopics.length > 0 && !isExpanded && (
                        <p className="text-xs text-primary/60 mt-2 flex items-center gap-1">
                          <ListChecks className="w-3 h-3" /> {subtopics.length} focus areas — click to expand
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
                      )}
                      {subtopics.length > 0 && (
                        isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {isExpanded && subtopics.length > 0 && (
                    <div className="px-4 pb-4 pt-0 border-t border-border ml-16">
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {subtopics.map((topic, ti) => (
                          <div key={ti} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Route className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Roadmap</h3>
            <p className="text-muted-foreground mb-6">Create a personalized learning roadmap to accelerate your career journey.</p>
            <Button onClick={() => setShowGenerator(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Your Roadmap
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
