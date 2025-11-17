'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { AIAutomation, ComplexityLevel } from '@/lib/types/database';
import { Pencil, Trash2, Plus, Upload, Image as ImageIcon, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';

interface AutomationFormData {
  title: string;
  platform: string;
  short_description: string;
  detailed_description: string;
  business_context: string;
  tags: string;
  tools_used: string;
  complexity_level: ComplexityLevel;
  time_saved: string;
  roi_description: string;
  status: 'active' | 'archived';
  featured: boolean;
  order_index: number;
}

const initialFormData: AutomationFormData = {
  title: '',
  platform: 'Make.com',
  short_description: '',
  detailed_description: '',
  business_context: '',
  tags: '',
  tools_used: '',
  complexity_level: 'medium',
  time_saved: '',
  roi_description: '',
  status: 'active',
  featured: false,
  order_index: 0,
};

export default function AdminAutomationsPage() {
  const [automations, setAutomations] = useState<AIAutomation[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AutomationFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existingScreenshot, setExistingScreenshot] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    const { data } = await supabase
      .from('ai_automations')
      .select('*')
      .order('order_index', { ascending: true });
    if (data) setAutomations(data as AIAutomation[]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'File size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const uploadScreenshot = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('ai-automations')
      .upload(fileName, file);

    if (error) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let screenshotPath = existingScreenshot;

    if (uploadedFile) {
      const uploadedPath = await uploadScreenshot(uploadedFile);
      if (!uploadedPath) {
        setSubmitting(false);
        return;
      }
      screenshotPath = uploadedPath;

      if (existingScreenshot) {
        await supabase.storage.from('ai-automations').remove([existingScreenshot]);
      }
    }

    const automationData = {
      title: formData.title,
      platform: formData.platform,
      short_description: formData.short_description,
      detailed_description: formData.detailed_description,
      business_context: formData.business_context,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      tools_used: formData.tools_used ? formData.tools_used.split(',').map(t => t.trim()) : [],
      complexity_level: formData.complexity_level,
      time_saved: formData.time_saved,
      roi_description: formData.roi_description,
      screenshot_path: screenshotPath,
      status: formData.status,
      featured: formData.featured,
      order_index: formData.order_index,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('ai_automations')
        .update(automationData)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('ai_automations')
        .insert({ ...automationData, created_at: new Date().toISOString() }));
    }

    setSubmitting(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: `Automation ${editingId ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData(initialFormData);
      setEditingId(null);
      setUploadedFile(null);
      setExistingScreenshot('');
      fetchAutomations();
    }
  };

  const handleEdit = (automation: AIAutomation) => {
    setFormData({
      title: automation.title,
      platform: automation.platform,
      short_description: automation.short_description,
      detailed_description: automation.detailed_description,
      business_context: automation.business_context,
      tags: automation.tags.join(', '),
      tools_used: automation.tools_used.join(', '),
      complexity_level: automation.complexity_level,
      time_saved: automation.time_saved,
      roi_description: automation.roi_description,
      status: automation.status,
      featured: automation.featured,
      order_index: automation.order_index,
    });
    setExistingScreenshot(automation.screenshot_path);
    setEditingId(automation.id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const automation = automations.find(a => a.id === deleteId);
    if (automation?.screenshot_path) {
      await supabase.storage.from('ai-automations').remove([automation.screenshot_path]);
    }

    const { error } = await supabase
      .from('ai_automations')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Automation deleted successfully',
      });
      fetchAutomations();
    }

    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Automations Management</h1>
          <p className="text-muted-foreground">
            Manage your AI automation scenarios and workflows
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData(initialFormData);
              setEditingId(null);
              setUploadedFile(null);
              setExistingScreenshot('');
            }}>
              <Plus className="mr-2 w-4 h-4" />
              Add Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Add'} Automation</DialogTitle>
              <DialogDescription>
                Create professional AI automation portfolio entries
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Automated Lead Qualification System"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g., Make.com, Zapier"
                  />
                </div>
                <div>
                  <Label htmlFor="complexity_level">Complexity</Label>
                  <Select
                    value={formData.complexity_level}
                    onValueChange={(value: ComplexityLevel) =>
                      setFormData({ ...formData, complexity_level: value })
                    }
                  >
                    <SelectTrigger id="complexity_level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="short_description">Short Description *</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  required
                  rows={2}
                  placeholder="Brief one-liner about the automation"
                />
              </div>
              <div>
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  rows={4}
                  placeholder="Full workflow description, steps, and logic"
                />
              </div>
              <div>
                <Label htmlFor="business_context">Business Context</Label>
                <Textarea
                  id="business_context"
                  value={formData.business_context}
                  onChange={(e) => setFormData({ ...formData, business_context: e.target.value })}
                  rows={3}
                  placeholder="Why this automation was needed and what problem it solves"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time_saved">Time Saved</Label>
                  <Input
                    id="time_saved"
                    value={formData.time_saved}
                    onChange={(e) => setFormData({ ...formData, time_saved: e.target.value })}
                    placeholder="e.g., 10 hours/week"
                  />
                </div>
                <div>
                  <Label htmlFor="roi_description">ROI Description</Label>
                  <Input
                    id="roi_description"
                    value={formData.roi_description}
                    onChange={(e) => setFormData({ ...formData, roi_description: e.target.value })}
                    placeholder="e.g., 300% efficiency gain"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tools_used">Tools Used (comma-separated)</Label>
                <Input
                  id="tools_used"
                  value={formData.tools_used}
                  onChange={(e) => setFormData({ ...formData, tools_used: e.target.value })}
                  placeholder="e.g., Make.com, OpenAI, Airtable, Gmail"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., Lead Generation, Email Automation, CRM"
                />
              </div>
              <div>
                <Label htmlFor="screenshot">Screenshot (Max 5MB)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {existingScreenshot && !uploadedFile && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      Has screenshot
                    </Badge>
                  )}
                  {uploadedFile && (
                    <Badge className="flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Ready to upload
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'archived') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order_index">Display Order</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) =>
                      setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {automations.map((automation) => (
          <Card key={automation.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{automation.title}</CardTitle>
                    {automation.featured && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline">{automation.complexity_level}</Badge>
                    <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                      {automation.status}
                    </Badge>
                  </div>
                  <CardDescription>{automation.short_description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(automation)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setDeleteId(automation.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{automation.platform}</Badge>
                  {automation.tools_used.map((tool, idx) => (
                    <Badge key={idx} variant="outline">{tool}</Badge>
                  ))}
                </div>
                {automation.time_saved && (
                  <div className="text-sm">
                    <span className="font-semibold">Time Saved:</span> {automation.time_saved}
                  </div>
                )}
                {automation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {automation.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {automations.length === 0 && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No automations yet. Click "Add Automation" to create your first entry.
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this automation and its screenshot. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
