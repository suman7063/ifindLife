
import { Program, ProgramType } from '@/types/programs';
import { from } from '@/lib/supabase';
import { fixProgramImages } from './programImageFix';

// Function to check if sample programs already exist and add them if not
export const addSamplePrograms = async (programType: ProgramType = 'wellness'): Promise<boolean> => {
  try {
    // Check if programs of the specified type already exist
    const { data, error } = await from('programs')
      .select('id')
      .eq('programType', programType);
      
    if (error) throw error;
    
    // If programs of the specified type already exist, don't add samples
    if (data && data.length > 0) {
      return false;
    }

    // Get sample programs for the specified type
    const samplePrograms = getSampleProgramsForType(programType);
    
    // Insert sample programs
    const { error: insertError } = await from('programs')
      .insert(samplePrograms);
      
    if (insertError) throw insertError;
    
    // Fix program images if needed
    await fixProgramImages();
    
    console.log(`Added sample ${programType} programs to the database`);
    return true;
  } catch (error) {
    console.error('Error adding sample programs:', error);
    return false;
  }
};

// Get sample programs based on program type
const getSampleProgramsForType = (programType: ProgramType): Omit<Program, 'id' | 'created_at'>[] => {
  switch (programType) {
    case 'wellness':
      return wellnessPrograms;
    case 'academic':
      return academicPrograms;
    case 'business':
      return businessPrograms;
    default:
      return wellnessPrograms;
  }
};

// Wellness Programs (Individual/Personal)
const wellnessPrograms: Omit<Program, 'id' | 'created_at'>[] = [
  {
    title: 'Mindfulness Basics',
    description: 'Learn the fundamentals of mindfulness meditation and its application in daily life to reduce stress and increase focus.',
    duration: '4 weeks',
    sessions: 8,
    price: 3999,
    image: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 124
  },
  {
    title: 'Anxiety Management',
    description: 'Develop practical tools and techniques to manage anxiety symptoms and build resilience in challenging situations.',
    duration: '6 weeks',
    sessions: 12,
    price: 5999,
    image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 98
  },
  {
    title: 'Sleep Improvement',
    description: 'Transform your sleep habits with evidence-based strategies for better sleep quality and overall well-being.',
    duration: '3 weeks',
    sessions: 6,
    price: 2499,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 156
  },
  {
    title: 'Resilience Building Intensive',
    description: 'Develop psychological strength and emotional agility to bounce back from adversity and thrive despite challenges.',
    duration: '8 weeks',
    sessions: 16,
    price: 7999,
    image: 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'wellness',
    enrollments: 78
  },
  {
    title: 'Emotional Intelligence Mastery',
    description: 'Enhance your ability to recognize, understand, and manage emotions while building stronger relationships.',
    duration: '10 weeks',
    sessions: 20,
    price: 8999,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'wellness',
    enrollments: 64
  },
  {
    title: 'Trauma Recovery & Growth',
    description: 'A supportive program for processing past trauma and building a foundation for post-traumatic growth.',
    duration: '12 weeks',
    sessions: 24,
    price: 9999,
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'wellness',
    enrollments: 45
  },
  {
    title: 'High Performance Mind',
    description: 'Elite mental training techniques used by top performers to achieve flow states and maximum productivity.',
    duration: '10 weeks',
    sessions: 20,
    price: 11999,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'wellness',
    enrollments: 89
  },
  {
    title: 'Cognitive Enhancement',
    description: 'Science-backed methods to improve memory, focus, creativity, and overall cognitive performance.',
    duration: '8 weeks',
    sessions: 16,
    price: 9999,
    image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'wellness',
    enrollments: 76
  },
  {
    title: 'Optimal Living Blueprint',
    description: 'A comprehensive approach to optimizing all areas of life: mental, physical, emotional, and spiritual.',
    duration: '12 weeks',
    sessions: 24,
    price: 13999,
    image: 'https://images.unsplash.com/photo-1545205597-3d9d1c4be103?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'wellness',
    enrollments: 52
  },
  {
    title: 'Depression Recovery Path',
    description: 'A structured approach to understanding and managing depression through evidence-based techniques.',
    duration: '10 weeks',
    sessions: 20,
    price: 8499,
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'issue-based',
    programType: 'wellness',
    enrollments: 67
  },
  {
    title: 'Addiction Freedom',
    description: 'Break free from behavioral and substance dependencies with this comprehensive recovery program.',
    duration: '12 weeks',
    sessions: 24,
    price: 9499,
    image: 'https://images.unsplash.com/photo-1527188261929-48878f0a1672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'issue-based',
    programType: 'wellness',
    enrollments: 41
  },
  {
    title: 'PTSD Healing Journey',
    description: 'Specialized support and techniques for those dealing with post-traumatic stress disorder.',
    duration: '14 weeks',
    sessions: 28,
    price: 10999,
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'issue-based',
    programType: 'wellness',
    enrollments: 35
  }
];

