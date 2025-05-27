
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ensureUserProfileCompatibility } from '@/utils/typeAdapters';

const ConsultationsSection: React.FC = () => {
  const { userProfile } = useAuth();
  const currentUser = ensureUserProfileCompatibility(userProfile);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Consultations</CardTitle>
      </CardHeader>
      <CardContent>
        {currentUser?.enrolled_courses && currentUser.enrolled_courses.length > 0 ? (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              You have {currentUser.enrolled_courses.length} enrolled courses
            </p>
            {/* Consultation listings would go here */}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You don't have any upcoming consultations.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationsSection;
