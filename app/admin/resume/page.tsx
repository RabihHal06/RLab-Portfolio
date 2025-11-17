'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase, getStorageUrl } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Upload, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeItem {
  id: string;
  category: 'experience' | 'education' | 'skills' | 'awards';
  title: string;
  subtitle?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  order_index: number;
}

interface ResumePDF {
  id: string;
  file_path: string;
  display_name: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminResumePage() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [pdfFiles, setPdfFiles] = useState<ResumePDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResumeItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('experience');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingPdf, setEditingPdf] = useState<ResumePDF | null>(null);
  const [pdfRenameDialogOpen, setPdfRenameDialogOpen] = useState(false);
  const [pdfDisplayName, setPdfDisplayName] = useState('');

  const [formData, setFormData] = useState<Partial<ResumeItem>>({
    category: 'experience',
    title: '',
    subtitle: '',
    location: '',
    description: '',
    is_current: false,
   order_index: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchPDFFiles();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase
      .from('resume_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Failed to fetch resume items');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  async function fetchPDFFiles() {
    const { data, error } = await supabase
      .from('resume_pdf_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch PDF files');
    } else {
      setPdfFiles(data || []);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      toast.error('Title and category are required');
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from('resume_items')
        .update(formData)
        .eq('id', editingItem.id);

      if (error) toast.error('Failed to update item');
      else {
        toast.success('Item updated successfully');
        fetchItems();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('resume_items')
        .insert([formData]);

      if (error) toast.error('Failed to create item');
      else {
        toast.success('Item created successfully');
        fetchItems();
        resetForm();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;

    const { error } = await supabase
      .from('resume_items')
      .delete()
      .eq('id', id);

    if (error) toast.error('Failed to delete item');
    else {
      toast.success('Item deleted');
      fetchItems();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF');
      return;
    }

    setSelectedFile(file);
  }

  async function handlePDFUpload() {
    if (!selectedFile) {
      toast.error('Please select a PDF');
      return;
    }

    setUploading(true);

    const fileName = `resume-${Date.now()}.pdf`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(filePath, selectedFile);

    if (uploadError) {
      toast.error('Upload failed');
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('resume_pdf_files')
      .insert([{ file_path: filePath, display_name: null, is_active: false }]);

    if (dbError) toast.error('Failed to save PDF record');
    else {
      toast.success('PDF uploaded successfully');
      fetchPDFFiles();
      setPdfDialogOpen(false);
      setSelectedFile(null);
    }

    setUploading(false);
  }

  async function toggleActivePDF(id: string, currentStatus: boolean) {
    await supabase.from('resume_pdf_files').update({ is_active: false }).neq('id', id);

    const { error } = await supabase
      .from('resume_pdf_files')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) toast.error('Failed to update');
    else {
      toast.success('PDF updated');
      fetchPDFFiles();
    }
  }

  async function deletePDF(id: string, filePath: string) {
    if (!confirm('Delete this PDF?')) return;

    await supabase.storage.from('resume').remove([filePath]);
    await supabase.from('resume_pdf_files').delete().eq('id', id);

    toast.success('PDF deleted');
    fetchPDFFiles();
  }

  function openRenamePdfDialog(pdf: ResumePDF) {
    setEditingPdf(pdf);
    setPdfDisplayName(pdf.display_name || '');
    setPdfRenameDialogOpen(true);
  }

  async function handlePdfRename() {
    if (!editingPdf) return;

    const { error } = await supabase
      .from('resume_pdf_files')
      .update({ display_name: pdfDisplayName })
      .eq('id', editingPdf.id);

    if (error) toast.error('Rename failed');
    else {
      toast.success('Name updated');
      setPdfRenameDialogOpen(false);
      setEditingPdf(null);
      setPdfDisplayName('');
      fetchPDFFiles();
    }
  }

  function resetForm() {
    setFormData({
      category: 'experience',
      title: '',
      subtitle: '',
      location: '',
      description: '',
      is_current: false,
      order_index: 0,
    });
    setEditingItem(null);
    setDialogOpen(false);
  }

  function editItem(item: ResumeItem) {
    setEditingItem(item);
    setFormData(item);
    setDialogOpen(true);
  }

  const filteredItems = items.filter((item) => item.category === activeTab);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume Management</h1>
        <p className="text-muted-foreground">Manage your resume content and uploaded PDFs</p>
      </div>

      <div className="grid gap-6">
        {/* ---------------- PDF SECTION ---------------- */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resume PDF</CardTitle>
              <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Resume PDF</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>PDF File</Label>
                      <Input type="file" accept=".pdf" onChange={handleFileSelect} />
                      {selectedFile && <p className="text-sm mt-2">Selected: {selectedFile.name}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setPdfDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePDFUpload} disabled={!selectedFile || uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {pdfFiles.length === 0 ? (
              <p className="text-muted-foreground">No PDFs uploaded</p>
            ) : (
              <div className="space-y-3">
                {pdfFiles.map((pdf) => (
                  <div key={pdf.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">
                          {pdf.display_name || 'Untitled Resume'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pdf.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {pdf.is_active && <Badge>Active</Badge>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(getStorageUrl('resume', pdf.file_path), '_blank')}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openRenamePdfDialog(pdf)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant={pdf.is_active ? 'default' : 'outline'} onClick={() => toggleActivePDF(pdf.id, pdf.is_active)}>
                        {pdf.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePDF(pdf.id, pdf.file_path)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rename Dialog */}
        <Dialog open={pdfRenameDialogOpen} onOpenChange={setPdfRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename PDF File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input value={pdfDisplayName} onChange={(e) => setPdfDisplayName(e.target.value)} placeholder="Enter display name" />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setPdfRenameDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePdfRename} disabled={!pdfDisplayName}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ---------------- RESUME ITEMS SECTION ---------------- */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resume Items</CardTitle>
              <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="experience">Experience</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="skills">Skills</SelectItem>
                            <SelectItem value="awards">Awards</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input type="number" value={formData.order_index} onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })} />
                      </div>
                    </div>

                    <div>
                      <Label>Title *</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    <div>
                      <Label>Subtitle</Label>
                      <Input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                    </div>

                    <div>
                      <Label>Location</Label>
                      <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input type="date" value={formData.start_date || ''} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input type="date" value={formData.end_date || ''} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={formData.is_current} />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.is_current} onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })} />
                      <Label>Currently Active</Label>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                      <Button type="submit">{editingItem ? 'Update' : 'Create'}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="awards">Awards</TabsTrigger>
              </TabsList>

              {['experience', 'education', 'skills', 'awards'].map((category) => (
                <TabsContent key={category} value={category}>
                  {loading ? (
                    <p className="text-muted-foreground">Loading...</p>
                  ) : filteredItems.length === 0 ? (
                    <p className="text-muted-foreground">No items</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Subtitle</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.order_index}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.subtitle}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              {item.start_date && new Date(item.start_date).toLocaleDateString()}
                              {item.is_current ? ' - Present' : item.end_date ? ` - ${new Date(item.end_date).toLocaleDateString()}` : ''}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" onClick={() => editItem(item)}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
