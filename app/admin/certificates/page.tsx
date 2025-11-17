'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { Certificate, CertificateStatus } from '@/lib/types/database';
import { Pencil, Trash2, Plus, Upload, FileText } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CertificateFormData {
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  credential_id: string;
  credential_url: string;
  category: string;
  status: CertificateStatus;
  order_index: number;
}

const initialFormData: CertificateFormData = {
  title: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_id: '',
  credential_url: '',
  category: '',
  status: 'completed' as CertificateStatus,
  order_index: 0,
};

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CertificateFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existingFilePath, setExistingFilePath] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });
    if (data) setCertificates(data as Certificate[]);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('certificates')
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

    let filePath = existingFilePath;

    if (uploadedFile) {
      const uploadedPath = await uploadFile(uploadedFile);
      if (!uploadedPath) {
        setSubmitting(false);
        return;
      }
      filePath = uploadedPath;

      if (existingFilePath) {
        await supabase.storage.from('certificates').remove([existingFilePath]);
      }
    }

    const certificateData = {
      title: formData.title,
      issuer: formData.issuer,
      issue_date: formData.issue_date,
      expiry_date: formData.expiry_date || null,
      credential_id: formData.credential_id,
      credential_url: formData.credential_url,
      category: formData.category,
      status: formData.status,
      file_path: filePath,
      order_index: formData.order_index,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('certificates')
        .update(certificateData)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase
        .from('certificates')
        .insert({ ...certificateData, created_at: new Date().toISOString() }));
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
        description: `Certificate ${editingId ? 'updated' : 'created'} successfully`,
      });
      setDialogOpen(false);
      setFormData(initialFormData);
      setEditingId(null);
      setUploadedFile(null);
      setExistingFilePath('');
      fetchCertificates();
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      issue_date: certificate.issue_date,
      expiry_date: certificate.expiry_date || '',
      credential_id: certificate.credential_id,
      credential_url: certificate.credential_url,
      category: certificate.category,
      status: certificate.status,
      order_index: certificate.order_index,
    });
    setExistingFilePath(certificate.file_path);
    setEditingId(certificate.id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const certToDelete = certificates.find((c) => c.id === deleteId);
    if (certToDelete?.file_path) {
      await supabase.storage.from('certificates').remove([certToDelete.file_path]);
    }

    const { error } = await supabase.from('certificates').delete().eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Certificate deleted successfully',
      });
      fetchCertificates();
    }
    setDeleteId(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
    setUploadedFile(null);
    setExistingFilePath('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Certificates Management</h1>
          <p className="text-muted-foreground">
            Manage your professional certifications and credentials
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleDialogClose()}>
              <Plus className="mr-2 w-4 h-4" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Certificate' : 'Add New Certificate'}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Update certificate information'
                  : 'Add a new certificate to your portfolio'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Certificate Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  required
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  value={formData.credential_id}
                  onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  placeholder="e.g., ABC-123-XYZ"
                />
              </div>
              <div>
                <Label htmlFor="credential_url">Verification URL</Label>
                <Input
                  id="credential_url"
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  placeholder="https://verify.example.com/credential"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Cloud Computing"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: CertificateStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="file">Certificate Image (Max 5MB)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {existingFilePath && !uploadedFile && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      File exists
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
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle>{certificate.title}</CardTitle>
                    {certificate.category && (
                      <Badge variant="secondary">{certificate.category}</Badge>
                    )}
                  </div>
                  <CardDescription>{certificate.issuer}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(certificate)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(certificate.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Issue Date:</strong>{' '}
                  {new Date(certificate.issue_date).toLocaleDateString()}
                </p>
                {certificate.expiry_date && (
                  <p>
                    <strong>Expiry Date:</strong>{' '}
                    {new Date(certificate.expiry_date).toLocaleDateString()}
                  </p>
                )}
                {certificate.credential_id && (
                  <p>
                    <strong>Credential ID:</strong> {certificate.credential_id}
                  </p>
                )}
                {certificate.credential_url && (
                  <p>
                    <strong>Verification:</strong>{' '}
                    <a
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Verify
                    </a>
                  </p>
                )}
                {certificate.file_path && (
                  <div className="mt-4">
                    {certificate.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={getStorageUrl('certificates', certificate.file_path)}
                        alt={certificate.title}
                        className="w-full max-w-md rounded-lg border"
                      />
                    ) : certificate.file_path.match(/\.pdf$/i) ? (
                      <a
                        href={getStorageUrl('certificates', certificate.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        View PDF Certificate
                      </a>
                    ) : (
                      <a
                        href={getStorageUrl('certificates', certificate.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        Download File
                      </a>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certificates.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No certificates yet. Click &quot;Add Certificate&quot; to get started.
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the certificate and
              associated files.
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
