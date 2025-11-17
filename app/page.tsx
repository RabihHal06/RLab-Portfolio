import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, FileText, Award, Bot, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getSettings(): Promise<SiteSettings | null> {
  const { data } = await supabase.from('site_settings').select('*').maybeSingle();
  return data;
}

export default async function HomePage() {
  const settings = await getSettings();

  const features = [
    {
      title: 'Interactive Resume',
      description: 'Explore my professional experience, education, skills, and achievements',
      icon: FileText,
      href: '/resume',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Business Portfolio',
      description: 'Discover Rabela Pastry, TrackLane, KlickT and other ventures',
      icon: Building2,
      href: '/businesses',
      gradient: 'from-primary to-yellow-500',
    },
    {
      title: 'AI Automations',
      description: 'See how I leverage Make.com and AI to solve business challenges',
      icon: Bot,
      href: '/ai-automations',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Freelance Projects',
      description: 'View my data analytics and AI agency work portfolio',
      icon: Briefcase,
      href: '/freelance-projects',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Certificates',
      description: 'Professional certifications and credentials',
      icon: Award,
      href: '/certificates',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-rlab-snow via-white to-rlab-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(203,178,106,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(22,48,85,0.05),transparent_50%)]"></div>

        <div className="relative container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left space-y-8">
                <div className="inline-block">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto md:mx-0">
                    {settings?.logo_path ? (
                      <Image
                        src={getStorageUrl('images', settings.logo_path)}
                        alt="R-Lab Logo"
                        fill
                        className="object-contain drop-shadow-lg"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-rlab-navy-deep rounded-2xl shadow-xl">
                        <span className="text-white font-bold text-6xl">R</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rlab-navy-deep tracking-tight leading-tight">
                    {settings?.hero_title || 'R-Lab — Digital Portfolio'}
                  </h1>
                  <p className="text-lg md:text-xl text-rlab-text-dark/80 leading-relaxed">
                    {settings?.hero_subtitle || 'Building Real-World Systems in Data Analytics and AI Automation'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/resume">
                    <Button size="lg" className="bg-rlab-navy-deep text-white hover:bg-rlab-navy-royal hover:shadow-lg transition-all group">
                      View Resume
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-2 border-rlab-navy-deep text-rlab-navy-deep hover:bg-rlab-navy-deep hover:text-white transition-all">
                      Contact Me
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rlab-gold-soft/20 to-rlab-navy-royal/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-rlab-grey-light/30">
                    <div className="space-y-6">
                      {features.slice(0, 3).map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <Link key={feature.href} href={feature.href} className="flex items-center gap-4 group cursor-pointer">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-rlab-navy-deep group-hover:text-rlab-navy-royal transition-colors">
                                {feature.title}
                              </h3>
                              <p className="text-sm text-rlab-text-dark/60 line-clamp-1">
                                {feature.description}
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-rlab-text-dark/40 group-hover:text-rlab-navy-royal group-hover:translate-x-1 transition-all" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-rlab-snow to-transparent"></div>
      </section>

      <section className="bg-rlab-snow py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rlab-navy-deep mb-4">
              Explore My Work
            </h2>
            <p className="text-rlab-text-dark/70 max-w-2xl mx-auto">
              Discover my professional journey through various domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="bg-white rounded-2xl shadow-md border border-rlab-grey-light/50 h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl text-rlab-navy-deep group-hover:text-rlab-navy-royal transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-rlab-text-dark/70 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {settings?.about_me && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-rlab-navy-deep mb-4">
                  About Rabih El Halabi
                </h2>
                <div className="h-1 w-20 bg-rlab-gold-soft mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-gradient-to-br from-rlab-snow to-white rounded-3xl shadow-lg p-8 md:p-10 border border-rlab-grey-light/30">
                    <div className="prose prose-lg max-w-none">
                      <div className="text-rlab-text-dark leading-relaxed space-y-6">
                        {settings.about_me.split(/\.\s+/).filter(sentence => sentence.trim()).map((sentence, index, array) => {
                          const sentencesPerParagraph = Math.ceil(array.length / 3);
                          const paragraphIndex = Math.floor(index / sentencesPerParagraph);

                          if (index % sentencesPerParagraph === 0) {
                            const paragraphSentences = array.slice(index, index + sentencesPerParagraph);
                            return (
                              <p key={index} className="text-base md:text-lg text-justify">
                                {paragraphSentences.join('. ') + '.'}
                              </p>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-rlab-navy-deep to-rlab-navy-royal text-white rounded-2xl shadow-lg border-0 overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white text-xl">Key Focus Areas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rlab-gold-soft"></div>
                        <span className="text-sm">Data Analytics</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rlab-gold-soft"></div>
                        <span className="text-sm">AI Automation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rlab-gold-soft"></div>
                        <span className="text-sm">Business Systems</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rlab-gold-soft"></div>
                        <span className="text-sm">Entrepreneurship</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-2xl shadow-lg border border-rlab-grey-light/30">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-rlab-navy-deep text-xl">Current Ventures</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-rlab-navy-deep mb-1">Rabela Pastry</h4>
                        <p className="text-sm text-rlab-text-dark/70">Boutique bakery brand</p>
                      </div>
                      <div className="h-px bg-rlab-grey-light"></div>
                      <div>
                        <h4 className="font-semibold text-rlab-navy-deep mb-1">TrackLane</h4>
                        <p className="text-sm text-rlab-text-dark/70">Digital operations system</p>
                      </div>
                      <div className="h-px bg-rlab-grey-light"></div>
                      <div>
                        <h4 className="font-semibold text-rlab-navy-deep mb-1">SABIS</h4>
                        <p className="text-sm text-rlab-text-dark/70">Software support role</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(settings?.mission || settings?.vision) && (
        <section className="bg-rlab-snow py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {settings.mission && (
                <Card className="bg-white rounded-3xl shadow-lg border border-rlab-grey-light/30 overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="h-2 bg-gradient-to-r from-rlab-navy-royal to-rlab-navy-deep"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-2xl text-rlab-navy-deep">
                      <span className="w-12 h-12 rounded-xl bg-rlab-navy-royal flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-white text-2xl">🎯</span>
                      </span>
                      Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-rlab-text-dark leading-relaxed space-y-4">
                      {settings.mission.split('\n\n').map((paragraph, index) => (
                        <p key={index}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {settings.vision && (
                <Card className="bg-white rounded-3xl shadow-lg border border-rlab-grey-light/30 overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="h-2 bg-gradient-to-r from-rlab-gold-soft to-yellow-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-2xl text-rlab-navy-deep">
                      <span className="w-12 h-12 rounded-xl bg-rlab-gold-soft flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform">
                        <span className="text-white text-2xl">🚀</span>
                      </span>
                      Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-rlab-text-dark leading-relaxed space-y-4">
                      {settings.vision.split('\n\n').map((paragraph, index) => (
                        <p key={index}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
