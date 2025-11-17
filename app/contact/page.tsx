import { Mail, MapPin, Linkedin, Github, Twitter, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactForm } from '@/components/contact-form';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';

export const dynamic = 'force-dynamic';

async function getSettings(): Promise<SiteSettings | null> {
  const { data } = await supabase.from('site_settings').select('*').maybeSingle();
  return data;
}

export default async function ContactPage() {
  const settings = await getSettings();

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: settings?.linkedin_url,
      color: 'hover:text-blue-500',
    },
    {
      icon: Github,
      label: 'GitHub',
      url: settings?.github_url,
      color: 'hover:text-gray-400',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      url: settings?.twitter_url,
      color: 'hover:text-sky-500',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      url: settings?.instagram_url,
      color: 'hover:text-pink-500',
    },
  ].filter((link) => link.url);

  return (
    <div className="bg-rlab-snow">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-rlab-navy-deep tracking-tight">Get in Touch</h1>
            <p className="text-xl text-rlab-text-dark max-w-2xl mx-auto">
              Interested in collaboration, freelance projects, or AI automation solutions? Let&apos;s connect!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50">
              <CardHeader>
                <CardTitle className="flex items-center text-rlab-navy-deep">
                  <Mail className="mr-3 w-5 h-5 text-rlab-gold-soft" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                {settings?.primary_email ? (
                  <a
                    href={`mailto:${settings.primary_email}`}
                    className="text-rlab-text-dark hover:text-rlab-gold-soft transition-colors"
                  >
                    {settings.primary_email}
                  </a>
                ) : (
                  <p className="text-rlab-text-dark/70">Email coming soon</p>
                )}
              </CardContent>
            </Card>

            {settings?.location && (
              <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-rlab-navy-deep">
                    <MapPin className="mr-3 w-5 h-5 text-rlab-gold-soft" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-rlab-text-dark">{settings.location}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {socialLinks.length > 0 && (
            <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50">
              <CardHeader>
                <CardTitle className="text-center text-rlab-navy-deep">Connect on Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-6">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-rlab-navy-royal ${link.color} transition-colors`}
                        aria-label={link.label}
                      >
                        <Icon className="w-8 h-8" />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50 mt-8">
            <CardHeader>
              <CardTitle className="text-rlab-navy-deep">Available For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-rlab-gold-soft mr-3 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-rlab-navy-deep">Freelance Data Analytics Projects</h3>
                  <p className="text-sm text-rlab-text-dark">
                    Business intelligence, data visualization, and analytics consulting
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-rlab-gold-soft mr-3 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-rlab-navy-deep">AI Automation Solutions</h3>
                  <p className="text-sm text-rlab-text-dark">
                    Process automation, AI integration, and workflow optimization
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-rlab-gold-soft mr-3 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-rlab-navy-deep">Business Collaborations</h3>
                  <p className="text-sm text-rlab-text-dark">
                    Strategic partnerships and joint ventures in digital innovation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