// Academic Institute Programs - updated to match exactly the specified programs
const academicPrograms: Omit<Program, 'id' | 'created_at'>[] = [
  {
    title: 'Student Counseling Program',
    description: 'Comprehensive mental health support for students dealing with academic pressure, social challenges, and personal growth. Our trained counselors provide a safe space for students to address their concerns and develop coping strategies.',
    duration: '16 weeks',
    sessions: 32,
    price: 79999,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building', // These categories won't be used for filtering
    programType: 'academic',
    enrollments: 23
  },
  {
    title: 'Teacher Mental Health Support',
    description: 'Specialized support for educators to manage stress, prevent burnout, and maintain wellbeing while nurturing student success. Includes skill-building workshops, peer support groups, and individual coaching.',
    duration: '12 weeks',
    sessions: 24,
    price: 69999,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'academic',
    enrollments: 18
  },
  {
    title: 'Crisis Intervention Resources',
    description: 'Equip your educational institution with protocols, training, and support systems for mental health crisis management. Includes emergency response protocols, staff training, and post-crisis support mechanisms.',
    duration: '8 weeks',
    sessions: 16,
    price: 89999,
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'academic',
    enrollments: 12
  },
  {
    title: 'Bullying Prevention Strategies',
    description: 'Comprehensive approach to creating a safe, inclusive environment through prevention, intervention, and community building. This program employs evidence-based strategies to reduce bullying incidents and create a positive school culture.',
    duration: '10 weeks',
    sessions: 20,
    price: 59999,
    image: 'https://images.unsplash.com/photo-1609234656502-0149f9610c52?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'academic',
    enrollments: 15
  },
  {
    title: 'Wellness Workshops for Campus Life',
    description: 'Interactive workshops designed to foster wellness culture across campus through student engagement and peer support. Topics include stress management, healthy relationships, time management, and mindfulness practices.',
    duration: '6 weeks',
    sessions: 12,
    price: 49999,
    image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'resilience-building',
    programType: 'academic',
    enrollments: 21
  }
];

// Business Programs - updated to match exactly the specified programs
const businessPrograms: Omit<Program, 'id' | 'created_at'>[] = [
  {
    title: 'Employee Wellness Program',
    description: 'Comprehensive mental health support for your workforce, improving productivity, reducing absenteeism, and fostering wellbeing. Includes stress management workshops, mindfulness training, and resources for work-life balance.',
    duration: '12 weeks',
    sessions: 24,
    price: 99999,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human', // These categories won't be used for filtering
    programType: 'business',
    enrollments: 16
  },
  {
    title: 'Leadership Mental Fitness Training',
    description: 'Equip leaders with advanced psychological tools to handle pressure, make clear decisions, and inspire team resilience. This program develops emotional intelligence, strategic thinking, and crisis management skills.',
    duration: '10 weeks',
    sessions: 20,
    price: 129999,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'business',
    enrollments: 9
  },
  {
    title: 'Workplace Stress Management',
    description: 'Transform your organization\'s approach to stress with evidence-based techniques for individual and collective resilience. Learn to identify stress triggers, implement practical coping strategies, and create supportive workplace cultures.',
    duration: '8 weeks',
    sessions: 16,
    price: 79999,
    image: 'https://images.unsplash.com/photo-1573497620292-6379eca7155a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'business',
    enrollments: 14
  },
  {
    title: 'Team Building for Psychological Safety',
    description: 'Build high-performing teams founded on trust, openness, and psychological safety with structured exercises and facilitation. This program enhances communication, collaboration, and innovation through psychological safety principles.',
    duration: '6 weeks',
    sessions: 12,
    price: 69999,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'business',
    enrollments: 20
  },
  {
    title: 'Burnout Prevention Strategies',
    description: 'Proactive approach to identifying burnout risk factors and implementing sustainable work practices for long-term wellbeing. Includes organizational assessment, policy review, and creating recovery-friendly workplace practices.',
    duration: '8 weeks',
    sessions: 16,
    price: 89999,
    image: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80',
    category: 'super-human',
    programType: 'business',
    enrollments: 11
  }
];

