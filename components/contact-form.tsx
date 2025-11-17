'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Mail, User, MessageSquare } from 'lucide-react';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (dbError) {
        toast.error('Failed to save message');
        setLoading(false);
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-rlab-grey-light/50">
      <CardHeader>
        <CardTitle className="flex items-center text-rlab-navy-deep">
          <MessageSquare className="mr-3 w-5 h-5 text-rlab-gold-soft" />
          Send a Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-rlab-navy-deep">
                <User className="w-4 h-4 inline mr-2" />
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
                disabled={loading}
                className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-rlab-navy-deep">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="your.email@example.com"
                disabled={loading}
                className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-rlab-navy-deep">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              placeholder="What is this regarding?"
              disabled={loading}
              className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-rlab-navy-deep">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              placeholder="Tell me about your project or inquiry..."
              rows={6}
              disabled={loading}
              className="border-rlab-grey-light focus:border-rlab-gold-soft focus:ring-rlab-gold-soft"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-rlab-navy-deep text-white font-medium rounded-full hover:bg-rlab-navy-royal hover:shadow-[0_0_0_2px_rgba(203,178,106,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
