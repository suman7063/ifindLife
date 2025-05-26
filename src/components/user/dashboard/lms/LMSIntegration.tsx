
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Play, BookOpen, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

interface LMSCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lmsUrl: string;
  thumbnailUrl?: string;
  enrollmentDate: string;
}

interface LMSIntegrationProps {
  enrolledCourses: LMSCourse[];
  onAccessCourse: (courseId: string, lmsUrl: string) => void;
}

const LMSIntegration: React.FC<LMSIntegrationProps> = ({ 
  enrolledCourses = [], 
  onAccessCourse 
}) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAccessCourse = async (course: LMSCourse) => {
    setLoading(course.id);
    
    try {
      // Simulate authentication token generation for LMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open LMS course in new tab
      const lmsWindow = window.open(course.lmsUrl, '_blank');
      
      if (!lmsWindow) {
        toast.error('Please allow pop-ups for this site to access your courses');
        return;
      }
      
      // Call the parent callback
      onAccessCourse(course.id, course.lmsUrl);
      
      toast.success(`Accessing ${course.title} in LMS`);
    } catch (error) {
      console.error('Error accessing LMS course:', error);
      toast.error('Failed to access course. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 20) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (enrolledCourses.length === 0) {
    return (
      <div className="bg-muted p-12 rounded-lg text-center">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No LMS Courses</h3>
        <p className="text-muted-foreground mb-6">
          You don't have any courses in the Learning Management System yet.
        </p>
        <Button variant="outline">
          Browse Available Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Learning Management System</h3>
        <p className="text-muted-foreground">
          Access your enrolled courses through our integrated LMS platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="mt-1">
                    by {course.instructor}
                  </CardDescription>
                </div>
                {getStatusBadge(course.status)}
              </div>
              
              {course.thumbnailUrl && (
                <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {course.description}
              </p>
              
              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className={getProgressColor(course.progress)}>
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>Enrolled: {new Date(course.enrollmentDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Access Button */}
                <Button 
                  onClick={() => handleAccessCourse(course)}
                  disabled={loading === course.id}
                  className="w-full mt-3"
                  variant={course.status === 'completed' ? 'outline' : 'default'}
                >
                  {loading === course.id ? (
                    'Accessing...'
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LMSIntegration;
