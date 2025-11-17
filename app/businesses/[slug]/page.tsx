import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { Business, BusinessScreenshot } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getBusinessBySlug(slug: string) {
  const [businessRes, screenshotsRes] = await Promise.all([
    supabase.from('businesses').select('*').eq('slug', slug).maybeSingle(),
    supabase
      .from('business_screenshots')
      .select('*')
      .eq('business_id', '')
      .order('order_index'),
  ]);

  const business = businessRes.data as Business | null;
  if (!business) return null;

  const screenshotsFullRes = await supabase
    .from('business_screenshots')
    .select('*')
    .eq('business_id', business.id)
    .order('order_index');

  return {
    business,
    screenshots: (screenshotsFullRes.data as BusinessScreenshot[]) || [],
  };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getBusinessBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const { business, screenshots } = data;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/businesses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Businesses
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{business.name}</h1>
            <Badge className={business.status === 'live' ? 'bg-green-500' : 'bg-yellow-500'}>
              {business.status}
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground mb-6">{business.short_description}</p>
          {business.website_url && (
            <a href={business.website_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ExternalLink className="mr-2 w-5 h-5" />
                Visit Website
              </Button>
            </a>
          )}
        </div>

        {business.long_description && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>About {business.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {business.long_description}
              </p>
            </CardContent>
          </Card>
        )}

        {business.main_modules && business.main_modules.length > 0 && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {business.main_modules.map((module, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{module}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {screenshots.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {screenshots.map((screenshot) => (
                <Card key={screenshot.id} className="glass-card overflow-hidden">
                  <div className="aspect-video relative bg-secondary">
                    <img
                      src={getStorageUrl('business-screenshots', screenshot.image_path)}
                      alt={screenshot.title || business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {(screenshot.title || screenshot.description) && (
                    <CardContent className="pt-4">
                      {screenshot.title && (
                        <h3 className="font-semibold mb-2">{screenshot.title}</h3>
                      )}
                      {screenshot.description && (
                        <p className="text-sm text-muted-foreground">{screenshot.description}</p>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
