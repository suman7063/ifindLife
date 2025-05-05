
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth/AuthContext';
import { toast } from 'sonner';
import { AlertCircle, Upload } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';

// Define form validation schema
const helpFormSchema = z.object({
  category: z.string({
    required_error: "Please select an issue category",
  }),
  details: z.string()
    .min(10, "Issue details must be at least 10 characters long")
    .max(500, "Issue details cannot exceed 500 characters"),
});

type HelpFormValues = z.infer<typeof helpFormSchema>;

interface HelpFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpForm: React.FC<HelpFormProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<HelpFormValues>({
    resolver: zodResolver(helpFormSchema),
    defaultValues: {
      category: '',
      details: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      
      // Check file type (only images)
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Only image files are allowed.");
        return;
      }
      
      setFile(selectedFile);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const generateTicketId = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `HELP-${year}-${randomPart}`;
  };

  const onSubmit = async (data: HelpFormValues) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a help request");
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate a unique ticket ID
      const newTicketId = generateTicketId();
      
      // Upload screenshot if provided
      let screenshotUrl = null;
      if (file) {
        const filePath = `help_tickets/${newTicketId}/${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('help_uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (uploadError) {
          throw new Error(`Error uploading file: ${uploadError.message}`);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('help_uploads')
          .getPublicUrl(filePath);
          
        screenshotUrl = publicUrlData.publicUrl;
      }
      
      // Insert ticket data into the help_tickets table
      const { data: ticketData, error: ticketError } = await supabase
        .from('help_tickets')
        .insert({
          ticket_id: newTicketId,
          user_id: userProfile?.id,
          category: data.category,
          details: data.details,
          screenshot_url: screenshotUrl,
          status: 'Pending'
        })
        .select('id')
        .single();
      
      if (ticketError) {
        throw new Error(`Error creating ticket: ${ticketError.message}`);
      }
      
      // Show success message with ticket ID
      setTicketId(newTicketId);
      toast.success("Help ticket submitted successfully!");
    } catch (error) {
      console.error('Error submitting help ticket:', error);
      toast.error("Failed to submit help ticket. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setFile(null);
    setPreviewUrl(null);
    setTicketId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {ticketId ? (
          // Success view
          <>
            <DialogHeader>
              <DialogTitle>Help Request Submitted</DialogTitle>
              <DialogDescription>
                Your help request has been successfully submitted.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <p className="font-semibold">Ticket ID: {ticketId}</p>
                  <p className="mt-2">Please save this ID for reference. Our support team will respond to your request as soon as possible.</p>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={handleReset}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          // Form view
          <>
            <DialogHeader>
              <DialogTitle>Submit Help Request</DialogTitle>
              <DialogDescription>
                Let us know what issues you're experiencing and we'll help you resolve them.
              </DialogDescription>
            </DialogHeader>
            
            {!isAuthenticated && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in to submit a help request.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Category</FormLabel>
                      <Select 
                        disabled={isSubmitting || !isAuthenticated} 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Booking">Booking</SelectItem>
                          <SelectItem value="Payment">Payment</SelectItem>
                          <SelectItem value="Therapist">Therapist</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your issue in detail" 
                          disabled={isSubmitting || !isAuthenticated}
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Screenshot (Optional)</FormLabel>
                  <div className="mt-1">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 border rounded-md px-4 py-2 bg-muted cursor-pointer hover:bg-muted/80 transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isSubmitting || !isAuthenticated}
                          className="hidden"
                        />
                      </label>
                      {file && (
                        <span className="text-sm text-muted-foreground">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      )}
                    </div>
                    
                    {previewUrl && (
                      <div className="mt-4 border rounded-md p-2">
                        <img 
                          src={previewUrl} 
                          alt="Screenshot preview" 
                          className="h-auto max-h-[200px] max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isAuthenticated}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HelpForm;
