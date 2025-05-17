
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title = 'Coming Soon',
  description = 'This feature is currently under development and will be available shortly.'
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            {description}
          </p>
          <Button onClick={() => navigate('/user-dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoonPage;
