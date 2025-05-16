
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsultationsSectionProps {
  user?: any;
}

const ConsultationsSection: React.FC<ConsultationsSectionProps> = ({ user }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          No active consultations found. Book a session with an expert to get started.
        </p>
        {/* Consultation listings would go here */}
      </CardContent>
    </Card>
  );
};

export default ConsultationsSection;
