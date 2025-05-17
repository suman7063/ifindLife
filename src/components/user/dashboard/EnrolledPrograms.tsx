
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EnrolledProgramsProps {
  user: UserProfile | any;
}

const EnrolledPrograms: React.FC<EnrolledProgramsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // This would normally come from an API
  const programs: any[] = [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Enrolled Programs</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/programs')}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {programs.length > 0 ? (
          <div className="space-y-3">
            {programs.map(program => (
              <div 
                key={program.id} 
                className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/programs/${program.id}`)}
              >
                <h3 className="font-medium">{program.title}</h3>
                <p className="text-sm text-gray-500">{program.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {program.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {program.progress}% complete
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>You haven't enrolled in any programs yet.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/programs')}
            >
              Explore Programs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrolledPrograms;
