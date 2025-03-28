import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ReportUserType } from './types';
import { useExpertAuth } from '@/hooks/useExpertAuth';
import { supabase } from '@/lib/supabase';

interface UserReportsProps {
  users: Array<{ id: string; name: string }>;
}

const UserReports: React.FC<UserReportsProps> = ({ users }) => {
  const { expert } = useExpertAuth();
  const [userId, setUserId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [reports, setReports] = useState<ReportUserType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing reports
    const fetchReports = async () => {
      if (!expert) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('expert_reports')
          .select('*')
          .eq('expert_id', expert.id);
        
        if (error) {
          console.error('Error fetching reports:', error);
          return;
        }
        
        if (data) {
          const formattedReports: ReportUserType[] = data.map(report => ({
            id: report.id,
            user_id: report.user_id || '',
            expert_id: parseInt(report.expert_id || '0', 10),
            reason: report.reason || '',
            details: report.details || '',
            date: report.date || new Date().toISOString(),
            status: report.status || 'pending',
            userName: report.user_name // For display compatibility
          }));
          setReports(formattedReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [expert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expert) {
      toast.error('You must be logged in to report a user');
      return;
    }
    
    if (!userId || !reason) {
      toast.error('Please select a user and provide a reason for reporting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get user name
      const reportedUser = users.find(user => user.id === userId);
      const userName = reportedUser ? reportedUser.name : 'Unknown User';
      
      // Create the report object
      const newReport = {
        expert_id: expert.id,
        user_id: userId,
        user_name: userName,
        reason: reason,
        details: details,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      // Insert report into database
      const { data, error } = await supabase
        .from('expert_reports')
        .insert(newReport)
        .select()
        .single();
      
      if (error) {
        toast.error('Failed to submit report: ' + error.message);
        return;
      }
      
      if (data) {
        // Format the report for display
        const formattedReport: ReportUserType = {
          id: data.id,
          user_id: data.user_id || '',
          expert_id: parseInt(data.expert_id || '0', 10),
          reason: data.reason || '',
          details: data.details || '',
          date: data.date || new Date().toISOString(),
          status: data.status || 'pending',
          userName: data.user_name
        };
        
        // Update local state
        setReports([...reports, formattedReport]);
        
        // Reset form
        setUserId('');
        setReason('');
        setDetails('');
        
        toast.success('User reported successfully');
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      toast.error('Failed to report user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report a User</CardTitle>
          <CardDescription>
            If you've encountered an issue with a user, please report it here for our team to review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="user" className="text-sm font-medium">
                Select User
              </label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Reporting
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                  <SelectItem value="harassment">Harassment</SelectItem>
                  <SelectItem value="false_information">False Information</SelectItem>
                  <SelectItem value="payment_issue">Payment Issue</SelectItem>
                  <SelectItem value="no_show">No-Show for Appointment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Additional Details
              </label>
              <Textarea
                id="details"
                placeholder="Please provide specific details about the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button
              type="submit"
              className="bg-ifind-aqua hover:bg-ifind-teal"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>
            History of the reports you've submitted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              You haven't submitted any reports yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{report.userName || 'Unknown User'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Reported on {formatDate(report.date)}
                      </p>
                    </div>
                    <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded uppercase font-medium">
                      {report.status}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Reason: {report.reason.replace(/_/g, ' ')}</p>
                    {report.details && (
                      <p className="text-sm mt-1 text-muted-foreground">{report.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserReports;
