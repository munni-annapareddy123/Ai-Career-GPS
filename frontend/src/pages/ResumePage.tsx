import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Download, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { uploadResume, getLatestResume, getResumes } from '../services/resume';
import { Resume } from '../types';
import { getScoreColor, formatDate, cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [latestResume, setLatestResume] = useState<Resume | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const [all, latest] = await Promise.all([
        getResumes(),
        getLatestResume().catch(() => null),
      ]);
      setResumes(all);
      setLatestResume(latest);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success('Resume uploaded and analyzed!');
      fetchResumes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
  });

  const strengths = latestResume?.strengths ? JSON.parse(latestResume.strengths) : [];
  const weaknesses = latestResume?.weaknesses ? JSON.parse(latestResume.weaknesses) : [];
  const parsedData = latestResume?.parsedData ? JSON.parse(latestResume.parsedData) : null;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resume Intelligence</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload your resume for AI-powered analysis and scoring</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        )}
      >
        <input {...getInputProps()} />
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
          {uploading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /> : <Upload className="w-8 h-8 text-primary" />}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {uploading ? 'Analyzing your resume...' : isDragActive ? 'Drop your resume here' : 'Upload your resume'}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">Drag & drop or click to browse (PDF or DOCX, max 10MB)</p>
        <Button variant="outline" disabled={uploading}>
          <FileText className="w-4 h-4 mr-2" /> Choose File
        </Button>
      </div>

      {latestResume && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${getScoreColor(latestResume.resumeScore || 0)}`}>{latestResume.resumeScore || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Resume Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${getScoreColor(latestResume.atsScore || 0)}`}>{latestResume.atsScore || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">ATS Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${getScoreColor(latestResume.careerReadiness || 0)}`}>{latestResume.careerReadiness || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Career Readiness</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${getScoreColor(latestResume.employabilityScore || 0)}`}>{latestResume.employabilityScore || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Employability</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strengths.length > 0 ? (
                  <div className="space-y-2">
                    {strengths.map((s: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No strengths identified yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weaknesses.length > 0 ? (
                  <div className="space-y-2">
                    {weaknesses.map((w: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <XCircle className="w-3 h-3 text-red-400 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No weaknesses identified yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {parsedData && parsedData.skills && parsedData.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Extracted Skills ({parsedData.skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill: string, i: number) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {parsedData?.education && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{parsedData.education}</p>
              </CardContent>
            </Card>
          )}

          {parsedData?.projects && parsedData.projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Projects ({parsedData.projects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parsedData.projects.map((p: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-sm font-medium">{p.title}</p>
                      {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(Array.isArray(p.technologies) ? p.technologies : []).map((t: string, j: number) => (
                            <Badge key={j} variant="outline" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {parsedData?.internships && parsedData.internships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Internships ({parsedData.internships.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parsedData.internships.map((intern: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-sm font-medium">{intern.position} @ {intern.company}</p>
                      {intern.description && <p className="text-xs text-muted-foreground mt-1">{intern.description}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {resumes.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upload History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resumes.map(r => (
                <div key={r.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{r.fileName}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant={r.isActive ? 'success' : 'secondary'}>
                    {r.isActive ? 'Active' : 'Archived'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
