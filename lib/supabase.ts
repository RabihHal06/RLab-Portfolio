import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function getStorageUrl(bucket: string, path: string): string {
  if (!path) return '';
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ path: string | null; error: Error | null }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    return { path: null, error };
  }

  return { path: data.path, error: null };
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error };
}
