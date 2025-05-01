
import { Expert } from '../../types';

export interface SectionProps {
  expert: Expert;
  updateExpert: (field: keyof Expert, value: any) => void;
}
