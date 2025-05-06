
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpertProfileForm from './profile/ExpertProfileForm';

const ExpertProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/expert-dashboard')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your professional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExpertProfileForm />
      </CardContent>
    </Card>
  );
};

export default ExpertProfileEdit;
