
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/database/unified';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface EnrolledProgramsProps {
  user: UserProfile | any;
}

const EnrolledPrograms: React.FC<EnrolledProgramsProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // This would normally come from an API
  const programs = [
    {
      id: 1,
      title: 'Stress Management Workshop',
      expert: 'Dr. Sarah Johnson',
      progress: 60,
      nextSessionDate: '2025-05-25T15:30:00'
    },
    {
      id: 2,
      title: 'Emotional Resilience Training',
      expert: 'Dr. Michael Chen',
      progress: 30,
      nextSessionDate: '2025-05-22T10:00:00'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Enrolled Programs</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/programs-for-wellness-seekers')}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {programs.length > 0 ? (
          <div className="space-y-4">
            {programs.map(program => (
              <div key={program.id} className="border rounded-md p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{program.title}</h3>
                    <p className="text-sm text-gray-500">with {program.expert}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => navigate(`/program/${program.id}`)}
                  >
                    <span>Continue</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Progress</span>
                    <span>{program.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full mt-1">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${program.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Next session: {new Date(program.nextSessionDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>You're not enrolled in any programs yet.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => navigate('/programs-for-wellness-seekers')}
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
