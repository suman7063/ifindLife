
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProgressTrackingSectionProps {
  user?: UserProfile;
}

interface CourseProgress {
  id: string;
  title: string;
  expert_name: string;
  progress: number;
  completed: boolean;
  enrollment_date: string;
  total_sessions?: number;
  completed_sessions?: number;
}

interface ProgressStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHoursSpent: number;
  averageProgress: number;
}

const ProgressTrackingSection: React.FC<ProgressTrackingSectionProps> = ({ user }) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursSpent: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProgressData();
    }
  }, [user?.id]);

  const fetchProgressData = async () => {
    try {
      // Fetch user courses with progress
      const { data: courses, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const coursesData = courses || [];
      setCourseProgress(coursesData);

      // Calculate stats
      const totalCourses = coursesData.length;
      const completedCourses = coursesData.filter(c => c.completed).length;
      const inProgressCourses = coursesData.filter(c => !c.completed && c.progress > 0).length;
      const averageProgress = totalCourses > 0 
        ? coursesData.reduce((sum, c) => sum + (c.progress || 0), 0) / totalCourses 
        : 0;

      setStats({
        totalCourses,
        completedCourses,
        inProgressCourses,
        totalHoursSpent: totalCourses * 2, // Estimated hours
        averageProgress: Math.round(averageProgress)
      });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 20) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Progress Tracking</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Progress Tracking</h2>
        <p className="text-muted-foreground">Monitor your learning progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{stats.totalCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
        {courseProgress.length > 0 ? (
          <div className="grid gap-4">
            {courseProgress.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>by {course.expert_name}</CardDescription>
                    </div>
                    <Badge variant={course.completed ? "default" : "secondary"}>
                      {course.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <Progress 
                      value={course.progress || 0} 
                      className={`h-2 ${getProgressColor(course.progress || 0)}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Started: {new Date(course.enrollment_date).toLocaleDateString()}</span>
                      {course.completed && <span>✓ Completed</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted p-12 rounded-lg text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Courses Yet</h3>
            <p className="text-muted-foreground">
              Start your learning journey by enrolling in a course!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTrackingSection;
