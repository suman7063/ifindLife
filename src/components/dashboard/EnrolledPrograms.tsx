
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const EnrolledPrograms: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const enrolledCourses = profile?.enrolled_courses || [];
  
  const handleContinueCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Enrolled Programs</CardTitle>
      </CardHeader>
      <CardContent>
        {enrolledCourses.length > 0 ? (
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">{course.title}</h4>
                    <p className="text-xs text-muted-foreground">By {course.expert_name}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContinueCourse(course.id)}
                  >
                    {course.completed ? 'Review' : 'Continue'}
                  </Button>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-right text-muted-foreground">{course.progress}% Complete</p>
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

export default EnrolledPrograms;
