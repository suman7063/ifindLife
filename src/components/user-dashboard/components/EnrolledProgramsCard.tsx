
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { EnrolledProgram } from '@/types/user.types';
import { LMSAccess } from './LMSAccess';

interface EnrolledProgramsCardProps {
  enrolledPrograms?: EnrolledProgram[];
}

const EnrolledProgramsCard: React.FC<EnrolledProgramsCardProps> = ({ enrolledPrograms = [] }) => {
  const navigate = useNavigate();
  
  const handleContinueCourse = (programId: string) => {
    navigate(`/course/${programId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enrolled Programs</CardTitle>
      </CardHeader>
      <CardContent>
        {enrolledPrograms.length > 0 ? (
          <div className="space-y-4">
            {enrolledPrograms.map((enrollment) => (
              <div key={enrollment.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{enrollment.program.title}</h4>
                    <p className="text-xs text-muted-foreground">By {enrollment.program.instructor_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: {enrollment.completion_status.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContinueCourse(enrollment.program_id)}
                    >
                      {enrollment.completion_status === 'completed' ? 'Review' : 'Continue'}
                    </Button>
                    <LMSAccess enrollment={enrollment} />
                  </div>
                </div>
                <Progress value={enrollment.progress_percentage} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">
                  {enrollment.progress_percentage}% Complete
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">You haven't enrolled in any programs yet</p>
            <Button variant="outline" onClick={() => navigate('/programs')}>Browse Programs</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledProgramsCard;
