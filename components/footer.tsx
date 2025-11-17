'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

export function Footer() {
  const [settings, setSettings] = useState<Partial<SiteSettings> | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase
        .from('site_settings')
        .select('hero_subtitle, linkedin_url, github_url, twitter_url, instagram_url, primary_email, small_logo_path')
        .maybeSingle();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, []);

  const socialLinks = [
    { icon: Linkedin, url: settings?.linkedin_url, label: 'LinkedIn' },
    { icon: Github, url: settings?.github_url, label: 'GitHub' },
    { icon: Twitter, url: settings?.twitter_url, label: 'Twitter' },
    { icon: Instagram, url: settings?.instagram_url, label: 'Instagram' },
  ].filter((link) => link.url);

  return (
    <footer className="mt-32 bg-white">
      <div className="container mx-auto px-6 py-20 text-center">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center overflow-hidden">
            {settings?.small_logo_path ? (
              <Image
                src={getStorageUrl('images', settings.small_logo_path)}
                alt="R-Lab Logo"
                width={80}
                height={80}
                className="object-contain p-2"
              />
            ) : (
              <span className="text-rlab-navy-deep text-4xl font-bold">R</span>
            )}
          </div>
        </div>

        {/* BRAND NAME */}
        <h2 className="text-2xl font-bold text-rlab-navy-deep tracking-tight mb-2">
          R-Lab
        </h2>

        {/* SUBTITLE */}
        <p className="text-rlab-text-dark/70 max-w-xl mx-auto text-base mb-10 leading-relaxed">
          {settings?.hero_subtitle ||
            'Building Real-World Systems in Data Analytics and AI Automation'}
        </p>

        {/* LINKS (centered like Apple style) */}
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 text-sm mb-10">
          <Link href="/resume" className="text-rlab-text-dark/80 hover:text-rlab-navy-deep transition">
            Resume
          </Link>
          <Link href="/businesses" className="text-rlab-text-dark/80 hover:text-rlab-navy-deep transition">
            Businesses
          </Link>
          <Link href="/certificates" className="text-rlab-text-dark/80 hover:text-rlab-navy-deep transition">
            Certificates
          </Link>
          <Link href="/ai-automations" className="text-rlab-text-dark/80 hover:text-rlab-navy-deep transition">
            AI Automations
          </Link>
        </div>

        {/* EMAIL */}
        {settings?.primary_email && (
          <div className="flex justify-center items-center gap-2 mb-6">
            <Mail className="w-4 h-4 text-rlab-navy-deep" />
            <a
              href={`mailto:${settings.primary_email}`}
              className="text-rlab-text-dark/80 hover:text-rlab-navy-deep transition"
            >
              {settings.primary_email}
            </a>
          </div>
        )}

        {/* SOCIAL ICONS */}
        <div className="flex justify-center space-x-5 mb-12">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rlab-text-dark/60 hover:text-rlab-navy-deep transition"
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* COPYRIGHT */}
        <p className="text-xs text-rlab-text-dark/50">
          © {new Date().getFullYear()} R-Lab. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
