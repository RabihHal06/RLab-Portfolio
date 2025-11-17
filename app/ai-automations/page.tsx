'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase, getStorageUrl } from '@/lib/supabase';
import type { AIAutomation } from '@/lib/types/database';

export default function AIAutomationsPage() {
  const [automations, setAutomations] = useState<AIAutomation[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<AIAutomation | null>(null);

  useEffect(() => {
    async function fetchAutomations() {
      const { data } = await supabase
        .from('ai_automations')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      if (data) setAutomations(data as AIAutomation[]);
    }
    fetchAutomations();
  }, []);

  return (
    <div className="bg-rlab-navy-deep">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">AI Automations</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover how I leverage Make.com and AI to automate business processes and solve complex challenges
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automations.map((automation) => (
            <Card
              key={automation.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => setSelectedAutomation(automation)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white group-hover:text-rlab-gold-soft transition-colors">
                    {automation.title}
                  </CardTitle>
                  <Badge className="bg-rlab-gold-soft/20 text-rlab-gold-soft border border-rlab-gold-soft/30">{automation.platform}</Badge>
                </div>
                <CardDescription className="text-white/70">{automation.short_description}</CardDescription>
              </CardHeader>
              <CardContent>
                {automation.screenshot_path && (
                  <div className="aspect-video bg-rlab-navy-royal rounded-lg overflow-hidden">
                    <img
                      src={getStorageUrl('ai-automations', automation.screenshot_path)}
                      alt={automation.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {automation.tags && automation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {automation.tags.map((tag, index) => (
                      <Badge key={index} className="bg-white/10 text-rlab-gold-soft border border-white/20 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {automations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70">No automations available yet. Check back soon!</p>
          </div>
        )}

        <Dialog open={!!selectedAutomation} onOpenChange={() => setSelectedAutomation(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedAutomation && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl text-rlab-navy-deep">{selectedAutomation.title}</DialogTitle>
                    <Badge className="bg-rlab-gold-soft text-white">{selectedAutomation.platform}</Badge>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  {selectedAutomation.screenshot_path && (
                    <div className="bg-rlab-snow rounded-lg p-4">
                      <img
                        src={getStorageUrl('ai-automations', selectedAutomation.screenshot_path)}
                        alt={selectedAutomation.title}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-rlab-navy-deep">Description</h3>
                    <p className="text-rlab-text-dark whitespace-pre-wrap">
                      {selectedAutomation.short_description}
                    </p>
                  </div>

                  {selectedAutomation.business_context && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-rlab-navy-deep">Business Impact</h3>
                      <p className="text-rlab-text-dark whitespace-pre-wrap">
                        {selectedAutomation.business_context}
                      </p>
                    </div>
                  )}

                  {selectedAutomation.tags && selectedAutomation.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-rlab-navy-deep">Technologies & Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAutomation.tags.map((tag, index) => (
                          <Badge key={index} className="bg-rlab-gold-soft/20 text-rlab-gold-deep border border-rlab-gold-soft/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
