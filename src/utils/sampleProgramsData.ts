
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/programs';

const wellnessProgramsData: Omit<Program, 'id' | 'created_at'>[] = [
  // QuickEase Programs
  {
    title: "5-Minute Stress Relief",
    description: "Quick and effective stress relief techniques that you can use anywhere, anytime.",
    category: "quick-ease",
    price: 999,
    duration: "1 week",
    sessions: 7,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 1205,
    is_featured: true
  },
  {
    title: "Instant Calm Techniques",
    description: "Learn breathing and mindfulness techniques for immediate anxiety relief.",
    category: "quick-ease",
    price: 799,
    duration: "3 days",
    sessions: 3,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 892
  },
  // Resilience Building Programs
  {
    title: "Building Emotional Resilience",
    description: "Develop the skills to bounce back from life's challenges with greater strength.",
    category: "resilience-building",
    price: 2499,
    duration: "8 weeks",
    sessions: 16,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 654,
    is_featured: true
  },
  {
    title: "Stress Management Mastery",
    description: "Comprehensive program to develop long-term stress management strategies.",
    category: "resilience-building",
    price: 1999,
    duration: "6 weeks",
    sessions: 12,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 423
  },
  // Super Human Programs
  {
    title: "Peak Performance Mindset",
    description: "Unlock your full potential and achieve extraordinary results in all areas of life.",
    category: "super-human",
    price: 4999,
    duration: "12 weeks",
    sessions: 24,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 267,
    is_featured: true
  },
  {
    title: "Mental Excellence Training",
    description: "Advanced mental training for peak cognitive performance and clarity.",
    category: "super-human",
    price: 3999,
    duration: "10 weeks",
    sessions: 20,
    image: "/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png",
    programType: "wellness",
    enrollments: 189
  }
];

const businessProgramsData: Omit<Program, 'id' | 'created_at'>[] = [
  {
    title: "Workplace Mental Health Strategy",
    description: "Comprehensive mental health solutions for organizations to support employee wellbeing.",
    category: "Leadership",
    price: 9999,
    duration: "6 months",
    sessions: 24,
    image: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    programType: "business",
    enrollments: 45
  },
  {
    title: "Team Resilience Building",
    description: "Build stronger, more resilient teams through evidence-based mental health practices.",
    category: "Team Building",
    price: 7499,
    duration: "3 months",
    sessions: 12,
    image: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    programType: "business",
    enrollments: 67
  },
  {
    title: "Executive Stress Management",
    description: "Specialized stress management program designed for executives and leadership teams.",
    category: "Leadership",
    price: 12999,
    duration: "4 months",
    sessions: 16,
    image: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    programType: "business",
    enrollments: 23
  }
];

const academicProgramsData: Omit<Program, 'id' | 'created_at'>[] = [
  {
    title: "Student Mental Health Support",
    description: "Comprehensive mental health program designed for educational institutions.",
    category: "Study Skills",
    price: 5999,
    duration: "1 semester",
    sessions: 18,
    image: "/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png",
    programType: "academic",
    enrollments: 156
  },
  {
    title: "Faculty Wellness Program",
    description: "Mental wellness support specifically designed for educators and academic staff.",
    category: "Stress Reduction",
    price: 4999,
    duration: "3 months",
    sessions: 12,
    image: "/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png",
    programType: "academic",
    enrollments: 89
  }
];

export const addSamplePrograms = async (type: 'wellness' | 'business' | 'academic' = 'wellness') => {
  try {
    let programsData: Omit<Program, 'id' | 'created_at'>[] = [];
    
    switch (type) {
      case 'wellness':
        programsData = wellnessProgramsData;
        break;
      case 'business':
        programsData = businessProgramsData;
        break;
      case 'academic':
        programsData = academicProgramsData;
        break;
    }

    // Check if programs already exist to avoid duplicates
    const { data: existingPrograms } = await supabase
      .from('programs')
      .select('title, programType')
      .eq('programType', type);

    const existingTitles = existingPrograms?.map(p => p.title) || [];
    const newPrograms = programsData.filter(p => !existingTitles.includes(p.title));

    if (newPrograms.length > 0) {
      const { error } = await supabase
        .from('programs')
        .insert(newPrograms);

      if (error) {
        console.error(`Error adding ${type} programs:`, error);
      } else {
        console.log(`Successfully added ${newPrograms.length} new ${type} programs`);
      }
    } else {
      console.log(`${type} programs already exist`);
    }
  } catch (error) {
    console.error(`Error in addSamplePrograms for ${type}:`, error);
  }
};

// Clean up function to remove incorrectly categorized programs
export const cleanupIncorrectPrograms = async () => {
  try {
    // Remove any super-human programs that were incorrectly placed in business
    const { error } = await supabase
      .from('programs')
      .delete()
      .eq('programType', 'business')
      .in('title', ['Peak Performance Mindset', 'Mental Excellence Training']);

    if (error) {
      console.error('Error cleaning up incorrect programs:', error);
    } else {
      console.log('Successfully cleaned up incorrectly categorized programs');
    }
  } catch (error) {
    console.error('Error in cleanupIncorrectPrograms:', error);
  }
};
