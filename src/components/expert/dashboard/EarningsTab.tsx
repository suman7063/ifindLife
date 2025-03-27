
import React from 'react';
import { Card } from '@/components/ui/card';

const EarningsTab: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
      <p className="text-muted-foreground">
        Your earnings information will be displayed here.
      </p>
    </Card>
  );
};

export default EarningsTab;
