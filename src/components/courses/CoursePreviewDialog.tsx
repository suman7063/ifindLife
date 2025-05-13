
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Star, Users, CheckCircle } from 'lucide-react';
import { Course } from '@/types/courses';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { renderIcon } from '@/components/admin/sessions/sessionIcons';

interface CoursePreviewDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

const CoursePreviewDialog: React.FC<CoursePreviewDialogProps> = ({ course, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      // Store course info for post-login redirect
      sessionStorage.setItem('pendingAction', JSON.stringify({
        type: 'course-enrollment',
        id: course.id,
        path: `/course-checkout/${course.id}`
      }));
      
      toast.info("Please log in to enroll in this course");
      navigate('/user-login');
      return;
    }
    
    // Navigate to checkout page
    navigate(`/course-checkout/${course.id}`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            {course.icon && (
              <div className={`w-10 h-10 ${course.color} rounded-full flex items-center justify-center`}>
                {renderIcon(course.icon)}
              </div>
            )}
            <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Guided solutions for mental wellbeing and personal growth
          </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video w-full overflow-hidden border-y border-border my-4">
          <iframe
            className="w-full h-full"
            src={`${course.introVideoUrl}?autoplay=0`}
            title={`${course.title} Introduction`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="px-6 py-2">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.duration}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{course.instructorName}</span>
            </div>
            {course.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                <span className="text-sm">{course.rating.toFixed(1)}</span>
              </div>
            )}
            {course.enrollmentCount && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{course.enrollmentCount} enrolled</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {course.totalModules} modules
            </Badge>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">About This Course</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">What You'll Learn</h3>
            <ul className="space-y-2">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Course Content</h3>
            <div className="space-y-3">
              {course.modules.map((module) => (
                <div key={module.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{module.title}</p>
                    <span className="text-sm text-muted-foreground">{module.duration}</span>
                  </div>
                  {module.description && (
                    <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold">₹{course.price}</div>
            <Button size="lg" className="px-8" onClick={handleEnrollClick}>
              Enroll Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePreviewDialog;
