
import { Expert } from '../types';

export interface SectionProps {
  expert: Expert;
  onChange: (field: keyof Expert, value: any) => void;
}
