
import { Program, ProgramUpdate, ProgramType } from '@/types/programs';

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
    category: data.category || 'wellness',
    programType: data.programType as ProgramType || 'wellness',
    created_at: data.created_at || new Date().toISOString(),
    enrollments: data.enrollments || 0,
    is_favorite: data.is_favorite || false,
    is_featured: data.is_featured || false
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
    category: program.category || 'wellness',
    programType: program.programType as ProgramType || 'wellness',
    created_at: program.created_at || new Date().toISOString(),
    enrollments: program.enrollments || 0,
    is_favorite: program.is_favorite || false,
    is_featured: program.is_featured || false
  }));
};
