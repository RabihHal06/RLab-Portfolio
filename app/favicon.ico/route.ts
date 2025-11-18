import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: settings } = await supabase
      .from('site_settings')
      .select('small_logo_path')
      .single();

    if (settings?.small_logo_path) {
      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(settings.small_logo_path);

      const response = await fetch(publicUrl.publicUrl);
      const blob = await response.blob();

      return new NextResponse(blob, {
        headers: {
          'Content-Type': blob.type || 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new NextResponse(null, { status: 404 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
