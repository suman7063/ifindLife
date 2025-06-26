
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Send, Loader2, MessageSquare, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/database/unified';
import type { SupportRequestInsert } from '@/types/database/support';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HelpSectionProps {
  user: UserProfile | null;
}

const HelpSection: React.FC<HelpSectionProps> = ({ user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('You need to be logged in to submit a support request');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit support request to the database
      const supportRequestData: SupportRequestInsert = {
        user_id: user.id,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('support_requests' as any) // Cast to any since types aren't generated yet
        .insert(supportRequestData);

      if (error) {
        throw error;
      }

      toast.success('Support request submitted successfully');
      setFormData({
        category: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting support request:', error);
      toast.error(error?.message || 'Failed to submit support request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Account Issues',
    'Payment Problems',
    'Expert Related',
    'Technical Issues',
    'Feature Request',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <CardTitle>Help & Support</CardTitle>
          </div>
          <CardDescription>
            Have a question or need assistance? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Chat with our support team directly for quick assistance.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Call us at +91 999-999-9999 (Mon-Fri, 9 AM - 6 PM IST)</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Call Now
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={handleSelectChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your issue"
                disabled={isSubmitting}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your issue in detail"
                rows={5}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">How do I book a consultation?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Visit the Experts page, choose an expert that matches your needs, and click "Book Consultation" to schedule an appointment.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">How do payments work?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You can add funds to your wallet using our secure payment system. The consultation fee will be deducted from your wallet balance.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Can I get a refund?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Refunds are processed if you cancel at least 24 hours before your scheduled consultation. Please contact support for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSection;
