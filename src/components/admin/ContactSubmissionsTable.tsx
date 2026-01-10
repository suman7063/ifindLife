
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Loader2, Mail, Phone, User, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ContactSubmission } from '@/types/supabase/tables';

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

      setSubmissions(data as ContactSubmission[] || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status: 'read', is_read: true } : sub)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <Card 
              key={submission.id} 
              className={`hover:shadow-lg transition-shadow ${
                submission.status === 'read' || submission.is_read ? '' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{submission.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(submission.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'read' || submission.is_read
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {submission.status === 'read' || submission.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${submission.email}`} 
                      className="text-blue-600 hover:underline truncate"
                    >
                      {submission.email}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-medium text-gray-600">Subject: </span>
                      <span className="text-gray-700">{submission.subject}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600 flex items-start gap-1">
                      <FileText className="h-4 w-4 mt-0.5" />
                      Message:
                    </span>
                    <p className="ml-5 text-gray-700 mt-1 line-clamp-3">{submission.message}</p>
                  </div>
                </div>

                {(submission.status !== 'read' && !submission.is_read) && (
                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsRead(submission.id)}
                      className="w-full"
                    >
                      Mark as read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissionsTable;
