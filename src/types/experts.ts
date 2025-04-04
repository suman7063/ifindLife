
export type ExperienceLevel = 'Any' | 'Beginner' | 'Intermediate' | 'Expert';

export interface ExpertSpecialty {
  id: number;
  name: string;
}

export interface ExpertLanguage {
  id: number;
  name: string;
}

// Adding ExpertConsultation type
export interface ExpertConsultation {
  id: number;
  expertId: string | number;
  userId: string;
  date: string;
  duration: number;
  status: string;
  rating?: number;
}
