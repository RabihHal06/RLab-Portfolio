'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { Certificate } from '@/lib/types/database';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    async function fetchCertificates() {
      const { data } = await supabase
        .from('certificates')
        .select('*')
        .order('issue_date', { ascending: false });
      if (data) setCertificates(data as Certificate[]);
    }
    fetchCertificates();
  }, []);

  const groupedByIssuer = certificates.reduce((acc, cert) => {
    const issuer = cert.issuer || 'Other';
    if (!acc[issuer]) {
      acc[issuer] = [];
    }
    acc[issuer].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

  const sortedIssuers = Object.keys(groupedByIssuer).sort();

  return (
    <div className="bg-rlab-navy-deep">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">Certificates</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Professional certifications and credentials showcasing continuous learning
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70">No certificates found.</p>
          </div>
        ) : (
          <div className="space-y-12">
          {sortedIssuers.map((issuer) => (
            <div key={issuer}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1 text-white">{issuer}</h2>
                <div className="h-1 w-20 bg-rlab-gold-soft rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedByIssuer[issuer].map((cert) => (
                  <Card
                    key={cert.id}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg text-white group-hover:text-rlab-gold-soft transition-colors">{cert.title}</CardTitle>
                        <div className="flex gap-2">
                          {cert.status === 'in_progress' && (
                            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              In Progress
                            </Badge>
                          )}
                          {cert.category && (
                            <Badge className="bg-rlab-gold-soft/20 text-rlab-gold-soft border border-rlab-gold-soft/30">
                              {cert.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-rlab-gold-soft font-medium">
                        {new Date(cert.issue_date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {cert.file_path && (
                        <div className="aspect-video bg-rlab-navy-royal rounded-lg flex items-center justify-center overflow-hidden">
                          {cert.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={getStorageUrl('certificates', cert.file_path)}
                              alt={cert.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-12 h-12 text-white/50" />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          </div>
        )}

        <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-rlab-navy-deep border-white/20">
          {selectedCert && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DialogTitle className="text-2xl text-white">{selectedCert.title}</DialogTitle>
                      {selectedCert.status === 'in_progress' && (
                        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/70">{selectedCert.issuer}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedCert.credential_url && (
                      <a
                        href={selectedCert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button className="px-4 py-2 bg-rlab-gold-soft text-white font-medium rounded-lg hover:bg-rlab-gold-deep transition-all inline-flex items-center text-sm">
                          <ExternalLink className="mr-2 w-4 h-4" />
                          Verify
                        </button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCert(null)}
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-6 text-sm border-b border-white/20 pb-4">
                  <div>
                    <span className="text-white/60">Issue Date:</span>
                    <p className="font-medium text-white">
                      {new Date(selectedCert.issue_date).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {selectedCert.expiry_date && (
                    <div>
                      <span className="text-white/60">Expiry Date:</span>
                      <p className="font-medium text-white">
                        {new Date(selectedCert.expiry_date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {selectedCert.credential_id && (
                    <div className="flex-1">
                      <span className="text-white/60">Credential ID:</span>
                      <p className="font-medium font-mono text-xs text-rlab-gold-soft">{selectedCert.credential_id}</p>
                    </div>
                  )}
                </div>

                {selectedCert.file_path && (
                  <a
                    href={getStorageUrl('certificates', selectedCert.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="bg-rlab-navy-royal rounded-lg p-4 flex items-center justify-center min-h-[400px] hover:bg-rlab-navy-royal/80 transition-colors cursor-pointer group">
                      {selectedCert.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={getStorageUrl('certificates', selectedCert.file_path)}
                          alt={selectedCert.title}
                          className="max-w-full max-h-[600px] object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <FileText className="w-20 h-20 text-white/50 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                          <p className="text-lg font-medium mb-2 text-white">Certificate PDF</p>
                          <p className="text-sm text-white/60">Click to view in new tab</p>
                        </div>
                      )}
                    </div>
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
