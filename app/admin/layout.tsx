'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Settings,
  FileText,
  Building2,
  Award,
  Bot,
  Briefcase,
  LogOut,
  LayoutDashboard,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, admin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  useEffect(() => {
    if (!loading && user && !admin) {
      router.push('/');
    }
  }, [user, admin, loading, router]);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('small_logo_path').maybeSingle();
      if (data) setSettings(data as SiteSettings);
    }
    if (user && admin) {
      fetchSettings();
    }
  }, [user, admin]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading || !user || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/messages', label: 'Messages', icon: Mail },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings },
    { href: '/admin/resume', label: 'Resume', icon: FileText },
    { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
    { href: '/admin/certificates', label: 'Certificates', icon: Award },
    { href: '/admin/automations', label: 'AI Automations', icon: Bot },
    { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 glass-card border-r flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-yellow-500 to-primary blur-md opacity-75 animate-pulse rounded-full" />
              <div className="relative w-full h-full rounded-full bg-background flex items-center justify-center border-2 border-primary overflow-hidden">
                {settings?.small_logo_path ? (
                  <Image
                    src={getStorageUrl('images', settings.small_logo_path)}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="text-primary font-bold text-lg">R</span>
                )}
              </div>
            </div>
            <div>
              <div className="font-bold text-gradient">R-Lab Admin</div>
              <div className="text-xs text-muted-foreground">{admin.full_name}</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive ? 'bg-primary text-primary-foreground' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/">
            <Button variant="outline" className="w-full mb-2">
              View Public Site
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster />
    </AuthProvider>
  );
}
