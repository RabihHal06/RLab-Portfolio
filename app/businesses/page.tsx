import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getBusinesses(): Promise<Business[]> {
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .order('order_index');
  return (data as Business[]) || [];
}

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  const statusColors: Record<string, string> = {
    live: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    planned: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  return (
    <div className="bg-rlab-navy-deep">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Business Portfolio</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore my entrepreneurial ventures from pastry excellence to digital innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 flex flex-col hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <CardTitle className="text-white">{business.name}</CardTitle>
                  <Badge className={`${statusColors[business.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'} border font-medium`}>
                    {business.status}
                  </Badge>
                </div>
                <CardDescription className="text-white/70">{business.short_description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end space-y-3">
                {business.website_url && (
                  <a href={business.website_url} target="_blank" rel="noopener noreferrer">
                    <button className="w-full px-4 py-2 border-2 border-white/30 text-white bg-transparent font-medium rounded-lg hover:border-rlab-gold-soft hover:text-rlab-gold-soft transition-all inline-flex items-center justify-center">
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Visit Website
                    </button>
                  </a>
                )}
                <Link href={`/businesses/${business.slug}`}>
                  <button className="w-full px-4 py-2 bg-rlab-gold-soft text-white font-medium rounded-lg hover:bg-rlab-gold-deep transition-all">
                    View Details
                  </button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {businesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70">No businesses available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
