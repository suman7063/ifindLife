
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsList from './ReportsList';
import FeedbackList from './FeedbackList';
import { useModeration } from '@/hooks/admin/useModeration';

const ModerationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const {
    reports,
    loading,
    error,
    assignReport,
    dismissReport,
    takeAction
  } = useModeration();

  // Mock feedback data since it's not implemented in the hook yet
  const feedback: any[] = [];
  
  // Wrapper functions to match the required prop signatures
  const handleReviewReport = (reportId: string) => {
    // Use a mock admin ID for now, in a real app you would get this from auth context
    const mockAdminId = 'admin-123';
    return assignReport(reportId, mockAdminId);
  };
  
  const handleDismissReport = (reportId: string) => {
    const mockAdminId = 'admin-123';
    return dismissReport(reportId, mockAdminId);
  };
  
  const handleTakeAction = (reportId: string, actionType: string) => {
    const mockAdminId = 'admin-123';
    return takeAction(reportId, mockAdminId, actionType);
  };
  
  const handleDeleteFeedback = () => {
    // Placeholder function
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Moderation Dashboard</CardTitle>
        <CardDescription>
          Manage reports, feedback, and take moderation actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            <ReportsList 
              reports={reports}
              isLoading={loading}
              onReview={handleReviewReport}
              onDismiss={handleDismissReport}
              onAction={(reportId) => handleTakeAction(reportId, 'warn')}
            />
          </TabsContent>
          
          <TabsContent value="feedback">
            <FeedbackList 
              feedback={feedback}
              isLoading={loading}
              onDelete={handleDeleteFeedback}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModerationDashboard;
