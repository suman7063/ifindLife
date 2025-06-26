
import { Program, ProgramUpdate, ProgramType, ProgramCategory } from '@/types/programs';
import { z } from 'zod';

// Form validation schema
export const programFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.string().min(1, 'Duration is required'),
  sessions: z.number().min(1, 'Sessions must be greater than 0'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  image: z.string().min(1, 'Image URL is required'),
  category: z.string().min(1, 'Category is required'),
  programType: z.enum(['wellness', 'academic', 'business', 'productivity', 'leadership']),
  is_favorite: z.boolean().optional(),
  is_featured: z.boolean().optional()
});

export type ProgramFormValues = z.infer<typeof programFormSchema>;

export const validateProgramForm = (data: ProgramUpdate): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Description is required');
  }
  
  if (!data.duration?.trim()) {
    errors.push('Duration is required');
  }
  
  if (!data.image?.trim()) {
    errors.push('Image URL is required');
  }
  
  if (!data.category?.trim()) {
    errors.push('Category is required');
  }
  
  if (!data.sessions || data.sessions <= 0) {
    errors.push('Sessions must be greater than 0');
  }
  
  if (!data.price || data.price < 0) {
    errors.push('Price must be 0 or greater');
  }
  
  return errors;
};

export const formatProgramData = (data: any): Program => {
  return {
    id: data.id || 0,
    title: data.title || '',
    description: data.description || '',
    duration: data.duration || '',
    sessions: data.sessions || 1,
    price: data.price || 0,
    image: data.image || '',
    category: data.category as ProgramCategory || 'wellness',
    programType: data.programType as ProgramType || 'wellness',
    created_at: data.created_at || new Date().toISOString(),
    enrollments: data.enrollments || 0,
    is_favorite: data.is_favorite || false,
    is_featured: data.is_featured || false
  };
};

export const prepareProgramData = (values: ProgramFormValues, id?: number): Program => {
  return {
    id: id || 0,
    title: values.title,
    description: values.description,
    duration: values.duration,
    sessions: values.sessions,
    price: values.price,
    image: values.image,
    category: values.category as ProgramCategory,
    programType: values.programType,
    created_at: new Date().toISOString(),
    enrollments: 0,
    is_favorite: values.is_favorite || false,
    is_featured: values.is_featured || false
  };
};

export const getProgramFormDefaults = (program: Program | null): ProgramFormValues => {
  if (!program) {
    return {
      title: '',
      description: '',
      duration: '',
      sessions: 1,
      price: 0,
      image: '',
      category: 'wellness',
      programType: 'wellness',
      is_favorite: false,
      is_featured: false
    };
  }

  return {
    title: program.title,
    description: program.description,
    duration: program.duration,
    sessions: program.sessions,
    price: program.price,
    image: program.image,
    category: program.category,
    programType: program.programType,
    is_favorite: program.is_favorite || false,
    is_featured: program.is_featured || false
  };
};

export const formatProgramsArray = (programs: any[]): Program[] => {
  return programs.map(program => ({
    id: program.id || 0,
    title: program.title || '',
    description: program.description || '',
    duration: program.duration || '',
    sessions: program.sessions || 1,
    price: program.price || 0,
    image: program.image || '',
    category: program.category as ProgramCategory || 'wellness',
    programType: program.programType as ProgramType || 'wellness',
    created_at: program.created_at || new Date().toISOString(),
    enrollments: program.enrollments || 0,
    is_favorite: program.is_favorite || false,
    is_featured: program.is_featured || false
  }));
};
