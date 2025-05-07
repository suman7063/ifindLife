
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsProps {
  label: string;
  value: number;
}

const ExpertDashboardAnalytics: React.FC<AnalyticsProps> = ({ label, value }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertDashboardAnalytics;
