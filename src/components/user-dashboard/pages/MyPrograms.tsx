
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, Star, Play, ExternalLink } from 'lucide-react';
import LMSIntegration from '../LMSIntegration';

const MyPrograms: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Sample LMS courses data
  const lmsCourses = [
    {
      id: 'lms-1',
      title: 'Stress Management Fundamentals',
      description: 'Learn practical techniques to manage daily stress and build resilience.',
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      duration: '6 weeks',
      instructor: 'Dr. Sarah Wilson',
      lmsUrl: 'https://lms.example.com/courses/stress-management',
      isAccessible: true,
      certificateAvailable: true
    },
    {
      id: 'lms-2',
      title: 'Mindfulness & Meditation Mastery',
      description: 'Develop a consistent mindfulness practice with guided meditation sessions.',
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      duration: '8 weeks',
      instructor: 'Dr. Michael Chen',
      lmsUrl: 'https://lms.example.com/courses/mindfulness',
      isAccessible: true,
      certificateAvailable: true
    }
  ];

  const activePrograms = [
    {
      id: '1',
      title: 'Stress Management Mastery',
      expert: 'Dr. Sarah Wilson',
      progress: 65,
      totalSessions: 8,
      completedSessions: 5,
      nextSession: 'Today, 2:00 PM',
      status: 'In Progress',
      image: '/lovable-uploads/stress-management.jpg',
      hasLMSComponent: true
    },
    {
      id: '2',
      title: 'Mindfulness & Meditation',
      expert: 'Dr. Michael Chen',
      progress: 40,
      totalSessions: 12,
      completedSessions: 4,
      nextSession: 'Tomorrow, 10:00 AM',
      status: 'In Progress',
      image: '/lovable-uploads/mindfulness.jpg',
      hasLMSComponent: true
    }
  ];

  const completedPrograms = [
    {
      id: '3',
      title: 'Anxiety Relief Program',
      expert: 'Dr. Emily Rodriguez',
      progress: 100,
      totalSessions: 6,
      completedSessions: 6,
      completedDate: '2024-01-15',
      status: 'Completed',
      rating: 5,
      image: '/lovable-uploads/anxiety-relief.jpg',
      hasLMSComponent: false
    }
  ];

  const ProgramCard = ({ program, isCompleted = false }: { program: any; isCompleted?: boolean }) => (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {program.status}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-semibold text-lg">{program.title}</h3>
          <p className="text-sm opacity-90">{program.expert}</p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{program.progress}%</span>
          </div>
          <Progress value={program.progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span>{program.completedSessions}/{program.totalSessions} sessions</span>
            </div>
            {isCompleted && program.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{program.rating}/5</span>
              </div>
            )}
          </div>

          {!isCompleted ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Next: {program.nextSession}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Completed: {new Date(program.completedDate).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!isCompleted ? (
              <>
                <Button size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </Button>
                <Button size="sm" variant="outline">
                  Schedule
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="flex-1">
                  View Certificate
                </Button>
                <Button size="sm" variant="outline">
                  Retake
                </Button>
              </>
            )}
          </div>

          {/* LMS Access Button */}
          {program.hasLMSComponent && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Online Course Materials</p>
              <Button size="sm" variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access Course Platform
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Programs</h2>
        <p className="text-gray-600 mt-2">
          Track your progress and manage your mental health programs
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Programs ({activePrograms.length})</TabsTrigger>
          <TabsTrigger value="courses">Online Courses ({lmsCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPrograms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activePrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Programs</h3>
                <p className="text-gray-600 text-center mb-4">
                  You don't have any active programs. Start your mental health journey today!
                </p>
                <Button>Browse Programs</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Online Learning Platform</h3>
              <p className="text-blue-700 text-sm">
                Access your purchased course materials through our integrated learning management system. 
                Track your progress, complete assignments, and earn certificates.
              </p>
            </div>
            <LMSIntegration courses={lmsCourses} />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} isCompleted />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Programs</h3>
                <p className="text-gray-600 text-center">
                  Complete your first program to see it here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyPrograms;
