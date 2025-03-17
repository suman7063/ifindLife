
import React from 'react';
import ModerationDashboard from './ModerationDashboard';
import { Card } from '@/components/ui/card';

const AdminModerationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Moderation Center</h2>
      <p className="text-muted-foreground">
        Manage reports, feedback, and moderate user and expert activity on the platform.
      </p>
      
      <Card className="p-6">
        <ModerationDashboard />
      </Card>
    </div>
  );
};

export default AdminModerationTab;
