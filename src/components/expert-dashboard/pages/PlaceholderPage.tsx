
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: number;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, phase }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-ifind-teal/20 flex items-center justify-center mb-4">
              <span className="text-ifind-teal font-bold">Phase {phase}</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">This feature is under development</h3>
            <p className="text-muted-foreground max-w-md">
              The {title.toLowerCase()} functionality will be available in Phase {phase} 
              of our development roadmap. We're working hard to bring you this feature soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
