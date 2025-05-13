
import { useState, useEffect } from 'react';
import { Course, CourseModule } from '@/types/courses';

// Mock data for courses
const mockCourses: Course[] = [
  {
    id: "rel-counseling-101",
    title: "Relationship Counseling",
    description: "Learn effective techniques to improve communication and resolve conflicts in all types of relationships, from romantic partners to family members and friends.",
    introVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/lovable-uploads/58321caf-3b5b-4a9d-91a1-44514ae2000b.png",
    color: "bg-red-100",
    icon: "heart",
    price: 2499,
    duration: "4 weeks",
    totalModules: 8,
    outcomes: [
      "Develop effective communication skills",
      "Learn conflict resolution techniques",
      "Identify unhealthy relationship patterns",
      "Establish healthy boundaries",
      "Rebuild trust and intimacy"
    ],
    modules: [
      {
        id: "rc-mod-1",
        title: "Understanding Relationship Dynamics",
        description: "Learn about attachment styles and their impact on relationships",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "45 min",
        order: 1
      },
      {
        id: "rc-mod-2",
        title: "Communication Fundamentals",
        description: "Master the art of active listening and expressing needs clearly",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "50 min",
        order: 2
      },
      {
        id: "rc-mod-3",
        title: "Conflict Resolution Strategies",
        description: "Practical techniques for resolving disagreements constructively",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "55 min",
        order: 3
      }
    ],
    enrollmentCount: 1245,
    rating: 4.8,
    instructorName: "Dr. Sarah Johnson",
    instructorTitle: "Relationship Therapist",
    instructorImageUrl: "/placeholder.svg",
    category: "issue-based",
    href: "/course/rel-counseling-101"
  },
  {
    id: "anxiety-depression-101",
    title: "Anxiety & Depression",
    description: "Learn evidence-based techniques to manage anxiety, depression, and stress with guidance from licensed therapists.",
    introVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    color: "bg-blue-100",
    icon: "brain",
    price: 1999,
    duration: "6 weeks",
    totalModules: 12,
    outcomes: [
      "Understand the root causes of anxiety and depression",
      "Develop daily practices for mental wellbeing",
      "Learn cognitive behavioral techniques",
      "Create personalized coping strategies",
      "Build resilience for long-term mental health"
    ],
    modules: [
      {
        id: "ad-mod-1",
        title: "Understanding Mental Health Basics",
        description: "Learn about the science behind anxiety and depression",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "40 min",
        order: 1
      },
      {
        id: "ad-mod-2",
        title: "Cognitive Behavioral Techniques",
        description: "Practical exercises to challenge negative thought patterns",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "45 min",
        order: 2
      }
    ],
    enrollmentCount: 2134,
    rating: 4.9,
    instructorName: "Dr. Michael Carter",
    instructorTitle: "Clinical Psychologist",
    instructorImageUrl: "/placeholder.svg",
    category: "issue-based",
    href: "/course/anxiety-depression-101"
  }
];

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real app, we would fetch from an API
        // For now, use mock data
        console.log("Loading courses data...");
        setCourses(mockCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}
