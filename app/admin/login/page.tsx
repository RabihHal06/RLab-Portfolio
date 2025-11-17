'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('small_logo_path').maybeSingle();
      if (data) setSettings(data as SiteSettings);
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-rlab-snow flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-rlab-navy-deep hover:text-rlab-gold-soft transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-0 w-full">
        <CardHeader className="text-center">
        <div className="
  mx-auto mb-6 
  w-24 h-24 
  flex items-center justify-center 
  overflow-hidden 
  rounded-2xl 
  bg-white 
  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
">
  {settings?.small_logo_path ? (
    <Image
      src={getStorageUrl('images', settings.small_logo_path)}
      alt="R-Lab Logo"
      width={100}
      height={100}
      className="object-contain p-2"
      priority
    />
  ) : (
    <span className="text-rlab-navy-deep font-bold text-4xl">R</span>
  )}
</div>

          <CardTitle className="text-2xl text-rlab-navy-deep">Admin Login</CardTitle>
          <CardDescription className="text-rlab-text-dark">Sign in to manage your R-Lab portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-rlab-navy-deep">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rlab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-rlab-navy-deep">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-rlab-navy-deep text-white font-medium rounded-full hover:bg-rlab-navy-royal hover:shadow-[0_0_0_2px_rgba(203,178,106,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
