
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Clock } from 'lucide-react';

interface ProfessionalInfoSectionProps {
  formData: {
    specialization: string;
    experience: string;
    bio: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfessionalInfoSection: React.FC<ProfessionalInfoSectionProps> = ({ 
  formData, 
  handleChange 
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="specialization" className="text-sm font-medium">
            Specialization
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="specialization"
              name="specialization"
              type="text"
              className="pl-10"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium">
            Years of Experience
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="experience"
              name="experience"
              type="text"
              className="pl-10"
              value={formData.experience}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Professional Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
    </>
  );
};

export default ProfessionalInfoSection;
