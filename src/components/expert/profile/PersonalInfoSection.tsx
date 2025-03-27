
import React from 'react';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        Full Name
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          id="name"
          name="name"
          type="text"
          className="pl-10"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
