
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Course, CourseModule } from '@/types/courses';
import { useCourses } from '@/hooks/useCourses';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, loading: loadingCourses } = useCourses();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<CourseModule | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access your course");
      navigate('/user-login');
      return;
    }
    
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        // Set the first module as current if not already selected
        if (!currentModule && foundCourse.modules.length > 0) {
          setCurrentModule(foundCourse.modules[0]);
        }
      } else {
        toast.error("Course not found");
        navigate('/courses');
      }
    }
  }, [courseId, courses, currentModule, isAuthenticated, navigate]);
  
  // Calculate progress whenever completed modules change
  useEffect(() => {
    if (course) {
      const progressPercentage = Math.round((completedModules.length / course.modules.length) * 100);
      setProgress(progressPercentage);
    }
  }, [completedModules, course]);
  
  const handleModuleSelect = (module: CourseModule) => {
    setCurrentModule(module);
  };
  
  const handleMarkComplete = () => {
    if (!currentModule) return;
    
    // Add to completed modules if not already included
    if (!completedModules.includes(currentModule.id)) {
      const updatedCompletedModules = [...completedModules, currentModule.id];
      setCompletedModules(updatedCompletedModules);
      
      // In a real application, update the progress in the database
      toast.success("Module marked as completed!");
      
      // Move to the next module if available
      if (course) {
        const currentIndex = course.modules.findIndex(m => m.id === currentModule.id);
        if (currentIndex < course.modules.length - 1) {
          setCurrentModule(course.modules[currentIndex + 1]);
        }
      }
    }
  };
  
  if (loadingCourses || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ifind-teal"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="lg:flex gap-8">
          <div className="lg:w-3/4">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="text-muted-foreground mb-6">
              <span>Your progress: {progress}%</span>
              <Progress value={progress} className="mt-2" />
            </div>
            
            <Tabs defaultValue="video" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="video">Video Lesson</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="video" className="space-y-4">
                {currentModule && (
                  <>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border">
                      <iframe
                        className="w-full h-full"
                        src={currentModule.videoUrl}
                        title={currentModule.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{currentModule.title}</h2>
                        <p className="text-muted-foreground">{currentModule.duration}</p>
                      </div>
                      
                      <Button 
                        onClick={handleMarkComplete}
                        disabled={completedModules.includes(currentModule.id)}
                      >
                        {completedModules.includes(currentModule.id) ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          'Mark as Complete'
                        )}
                      </Button>
                    </div>
                    
                    {currentModule.description && (
                      <p className="text-muted-foreground">{currentModule.description}</p>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="bg-muted/40 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">My Notes</h2>
                  <p className="text-muted-foreground mb-4">
                    Take notes as you watch the videos to help reinforce your learning.
                  </p>
                  <textarea 
                    className="w-full border rounded-md p-3 h-40"
                    placeholder="Type your notes here..."
                  ></textarea>
                  <Button className="mt-4">Save Notes</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="bg-muted/40 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Resources</h2>
                  <p className="text-muted-foreground mb-4">
                    Download supporting materials for this course.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Worksheet - Module 1.pdf
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Practice Exercises.pdf
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Further Reading.pdf
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:w-1/4">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 border-b">
                <h3 className="font-semibold">Course Content</h3>
                <p className="text-sm text-muted-foreground">
                  {completedModules.length} of {course.modules.length} completed
                </p>
              </div>
              
              <div className="divide-y">
                {course.modules.map((module, index) => {
                  const isCompleted = completedModules.includes(module.id);
                  const isCurrent = currentModule?.id === module.id;
                  
                  return (
                    <div 
                      key={module.id}
                      className={`
                        p-4 cursor-pointer flex items-start gap-3
                        ${isCurrent ? 'bg-muted/50' : ''}
                        ${isCompleted ? 'text-muted-foreground' : ''}
                      `}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-ifind-teal" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {module.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseView;
