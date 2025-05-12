
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ContactSubmission } from '@/types/supabase/tables';
import { safeDataTransform } from '@/utils/supabaseUtils';

const ContactSubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Safely transform the data with proper error handling
      const formattedSubmissions = safeDataTransform<any, ContactSubmission>(
        data,
        error,
        (item) => ({
          id: item.id || 0,
          name: item.name || '',
          email: item.email || '',
          subject: item.subject || '',
          message: item.message || '',
          created_at: item.created_at || new Date().toISOString(),
          is_read: Boolean(item.is_read)
        }),
        [] // Empty array as fallback
      );
      
      setSubmissions(formattedSubmissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      // Convert id to number
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      
      // Use the correct type for the update operation
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true } as any)
        .eq('id', numericId);

      if (error) {
        throw error;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, is_read: true } : sub)
      );
      
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error updating contact submission:', error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-ifind-teal" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Form Submissions</h2>
        <Button 
          variant="outline" 
          onClick={fetchSubmissions}
          className="flex items-center gap-2"
        >
          Refresh
        </Button>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No contact form submissions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow 
                  key={submission.id}
                  className={submission.is_read ? "" : "bg-blue-50"}
                >
                  <TableCell className="font-medium">
                    {submission.created_at ? format(new Date(submission.created_at), 'MMM d, yyyy HH:mm') : 'Unknown date'}
                  </TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${submission.email}`} 
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {submission.email}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>{submission.subject}</TableCell>
                  <TableCell className="max-w-xs truncate" title={submission.message}>
                    {submission.message}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      submission.is_read 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-100 text-blue-800 font-medium'
                    }`}>
                      {submission.is_read ? 'Read' : 'Unread'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {!submission.is_read && submission.id && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(submission.id as number)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsTable;
