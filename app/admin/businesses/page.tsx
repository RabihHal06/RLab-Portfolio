'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Business, BusinessStatus } from '@/lib/types/database';
import { Pencil, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface BusinessFormData {
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  website_url: string;
  status: BusinessStatus;
  main_modules: string;
  order_index: number;
}

const initialFormData: BusinessFormData = {
  name: '',
  slug: '',
  short_description: '',
  long_description: '',
  website_url: '',
  status: 'planned',
  main_modules: '',
  order_index: 0,
};

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('order_index');
    if (data) setBusinesses(data as Business[]);
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingId ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const businessData = {
      name: formData.name,
      slug: formData.slug,
      short_description: formData.short_description,
      long_description: formData.long_description,
      website_url: formData.website_url,
      status: formData.status,
      main_modules: formData.main_modules.split(',').map((m) => m.trim()).filter(Boolean),
      order_index: formData.order_index,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('businesses')
        .insert({ ...businessData, created_at: new Date().toISOString() }));
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
        description: `Business ${editingId ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData(initialFormData);
      setEditingId(null);
      fetchBusinesses();
    }
  };

  const handleEdit = (business: Business) => {
    setFormData({
      name: business.name,
      slug: business.slug,
      short_description: business.short_description,
      long_description: business.long_description,
      website_url: business.website_url,
      status: business.status,
      main_modules: business.main_modules.join(', '),
      order_index: business.order_index,
    });
    setEditingId(business.id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from('businesses').delete().eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Business deleted successfully',
      });
      fetchBusinesses();
    }
    setDeleteId(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const statusColors: Record<BusinessStatus, string> = {
    live: 'bg-green-500',
    'in-progress': 'bg-yellow-500',
    planned: 'bg-blue-500',
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Management</h1>
          <p className="text-muted-foreground">
            Manage your business portfolio and information
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="mr-2 w-4 h-4" />
              Add Business
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Business' : 'Add New Business'}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Update your business information'
                  : 'Add a new business to your portfolio'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: BusinessStatus) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="main_modules">Main Modules (comma-separated)</Label>
                <Input
                  id="main_modules"
                  value={formData.main_modules}
                  onChange={(e) => setFormData({ ...formData, main_modules: e.target.value })}
                  placeholder="Module 1, Module 2, Module 3"
                />
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
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
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
        {businesses.map((business) => (
          <Card key={business.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{business.name}</CardTitle>
                    <Badge className={statusColors[business.status]}>{business.status}</Badge>
                  </div>
                  <CardDescription>{business.short_description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(business)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(business.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Slug:</strong> {business.slug}
                </p>
                {business.website_url && (
                  <p>
                    <strong>Website:</strong>{' '}
                    <a
                      href={business.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {business.website_url}
                    </a>
                  </p>
                )}
                {business.main_modules.length > 0 && (
                  <p>
                    <strong>Modules:</strong> {business.main_modules.join(', ')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {businesses.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No businesses yet. Click &quot;Add Business&quot; to get started.
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business and all
              associated data.
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
