import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { FreelanceProject, FreelanceAsset } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getProjectById(id: string) {
  const [projectRes, assetsRes] = await Promise.all([
    supabase.from('freelance_projects').select('*').eq('id', id).maybeSingle(),
    supabase.from('freelance_assets').select('*').eq('project_id', id).order('order_index'),
  ]);

  return {
    project: projectRes.data as FreelanceProject | null,
    assets: (assetsRes.data as FreelanceAsset[]) || [],
  };
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, assets } = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    planned: 'bg-blue-500',
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/freelance-projects">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.project_title}</h1>
              <p className="text-xl text-muted-foreground">{project.client_name}</p>
            </div>
            <Badge className={statusColors[project.status] || 'bg-secondary'}>
              {project.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            {project.project_type && (
              <div>
                <span className="font-semibold">Type:</span> {project.project_type}
              </div>
            )}
            {project.industry && (
              <div>
                <span className="font-semibold">Industry:</span> {project.industry}
              </div>
            )}
            {project.start_date && (
              <div>
                <span className="font-semibold">Started:</span>{' '}
                {new Date(project.start_date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}
            {project.end_date && (
              <div>
                <span className="font-semibold">Completed:</span>{' '}
                {new Date(project.end_date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {project.detailed_description || project.short_description}
            </p>
          </CardContent>
        </Card>

        {assets.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Project Assets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assets.map((asset) => (
                <Card key={asset.id} className="glass-card overflow-hidden">
                  <div className="aspect-video relative bg-secondary">
                    <img
                      src={getStorageUrl('freelance-assets', asset.file_path)}
                      alt={asset.title || 'Project asset'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    {asset.title && <h3 className="font-semibold mb-2">{asset.title}</h3>}
                    {asset.description && (
                      <p className="text-sm text-muted-foreground">{asset.description}</p>
                    )}
                    {asset.asset_type && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {asset.asset_type}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
