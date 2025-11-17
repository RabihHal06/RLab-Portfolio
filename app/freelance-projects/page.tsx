import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import type { FreelanceProject } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getProjects(): Promise<FreelanceProject[]> {
  const { data } = await supabase
    .from('freelance_projects')
    .select('*')
    .order('start_date', { ascending: false });
  return (data as FreelanceProject[]) || [];
}

export default async function FreelanceProjectsPage() {
  const projects = await getProjects();

  const grouped = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<string, FreelanceProject[]>);

  const statusConfig = {
    completed: { label: 'Completed', color: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'in-progress': { label: 'In Progress', color: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
    planned: { label: 'Planned', color: 'bg-slate-500', badgeClass: 'bg-slate-50 text-slate-700 border-slate-200' },
  };

  const statusOrder: Array<keyof typeof statusConfig> = ['in-progress', 'completed', 'planned'];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-rlab-navy-deep tracking-tight">Freelance Projects</h1>
          <p className="text-xl text-rlab-text-dark max-w-2xl mx-auto">
            Data analytics, AI agency work, and business intelligence solutions for clients worldwide
          </p>
        </div>

      {statusOrder.map((status) => {
        const projectsInStatus = grouped[status];
        if (!projectsInStatus || projectsInStatus.length === 0) return null;

        const config = statusConfig[status];

        return (
          <section key={status} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-rlab-navy-deep">
              <span className={`w-3 h-3 rounded-full ${config.color} mr-3`} />
              {config.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsInStatus.map((project) => (
                <Card key={project.id} className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50 flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg text-rlab-navy-deep">{project.project_title}</CardTitle>
                      <Badge className={`${config.badgeClass} border font-medium text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="font-semibold text-rlab-navy-royal">{project.client_name}</div>
                      {project.project_type && (
                        <div className="text-xs text-rlab-text-dark/70">{project.project_type}</div>
                      )}
                      {project.industry && (
                        <Badge className="bg-rlab-gold-soft/20 text-rlab-gold-deep border border-rlab-gold-soft/30 text-xs">
                          {project.industry}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-rlab-text-dark mb-4 flex-1">
                      {project.short_description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} className="bg-rlab-snow text-rlab-text-dark border border-rlab-grey-light text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge className="bg-rlab-snow text-rlab-text-dark border border-rlab-grey-light text-xs">
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Link href={`/freelance-projects/${project.id}`}>
                      <button className="w-full px-4 py-2 bg-rlab-navy-deep text-white font-medium rounded-lg hover:bg-rlab-navy-royal transition-all">
                        View Details
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-rlab-text-dark/70">No projects available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
