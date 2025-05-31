
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, Filter, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ReportPage = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    userId: '',
    reason: '',
    details: ''
  });

  // Mock data for existing reports
  const reports = [
    {
      id: '1',
      userId: 'user_123',
      userName: 'John Doe',
      reason: 'inappropriate_behavior',
      details: 'User was being disrespectful during the session',
      status: 'pending',
      date: '2024-01-15',
      sessionId: 'session_456'
    },
    {
      id: '2',
      userId: 'user_789',
      userName: 'Jane Smith',
      reason: 'no_show',
      details: 'Client did not attend scheduled appointment without notice',
      status: 'resolved',
      date: '2024-01-12',
      sessionId: 'session_789'
    },
    {
      id: '3',
      userId: 'user_321',
      userName: 'Mike Johnson',
      reason: 'payment_issue',
      details: 'Client disputed payment after session completion',
      status: 'under_review',
      date: '2024-01-10',
      sessionId: 'session_321'
    }
  ];

  const reasonLabels = {
    inappropriate_behavior: 'Inappropriate Behavior',
    no_show: 'No Show',
    payment_issue: 'Payment Issue',
    harassment: 'Harassment',
    other: 'Other'
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      under_review: 'default',
      resolved: 'outline',
      dismissed: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const handleSubmitReport = () => {
    // Handle report submission logic here
    console.log('Submitting report:', reportForm);
    setIsReportDialogOpen(false);
    setReportForm({ userId: '', reason: '', details: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Reports</h1>
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <AlertCircle className="h-4 w-4 mr-2" />
              Report User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report a User</DialogTitle>
              <DialogDescription>
                Report inappropriate behavior or issues with a client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">User ID or Email</Label>
                <Input
                  id="userId"
                  placeholder="Enter user ID or email"
                  value={reportForm.userId}
                  onChange={(e) => setReportForm({ ...reportForm, userId: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Report</Label>
                <Select value={reportForm.reason} onValueChange={(value) => setReportForm({ ...reportForm, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                    <SelectItem value="payment_issue">Payment Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  placeholder="Provide detailed information about the incident"
                  value={reportForm.details}
                  onChange={(e) => setReportForm({ ...reportForm, details: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReport}>
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-3xl font-bold">
                  {reports.filter(r => r.status === 'under_review').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search by user name or ID..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
                <SelectItem value="payment_issue">Payment Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>Reports you have submitted against users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{report.userName}</h3>
                    <p className="text-sm text-gray-600">User ID: {report.userId}</p>
                    <p className="text-sm text-gray-600">Session: {report.sessionId}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(report.status)}
                    <p className="text-sm text-gray-500 mt-1">{report.date}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <Badge variant="outline" className="mb-2">
                    {reasonLabels[report.reason as keyof typeof reasonLabels] || report.reason}
                  </Badge>
                  <p className="text-sm text-gray-700">{report.details}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {report.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Update Report
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {reports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No reports submitted yet</p>
                <p className="text-sm">Reports you submit will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;
