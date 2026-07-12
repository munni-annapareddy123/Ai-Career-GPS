import React, { useEffect, useRef, useState } from 'react';
import { Microscope, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getSkillGaps } from '../services/skillGap';
import { getRecommendations } from '../services/recommendation';
import { getProfile } from '../services/user';
import * as d3 from 'd3';

export default function KnowledgeGraphPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, skillGaps, recommendations] = await Promise.all([
          getProfile().catch(() => null),
          getSkillGaps().catch(() => []),
          getRecommendations().catch(() => []),
        ]);

        if (!svgRef.current) return;

        const skills = profile?.skills?.map(s => ({ id: s.id, name: s.name, type: 'skill', level: s.level })) || [];
        const gaps = skillGaps.map(g => ({ id: g.id, name: g.skillName, type: 'gap', priority: g.priority }));
        const careers = recommendations.map(r => ({ id: r.id, name: r.careerTitle, type: 'career', match: r.matchPercentage }));

        const nodes: any[] = [
          ...skills.map(s => ({ ...s, group: 'skills' })),
          ...gaps.map(g => ({ ...g, group: 'gaps' })),
          ...careers.map(c => ({ ...c, group: 'careers' })),
        ];

        if (profile?.education) {
          nodes.unshift({ id: 'education', name: profile.education.substring(0, 30), type: 'education', group: 'profile' });
        }
        if (profile?.careerGoals) {
          nodes.unshift({ id: 'goal', name: profile.careerGoals.substring(0, 30), type: 'goal', group: 'profile' });
        }

        const links: any[] = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            links.push({ source: nodes[i].id, target: nodes[j].id, value: 1 });
          }
        }

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = svgRef.current.clientWidth;
        const height = 600;

        const simulation = d3.forceSimulation(nodes)
          .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collision', d3.forceCollide().radius(40));

        const link = svg.append('g')
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('stroke', 'hsl(var(--border))')
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.3);

        const node = svg.append('g')
          .selectAll('g')
          .data(nodes)
          .join('g')
          .style('cursor', 'pointer')
          .on('click', (_event: any, d: any) => setSelected(d));

        const colors: Record<string, string> = {
          skill: '#6366f1',
          gap: '#ef4444',
          career: '#22c55e',
          education: '#f59e0b',
          goal: '#8b5cf6',
        };

        node.append('circle')
          .attr('r', 8)
          .attr('fill', (d: any) => colors[d.type] || '#6366f1')
          .attr('opacity', 0.8);

        node.append('text')
          .text((d: any) => d.name)
          .attr('x', 12)
          .attr('y', 4)
          .attr('font-size', 10)
          .attr('fill', 'hsl(var(--foreground))')
          .attr('opacity', 0.8);

        simulation.on('tick', () => {
          link
            .attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any) => d.target.x)
            .attr('y2', (d: any) => d.target.y);

          node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        const zoom = d3.zoom()
          .scaleExtent([0.3, 3])
          .on('zoom', (event) => {
            svg.selectAll('g').attr('transform', event.transform);
          });

        svg.call(zoom as any);
      } catch (error) {
        console.error('Knowledge graph error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Knowledge Graph</h1>
        <p className="text-muted-foreground text-sm mt-1">Interactive visualization of your career ecosystem</p>
      </div>

      <Card className="relative">
        <CardContent className="p-0">
          <svg ref={svgRef} className="w-full" style={{ height: '600px' }} />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                selected.type === 'skill' ? 'bg-primary' :
                selected.type === 'gap' ? 'bg-red-400' :
                selected.type === 'career' ? 'bg-green-400' :
                selected.type === 'education' ? 'bg-yellow-400' : 'bg-purple-400'
              }`} />
              <div>
                <p className="font-medium text-sm">{selected.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">{selected.type}</Badge>
                  {selected.level && <Badge variant="secondary" className="text-[10px]">{selected.level}</Badge>}
                  {selected.match && <span className="text-xs text-muted-foreground">Match: {selected.match}%</span>}
                </div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="p-1 hover:bg-secondary rounded">
              <X className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Skills</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Skill Gaps</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400" /> Careers</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Education</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400" /> Goals</div>
      </div>
    </div>
  );
}
