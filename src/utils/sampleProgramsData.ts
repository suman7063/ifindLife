import { Program, ProgramType } from '@/types/programs';
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
    title: 'Mindfulness Meditation Course',
    description: 'A beginner-friendly course to introduce mindfulness and meditation practices for stress reduction and mental clarity.',
    duration: '6 weeks',
    sessions: 8,
    price: 5999,
    image: 'https://source.unsplash.com/random/800x600/?mindfulness',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 120,
    created_at: new Date().toISOString()
  },
  {
    title: 'Yoga for Beginners',
    description: 'Gentle yoga sessions designed for beginners to improve flexibility, reduce stress, and enhance overall wellbeing.',
    duration: '8 weeks',
    sessions: 10,
    price: 6999,
    image: 'https://source.unsplash.com/random/800x6/yoga',
    category: 'quick-ease',
    programType: 'wellness',
    enrollments: 95,
    created_at: new Date().toISOString()
  },
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
    programType: 'wellness',
    enrollments: 42,
    created_at: new Date().toISOString()
  },
  {
    title: 'Academic Stress Reduction Workshop',
    description: 'A workshop designed to equip students with effective strategies to manage academic stress and improve study habits.',
    duration: '2 days',
    sessions: 4,
    price: 2999,
    image: 'https://source.unsplash.com/random/800x600/?workshop',
    category: 'quick-ease',
    programType: 'academic',
    enrollments: 68,
    created_at: new Date().toISOString()
  },
  {
    title: 'Mindful Study Techniques',
    description: 'A program that teaches students how to apply mindfulness techniques to enhance focus and retention during study sessions.',
    duration: '6 weeks',
    sessions: 8,
    price: 5499,
    image: 'https://source.unsplash.com/random/800x600/?studying',
    category: 'quick-ease',
    programType: 'academic',
    enrollments: 55,
    created_at: new Date().toISOString()
  },
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
    programType: 'wellness',
    enrollments: 53,
    created_at: new Date().toISOString()
  },
  {
    title: 'Stress-Free Workplace Workshop',
    description: 'A workshop designed to help employees manage stress and improve their mental wellbeing in the workplace.',
    duration: '2 days',
    sessions: 4,
    price: 3999,
    image: 'https://source.unsplash.com/random/800x600/?office',
    category: 'quick-ease',
    programType: 'business',
    enrollments: 72,
    created_at: new Date().toISOString()
  },
  {
    title: 'Mindfulness for Corporate Teams',
    description: 'A program that teaches corporate teams how to use mindfulness techniques to improve communication and reduce workplace stress.',
    duration: '8 weeks',
    sessions: 10,
    price: 7999,
    image: 'https://source.unsplash.com/random/800x600/?team',
    category: 'quick-ease',
    programType: 'business',
    enrollments: 48,
    created_at: new Date().toISOString()
  },
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
    } else if (type === 'academic') {
      programsList = academicPrograms;
    } else if (type === 'business') {
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
    
    // Convert Partial<Program>[] to the exact type expected by supabase insert
    // by ensuring all required fields are present
    const programsToInsert = programsList.map(program => ({
      title: program.title || '',
      description: program.description || '',
      duration: program.duration || '',
      sessions: program.sessions || 0,
      price: program.price || 0,
      image: program.image || '',
      category: program.category || 'quick-ease',
      programType: program.programType || 'wellness',
      enrollments: program.enrollments || 0,
      created_at: program.created_at || new Date().toISOString()
    }));
    
    // Add the programs to the database
    const { data, error } = await supabase
      .from('programs')
      .insert(programsToInsert);
      
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
