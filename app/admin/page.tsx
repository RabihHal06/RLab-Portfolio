'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Award, Bot, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    businesses: 0,
    certificates: 0,
    automations: 0,
    projects: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [businessesRes, certsRes, automationsRes, projectsRes] = await Promise.all([
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('ai_automations').select('id', { count: 'exact', head: true }),
        supabase.from('freelance_projects').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        businesses: businessesRes.count || 0,
        certificates: certsRes.count || 0,
        automations: automationsRes.count || 0,
        projects: projectsRes.count || 0,
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Businesses',
      value: stats.businesses,
      icon: Building2,
      gradient: 'from-primary to-yellow-500',
    },
    {
      title: 'Certificates',
      value: stats.certificates,
      icon: Award,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'AI Automations',
      value: stats.automations,
      icon: Bot,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: Briefcase,
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your R-Lab portfolio management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-card mt-8">
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">1. Configure Site Settings</h3>
              <p className="text-sm text-muted-foreground">
                Update your hero title, about me section, and contact information
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">2. Add Resume Items</h3>
              <p className="text-sm text-muted-foreground">
                Add your experience, education, skills, and awards
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">3. Showcase Your Businesses</h3>
              <p className="text-sm text-muted-foreground">
                Add your businesses with descriptions and screenshots
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-3 mt-2 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">4. Upload Certificates</h3>
              <p className="text-sm text-muted-foreground">
                Display your professional certifications and credentials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
