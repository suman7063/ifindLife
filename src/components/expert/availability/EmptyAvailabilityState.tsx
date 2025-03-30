
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyAvailabilityState: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          You haven't set any availability periods yet.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyAvailabilityState;
