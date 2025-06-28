
import React from 'react';
import { UserProfile } from '@/types/database/unified';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

interface ProgressTrackingSectionProps {
  user?: UserProfile;
}

const ProgressTrackingSection: React.FC<ProgressTrackingSectionProps> = ({ user }) => {
  // Mock progress data - in a real app, this would come from the database
  const progressData = {
    overallProgress: 65,
    currentGoals: [
      { id: 1, title: 'Complete Mindfulness Program', progress: 75, target: 100, category: 'Wellness' },
      { id: 2, title: 'Weekly Therapy Sessions', progress: 3, target: 4, category: 'Therapy' },
      { id: 3, title: 'Meditation Streak', progress: 12, target: 30, category: 'Practice' },
    ],
    achievements: [
      { id: 1, title: 'First Session Complete', date: '2024-01-15', icon: Award },
      { id: 2, title: '7-Day Streak', date: '2024-01-20', icon: TrendingUp },
      { id: 3, title: 'Program Milestone', date: '2024-01-25', icon: Target },
    ],
    weeklyStats: {
      sessionsCompleted: 3,
      totalHours: 4.5,
      improvementScore: 8.2
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Progress Tracking</h2>
        <p className="text-muted-foreground">Monitor your wellness journey and achievements</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>Your comprehensive wellness score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{progressData.overallProgress}%</span>
              <Badge variant="secondary">Improving</Badge>
            </div>
            <Progress value={progressData.overallProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              You're making great progress! Keep up the excellent work.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Goals
          </CardTitle>
          <CardDescription>Track your active objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progressData.currentGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">
                    {goal.progress}/{goal.target}
                  </span>
                </div>
                <Progress 
                  value={(goal.progress / goal.target) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.weeklyStats.sessionsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.weeklyStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              +0.5h from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressData.weeklyStats.improvementScore}/10</div>
            <p className="text-xs text-muted-foreground">
              +0.3 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your latest milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressData.achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.id} className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.date}</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTrackingSection;
