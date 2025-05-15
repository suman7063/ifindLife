
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';

interface EnrolledProgramsProps {
  user: UserProfile | null;
}

const EnrolledPrograms: React.FC<EnrolledProgramsProps> = ({ user }) => {
  // This would normally come from user.enrolled_courses
  const programs = [
    { id: 1, title: 'Stress Management', progress: 60, expert: 'Dr. Jane Smith' },
    { id: 2, title: 'Sleep Improvement', progress: 30, expert: 'Dr. Robert Johnson' }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Enrolled Programs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {programs.length > 0 ? (
            programs.map(program => (
              <div key={program.id} className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{program.title}</p>
                  <span className="text-sm text-muted-foreground">{program.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">By {program.expert}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No enrolled programs</p>
          )}
          
          <button className="mt-2 text-indigo-600 text-sm font-medium hover:text-indigo-800">
            Browse more programs
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrolledPrograms;
