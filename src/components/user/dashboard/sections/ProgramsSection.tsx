
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ExternalLink } from 'lucide-react';
import LMSAccess from '../lms/LMSAccess';

interface ProgramsSectionProps {
  user?: UserProfile;
}

const ProgramsSection: React.FC<ProgramsSectionProps> = ({ user }) => {
  const enrolledPrograms = user?.enrolled_courses || [];
  
  // Filter programs by completion status
  const completedPrograms = enrolledPrograms.filter(program => program.completed);
  
  const renderProgramsGrid = (programs: any[], emptyMessage: string) => {
    if (programs.length === 0) {
      return (
        <div className="bg-muted p-12 rounded-lg text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          <p className="text-muted-foreground mb-6">
            {emptyMessage.includes('completed') ? 
              "You haven't completed any programs yet. Keep learning to see your achievements here!" :
              "You don't have any programs. Start your learning journey today!"
            }
          </p>
          {!emptyMessage.includes('completed') && (
            <Button asChild>
              <Link to="/programs">Browse Programs</Link>
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program, index) => (
          <Card key={program.id || index} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video relative bg-muted">
                {program.image ? (
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
                    <BookOpen className="h-12 w-12 text-white opacity-75" />
                  </div>
                )}
                
                <Badge className={`absolute top-2 right-2 ${program.completed ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {program.completed ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
              <CardDescription className="mb-3">
                By {program.expert_name}
              </CardDescription>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{program.progress || 0}%</span>
                  </div>
                  <Progress value={program.progress || 0} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> 
                    <span>{program.duration || '4 weeks'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> 
                    <span>{program.enrollment_date ? new Date(program.enrollment_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline" asChild>
                <Link to={`/programs/${program.id}`}>View Details</Link>
              </Button>
              <Button variant={program.completed ? "outline" : "default"}>
                {program.completed ? 'Review' : 'Continue Learning'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Programs</h2>
        <p className="text-muted-foreground mb-6">Your enrolled programs, courses, and learning materials</p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Current/Upcoming Courses</TabsTrigger>
          <TabsTrigger value="completed">Completed Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="mt-6">
          <LMSAccess user={user} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {renderProgramsGrid(completedPrograms, "No Completed Programs")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramsSection;
