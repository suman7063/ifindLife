
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsList from './ReportsList';
import FeedbackList from './FeedbackList';
import { useModeration } from '@/hooks/admin/useModeration';

const ModerationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const {
    reports,
    loading: isLoading,
    error,
    assignReport: handleReviewReport,
    dismissReport: handleDismissReport,
    takeAction: handleTakeAction
  } = useModeration();

  // Mock feedback data since it's not implemented in the hook yet
  const feedback = [];
  const handleDeleteFeedback = () => {};

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
              isLoading={isLoading}
              onReview={handleReviewReport}
              onDismiss={handleDismissReport}
              onAction={handleTakeAction}
            />
          </TabsContent>
          
          <TabsContent value="feedback">
            <FeedbackList 
              feedback={feedback}
              isLoading={isLoading}
              onDelete={handleDeleteFeedback}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModerationDashboard;
