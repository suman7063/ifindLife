
import React from 'react';
import LMSIntegration from './LMSIntegration';
import { UserProfile } from '@/types/database/unified';

interface LMSAccessProps {
  user?: UserProfile;
}

// Mock data for demonstration - this would typically come from your backend
const mockLMSCourses = [
  {
    id: 'lms-course-1',
    title: 'Mindfulness and Stress Reduction',
    description: 'Learn practical techniques for managing stress and building resilience through mindfulness practices.',
    instructor: 'Dr. Sarah Johnson',
    duration: '6 weeks',
    progress: 45,
    status: 'in_progress' as const,
    lmsUrl: 'https://lms.example.com/courses/mindfulness-stress-reduction',
    thumbnailUrl: '/lovable-uploads/mindfulness-course.jpg',
    enrollmentDate: '2024-01-15'
  },
  {
    id: 'lms-course-2',
    title: 'Cognitive Behavioral Therapy Basics',
    description: 'Introduction to CBT principles and techniques for emotional regulation and thought management.',
    instructor: 'Prof. Michael Chen',
    duration: '8 weeks',
    progress: 100,
    status: 'completed' as const,
    lmsUrl: 'https://lms.example.com/courses/cbt-basics',
    thumbnailUrl: '/lovable-uploads/cbt-course.jpg',
    enrollmentDate: '2023-11-20'
  },
  {
    id: 'lms-course-3',
    title: 'Building Emotional Intelligence',
    description: 'Develop your emotional awareness and interpersonal skills for better relationships.',
    instructor: 'Dr. Emily Rodriguez',
    duration: '4 weeks',
    progress: 0,
    status: 'not_started' as const,
    lmsUrl: 'https://lms.example.com/courses/emotional-intelligence',
    enrollmentDate: '2024-02-01'
  }
];

const LMSAccess: React.FC<LMSAccessProps> = ({ user }) => {
  const handleAccessCourse = (courseId: string, lmsUrl: string) => {
    console.log(`Accessing course ${courseId} at ${lmsUrl}`);
    // Here you would typically:
    // 1. Log the course access in your database
    // 2. Update user progress
    // 3. Send analytics data
  };

  return (
    <LMSIntegration 
      enrolledCourses={mockLMSCourses}
      onAccessCourse={handleAccessCourse}
    />
  );
};

export default LMSAccess;
