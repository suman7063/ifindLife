
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const SupportSection: React.FC = () => {
  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted. We'll get back to you soon!");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Help & Support</h2>
      <p className="text-muted-foreground mb-6">Get assistance with your account</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitSupport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your issue in detail" 
                  className="min-h-[120px]" 
                />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Email Support</span>
                <span className="font-medium">support@ifindlife.com</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Phone Support</span>
                <span className="font-medium">+1 (888) 123-4567</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Support Hours</span>
                <span className="font-medium">Monday to Friday, 9am - 5pm</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I book a consultation?</AccordionTrigger>
                  <AccordionContent>
                    You can book a consultation by visiting the expert's profile and 
                    selecting an available time slot from their calendar.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I add money to my wallet?</AccordionTrigger>
                  <AccordionContent>
                    Navigate to the Wallet section in your dashboard and click on 
                    "Add Funds" to add money using your preferred payment method.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do referrals work?</AccordionTrigger>
                  <AccordionContent>
                    Share your unique referral link with friends. When they sign up 
                    and complete their first consultation, both you and your friend 
                    receive credit in your wallet.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
