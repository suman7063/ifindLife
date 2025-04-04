
import { Program, ProgramType, ProgramCategory } from '@/types/programs';
import { supabase } from '@/lib/supabase';

// Sample program data for wellness seekers
const wellnessPrograms: Partial<Program>[] = [
  {
    title: 'Stress Management Program',
    description: 'Learn techniques to manage stress and anxiety in your daily life with proven methods from expert psychologists.',
    duration: '4 weeks',
    sessions: 6,
    price: 4999,
    image: 'https://source.unsplash.com/random/800x600/?meditation',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 156,
    created_at: new Date().toISOString()
  },
  {
    title: 'Emotional Resilience Building',
    description: 'Develop skills to bounce back from adversity and build emotional strength through guided exercises and support.',
    duration: '6 weeks',
    sessions: 8,
    price: 6999,
    image: 'https://source.unsplash.com/random/800x600/?resilience',
    category: 'resilience-building',
    programType: 'wellness',
    enrollments: 98,
    created_at: new Date().toISOString()
  },
  {
    title: 'Mindfulness for Beginners',
    description: 'Start your mindfulness journey with simple practices that improve focus, reduce stress, and enhance well-being.',
    duration: '3 weeks',
    sessions: 5,
    price: 3499,
    image: 'https://source.unsplash.com/random/800x600/?mindfulness',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 210,
    created_at: new Date().toISOString()
  },
  {
    title: 'Advanced Cognitive Behavioral Therapy',
    description: 'Transform negative thought patterns and behaviors with advanced CBT techniques guided by expert therapists.',
    duration: '8 weeks',
    sessions: 12,
    price: 9999,
    image: 'https://source.unsplash.com/random/800x600/?therapy',
    category: 'super-human',
    programType: 'wellness',
    enrollments: 67,
    created_at: new Date().toISOString()
  },
  {
    title: 'Anxiety Management Workshop',
    description: 'Targeted interventions for managing anxiety through evidence-based approaches and peer support.',
    duration: '5 weeks',
    sessions: 8,
    price: 5499,
    image: 'https://source.unsplash.com/random/800x600/?anxiety',
    category: 'issue-based',
    programType: 'wellness',
    enrollments: 124,
    created_at: new Date().toISOString()
  }
];

// Sample program data for academic institutes
const academicPrograms: Partial<Program>[] = [
  {
    title: 'Student Mental Health Support',
    description: 'Comprehensive program for academic institutions to support student mental health needs and foster a positive learning environment.',
    duration: '12 weeks',
    sessions: 15,
    price: 12999,
    image: 'https://source.unsplash.com/random/800x600/?students',
    category: 'quick-ease',
    programType: 'academic' as ProgramType,
    enrollments: 42,
    created_at: new Date().toISOString()
  },
  {
    title: 'Faculty Wellness Program',
    description: 'Support teacher and professor wellbeing with specialized tools to manage stress and prevent burnout in academic settings.',
    duration: '8 weeks',
    sessions: 10,
    price: 9999,
    image: 'https://source.unsplash.com/random/800x600/?teacher',
    category: 'resilience-building',
    programType: 'academic' as ProgramType,
    enrollments: 36,
    created_at: new Date().toISOString()
  },
  {
    title: 'Campus Crisis Response Training',
    description: 'Prepare academic staff to respond effectively to mental health crises and emergencies on campus.',
    duration: '4 weeks',
    sessions: 6,
    price: 7499,
    image: 'https://source.unsplash.com/random/800x600/?campus',
    category: 'super-human',
    programType: 'academic' as ProgramType,
    enrollments: 28,
    created_at: new Date().toISOString()
  }
];

// Sample program data for businesses
const businessPrograms: Partial<Program>[] = [
  {
    title: 'Workplace Wellness Program',
    description: 'Comprehensive mental health support for organizations to improve employee wellbeing and productivity.',
    duration: '10 weeks',
    sessions: 12,
    price: 14999,
    image: 'https://source.unsplash.com/random/800x600/?workplace',
    category: 'quick-ease',
    programType: 'business' as ProgramType,
    enrollments: 53,
    created_at: new Date().toISOString()
  },
  {
    title: 'Executive Stress Management',
    description: 'Specialized program for executives and leaders to manage high-pressure situations and prevent burnout.',
    duration: '6 weeks',
    sessions: 8,
    price: 19999,
    image: 'https://source.unsplash.com/random/800x600/?executive',
    category: 'resilience-building',
    programType: 'business' as ProgramType,
    enrollments: 31,
    created_at: new Date().toISOString()
  },
  {
    title: 'Team Resilience Building Workshop',
    description: 'Strengthen team cohesion and resilience through collaborative exercises and shared mental health strategies.',
    duration: '5 weeks',
    sessions: 7,
    price: 8999,
    image: 'https://source.unsplash.com/random/800x600/?team',
    category: 'super-human',
    programType: 'business' as ProgramType,
    enrollments: 47,
    created_at: new Date().toISOString()
  }
];

/**
 * Adds sample programs to the database based on program type
 * @param type The type of programs to add (wellness, academic, business)
 * @returns Boolean indicating success
 */
export const addSamplePrograms = async (type: ProgramType): Promise<boolean> => {
  try {
    // Select the appropriate program list based on type
    let programsList: Partial<Program>[] = [];
    
    if (type === 'wellness') {
      programsList = wellnessPrograms;
    } else if (type === 'academic' as ProgramType) {
      programsList = academicPrograms;
    } else if (type === 'business' as ProgramType) {
      programsList = businessPrograms;
    } else {
      console.warn(`Unknown program type: ${type}`);
      return false;
    }
    
    if (programsList.length === 0) {
      return false;
    }
    
    // First check if we already have programs of this type
    const { data: existingPrograms, error: checkError } = await supabase
      .from('programs')
      .select('id')
      .eq('programType', type)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking for existing programs:', checkError);
      return false;
    }
    
    // If we already have programs of this type, don't add more
    if (existingPrograms && existingPrograms.length > 0) {
      console.log(`Programs of type '${type}' already exist, skipping...`);
      return true;
    }
    
    // Add the programs to the database
    const { data, error } = await supabase
      .from('programs')
      .insert(programsList);
      
    if (error) {
      console.error('Error adding sample programs:', error);
      return false;
    }
    
    console.log(`Added ${programsList.length} sample ${type} programs`);
    return true;
  } catch (error) {
    console.error('Error in addSamplePrograms:', error);
    return false;
  }
};
