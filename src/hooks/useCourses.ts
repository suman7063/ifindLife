
import { useState, useEffect } from 'react';
import { Course } from '@/types/courses';
import { Session } from '@/components/admin/sessions/types';
import { toast } from 'sonner';

// This is a mock implementation that would be replaced with Supabase fetch logic
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would be fetched from Supabase
        // For now, we'll create mock data based on existing sessions
        const storedSessions = localStorage.getItem('ifindlife-sessions');
        let sessions: Session[] = [];
        
        if (storedSessions) {
          sessions = JSON.parse(storedSessions);
        }
        
        // Convert sessions to courses (mock data)
        const mockCourses: Course[] = sessions.map((session, index) => ({
          id: session.id || `course-${index}`,
          title: session.title,
          description: session.description,
          introVideoUrl: "https://www.youtube.com/embed/0J_Vg-uWY-k",
          thumbnailUrl: "https://picsum.photos/800/450",
          color: session.color,
          icon: session.icon,
          price: 1499 + (index * 500), // Mock price in INR
          duration: `${30 + (index * 15)} minutes`,
          totalModules: 4 + (index % 3),
          outcomes: [
            "Understand the root causes",
            "Develop practical coping strategies",
            "Build resilience for long-term well-being",
            "Create a personalized action plan"
          ],
          modules: Array(4 + (index % 3)).fill(0).map((_, moduleIndex) => ({
            id: `module-${index}-${moduleIndex}`,
            title: `Module ${moduleIndex + 1}: ${['Introduction', 'Understanding', 'Strategies', 'Practice', 'Mastery'][moduleIndex % 5]}`,
            description: "Learn key concepts and practical techniques in this comprehensive module.",
            videoUrl: "https://www.youtube.com/embed/0J_Vg-uWY-k",
            duration: `${(moduleIndex + 1) * 5}:00`,
            order: moduleIndex
          })),
          enrollmentCount: Math.floor(Math.random() * 1000),
          rating: 4 + (Math.random() * 1) - 0.5,
          instructorName: "Dr. Sarah Johnson",
          instructorTitle: "Clinical Psychologist, Ph.D",
          instructorImageUrl: "https://picsum.photos/100/100",
          category: session.title.toLowerCase().replace(/\s+/g, '-'),
          href: `/courses/${session.title.toLowerCase().replace(/\s+/g, '-')}`,
        }));
        
        setCourses(mockCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const getCourseById = (id: string): Course | undefined => {
    return courses.find(course => course.id === id);
  };

  const getCourseBySlug = (slug: string): Course | undefined => {
    return courses.find(course => course.href.includes(slug));
  };

  return {
    courses,
    loading,
    error,
    getCourseById,
    getCourseBySlug
  };
}
