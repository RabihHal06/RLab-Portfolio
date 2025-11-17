import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { ResumeItem, ResumePDFFile } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getResumeData() {
  const [itemsRes, pdfRes] = await Promise.all([
    supabase.from('resume_items').select('*').order('order_index'),
    supabase.from('resume_pdf_files').select('*').eq('is_active', true).maybeSingle(),
  ]);

  return {
    items: (itemsRes.data as ResumeItem[]) || [],
    activePDF: pdfRes.data as ResumePDFFile | null,
  };
}

export default async function ResumePage() {
  const { items, activePDF } = await getResumeData();

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ResumeItem[]>);

  const downloadUrl = activePDF ? getStorageUrl('resume', activePDF.file_path) : null;

  return (
    <div className="bg-rlab-navy-deep">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Resume</h1>
            <p className="text-xl text-white/80 mb-6">
              Professional experience, education, and achievements
            </p>
            {downloadUrl && (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 bg-rlab-gold-soft text-white font-medium rounded-full hover:bg-rlab-gold-deep hover:shadow-[0_0_0_2px_rgba(203,178,106,0.5)] transition-all inline-flex items-center">
                  <Download className="mr-2 w-5 h-5" />
                  {activePDF?.display_name || 'Download Full Resume (PDF)'}
                </button>
              </a>
            )}
          </div>

        {groupedItems.experience && groupedItems.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Experience</h2>
            <div className="space-y-6">
              {groupedItems.experience.map((item) => (
                <Card key={item.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{item.title}</CardTitle>
                        {item.subtitle && (
                          <p className="text-white/70 mt-1">{item.subtitle}</p>
                        )}
                      </div>
                      {item.is_current && (
                        <Badge className="bg-rlab-gold-soft/20 text-rlab-gold-soft border border-rlab-gold-soft/30">Current</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-white/60 mt-2">
                      {item.location && <span>{item.location}</span>}
                      {item.start_date && (
                        <span className="text-rlab-gold-soft font-medium">
                          {new Date(item.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {item.is_current
                            ? 'Present'
                            : item.end_date
                            ? new Date(item.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Present'}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  {item.description && (
                    <CardContent>
                      <p className="whitespace-pre-wrap text-white/70">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {groupedItems.education && groupedItems.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Education</h2>
            <div className="space-y-6">
              {groupedItems.education.map((item) => (
                <Card key={item.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">{item.title}</CardTitle>
                    {item.subtitle && (
                      <p className="text-white/70 mt-1">{item.subtitle}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-white/60 mt-2">
                      {item.location && <span>{item.location}</span>}
                      {item.start_date && (
                        <span className="text-rlab-gold-soft font-medium">
                          {new Date(item.start_date).getFullYear()}
                          {item.end_date && ` - ${new Date(item.end_date).getFullYear()}`}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  {item.description && (
                    <CardContent>
                      <p className="whitespace-pre-wrap text-white/70">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {groupedItems.skills && groupedItems.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Skills</h2>
            <Card className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {groupedItems.skills.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-rlab-gold-soft hover:bg-white/15 transition-colors cursor-default"
                    >
                      <div className="font-semibold text-white">{item.title}</div>
                      {item.description && (
                        <div className="text-xs mt-1 text-white/60">{item.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {groupedItems.awards && groupedItems.awards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">Awards & Recognition</h2>
            <div className="space-y-4">
              {groupedItems.awards.map((item) => (
                <Card key={item.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                    {item.subtitle && (
                      <p className="text-sm text-white/70">{item.subtitle}</p>
                    )}
                    {item.start_date && (
                      <p className="text-sm text-rlab-gold-soft font-medium">
                        {new Date(item.start_date).getFullYear()}
                      </p>
                    )}
                  </CardHeader>
                  {item.description && (
                    <CardContent>
                      <p className="text-sm text-white/70">{item.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
