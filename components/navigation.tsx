'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Building2, FileText, Award, Bot, Briefcase, Mail, Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

const navItems = [
  { href: '/', label: 'Home', icon: null },
  { href: '/resume', label: 'Resume', icon: FileText },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/certificates', label: 'Certificates', icon: Award },
  { href: '/ai-automations', label: 'AI Automations', icon: Bot },
  { href: '/freelance-projects', label: 'Projects', icon: Briefcase },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/admin/login', label: 'Admin', icon: Shield },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Partial<SiteSettings> | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('small_logo_path')
        .maybeSingle();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-rlab-grey-light rlab-shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* LOGO FIXED (bigger, nicer, clean) */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="
              w-14 h-14 
              rounded-2xl 
              bg-white 
              flex items-center justify-center 
              shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
              overflow-hidden
              transition-all
              group-hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
            ">
              {settings?.small_logo_path ? (
                <Image
                  src={getStorageUrl('images', settings.small_logo_path)}
                  alt="R-Lab Logo"
                  width={60}
                  height={60}
                  className="object-contain p-1"
                  priority
                />
              ) : (
                <span className="text-rlab-navy-deep font-bold text-3xl">R</span>
              )}
            </div>

            <span className="text-2xl font-bold tracking-tight text-rlab-navy-deep">
              R-Lab
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, -2).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                      isActive
                        ? 'text-rlab-navy-deep font-semibold'
                        : 'text-rlab-navy-royal hover:text-rlab-gold-soft'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rlab-gold-soft"></span>
                    )}
                  </button>
                </Link>
              );
            })}

            {/* CONTACT BUTTON */}
            <Link href="/contact">
              <button className="
                ml-2 px-5 py-2 
                bg-rlab-navy-deep 
                text-white font-medium text-sm rounded-full 
                hover:bg-rlab-navy-royal 
                hover:ring-2 hover:ring-rlab-gold-soft hover:ring-offset-2 
                transition-all">
                Contact
              </button>
            </Link>

            {/* ADMIN ICON */}
            <Link href="/admin/login">
              <button className="ml-1 px-4 py-2 text-rlab-navy-royal hover:text-rlab-gold-soft transition-colors">
                <Shield className="w-5 h-5" />
              </button>
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-rlab-navy-deep hover:text-rlab-gold-soft"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* MOBILE MENU EXPANDED */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-rlab-grey-light">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <button
                    className={`w-full flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-rlab-navy-deep text-white'
                        : 'text-rlab-navy-royal hover:bg-rlab-snow'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-3" />}
                    {item.label}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
