'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { SiteSettings } from '@/lib/types/database';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingSmall, setUploadingSmall] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').maybeSingle();
      if (data) setSettings(data as SiteSettings);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ logo_path: filePath, updated_at: new Date().toISOString() })
      .eq('id', settings.id);

    if (updateError) {
      toast({
        title: 'Error',
        description: 'Failed to update logo',
        variant: 'destructive',
      });
    } else {
      setSettings({ ...settings, logo_path: filePath });
      toast({
        title: 'Success',
        description: 'Logo uploaded successfully',
      });
    }

    setUploading(false);
  };

  const handleRemoveLogo = async () => {
    if (!settings?.logo_path) return;

    await supabase.storage.from('images').remove([settings.logo_path]);

    const { error } = await supabase
      .from('site_settings')
      .update({ logo_path: '', updated_at: new Date().toISOString() })
      .eq('id', settings.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove logo',
        variant: 'destructive',
      });
    } else {
      setSettings({ ...settings, logo_path: '' });
      toast({
        title: 'Success',
        description: 'Logo removed successfully',
      });
    }
  };

  const handleSmallLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setUploadingSmall(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `small-logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error',
        description: 'Failed to upload small logo',
        variant: 'destructive',
      });
      setUploadingSmall(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ small_logo_path: filePath, updated_at: new Date().toISOString() })
      .eq('id', settings.id);

    if (updateError) {
      toast({
        title: 'Error',
        description: 'Failed to update small logo',
        variant: 'destructive',
      });
    } else {
      setSettings({ ...settings, small_logo_path: filePath });
      toast({
        title: 'Success',
        description: 'Small logo uploaded successfully',
      });
    }

    setUploadingSmall(false);
  };

  const handleRemoveSmallLogo = async () => {
    if (!settings?.small_logo_path) return;

    await supabase.storage.from('images').remove([settings.small_logo_path]);

    const { error } = await supabase
      .from('site_settings')
      .update({ small_logo_path: '', updated_at: new Date().toISOString() })
      .eq('id', settings.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove small logo',
        variant: 'destructive',
      });
    } else {
      setSettings({ ...settings, small_logo_path: '' });
      toast({
        title: 'Success',
        description: 'Small logo removed successfully',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .update({
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        about_me: settings.about_me,
        mission: settings.mission,
        vision: settings.vision,
        primary_email: settings.primary_email,
        location: settings.location,
        linkedin_url: settings.linkedin_url,
        github_url: settings.github_url,
        twitter_url: settings.twitter_url,
        instagram_url: settings.instagram_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);

    setSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!settings) {
    return <div>No settings found</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
        <p className="text-muted-foreground">
          Configure your portfolio&apos;s main content and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Hero Logo</CardTitle>
            <CardDescription>Upload your hero logo (appears on homepage with glow effect)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo_path ? (
              <div className="space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-yellow-500 to-primary blur-xl opacity-75 animate-pulse rounded-full" />
                  <div className="relative w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-primary">
                    <Image
                      src={getStorageUrl('images', settings.logo_path)}
                      alt="Logo"
                      width={128}
                      height={128}
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLogo}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Logo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your logo (PNG, JPG, SVG recommended)
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Small Logo</CardTitle>
            <CardDescription>Upload a small logo for footer, navigation, and admin areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.small_logo_path ? (
              <div className="space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="relative w-full h-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                    <Image
                      src={getStorageUrl('images', settings.small_logo_path)}
                      alt="Small Logo"
                      width={80}
                      height={80}
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveSmallLogo}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Small Logo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your small logo (PNG, JPG, SVG recommended)
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleSmallLogoUpload}
                    disabled={uploadingSmall}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main landing page content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>About Section</CardTitle>
            <CardDescription>Tell visitors about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about_me">About Me</Label>
              <Textarea
                id="about_me"
                value={settings.about_me}
                onChange={(e) => setSettings({ ...settings, about_me: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="mission">Mission</Label>
              <Textarea
                id="mission"
                value={settings.mission}
                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="vision">Vision</Label>
              <Textarea
                id="vision"
                value={settings.vision}
                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How people can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primary_email">Primary Email</Label>
              <Input
                id="primary_email"
                type="email"
                value={settings.primary_email}
                onChange={(e) => setSettings({ ...settings, primary_email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={settings.linkedin_url}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={settings.github_url}
                onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                value={settings.twitter_url}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
